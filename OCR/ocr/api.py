import base64

import uvicorn
import json
import cv2 as cv
import numpy as np
import asyncio


from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ocr.services.image_ocr import ImageOCR
from ocr.services.alignment import ImageAligner
from ocr.services.image_segmenter import ImageSegmenter, segment_by_color_bounding_box

app = FastAPI()
origins = [
    "http://localhost:8000",  # Allow requests from this origin
    "http://localhost:5173",  # Add your front-end domain here
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # You can allow specific origins or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
segmenter = ImageSegmenter(
    segmentation_function=segment_by_color_bounding_box,
)
ocr = ImageOCR()


def data_uri_to_image(data_uri: str):
    try:
        base64_data = data_uri.split(",")[1]
        image_data = base64.b64decode(base64_data)
        image_np = np.frombuffer(image_data, np.uint8)
        image = cv.imdecode(image_np, cv.IMREAD_COLOR)
        return image
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to decode source image. Ensure the file is a valid Base64 image format. Error: {str(e)}",
        )


def image_to_data_uri(image: np.ndarray):
    _, encoded = cv.imencode(".png", image)
    return b"data:image/png;base64," + base64.b64encode(encoded)


@app.get("/")
async def health_check():
    return {"status": "UP"}


@app.post("/image_alignment/")
async def image_alignment(source_image: str = Form(), segmentation_template: str = Form()):
    source_image_img = data_uri_to_image(source_image)
    segmentation_template_img = data_uri_to_image(segmentation_template)

    aligner = ImageAligner()
    result = aligner.align(source_image_img, segmentation_template_img)
    return {"result": image_to_data_uri(result)}


@app.post("/image_file_to_text/")
async def image_file_to_text(source_image: UploadFile, segmentation_template: UploadFile, labels: str = Form()):
    try:
        source_image_np = np.frombuffer(await source_image.read(), np.uint8)
        source_image_img = cv.imdecode(source_image_np, cv.IMREAD_COLOR)

        if source_image_img is None:
            raise HTTPException(
                status_code=422, detail="Failed to decode source image. Ensure the file is a valid image format."
            )

        segmentation_template_np = np.frombuffer(await segmentation_template.read(), np.uint8)
        segmentation_template_img = cv.imdecode(segmentation_template_np, cv.IMREAD_COLOR)

        if segmentation_template_img is None:
            raise HTTPException(
                status_code=422,
                detail="Failed to decode segmentation template. Ensure the file is a valid image format.",
            )

        if source_image_img.shape[:2] != segmentation_template_img.shape[:2]:
            raise HTTPException(
                status_code=400,
                detail="Dimension mismatch between source image and segmentation template. Both images must have the same width and height.",
            )

        loaded_json = json.loads(labels)

        segments = segmenter.segment(source_image_img, segmentation_template_img, loaded_json)
        results = ocr.image_to_text(segments)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=422, detail="Failed to parse labels JSON. Ensure the labels are in valid JSON format."
        )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="The request timed out. Please try again.")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected server error occurred.")

    return results


@app.post("/image_to_text")
async def image_to_text(
    source_image: str = Form(...), segmentation_template: str = Form(...), labels: str = Form(...)
):
    try:
        source_image_img = data_uri_to_image(source_image)
        segmentation_template_img = data_uri_to_image(segmentation_template)

        if source_image_img.shape[:2] != segmentation_template_img.shape[:2]:
            raise HTTPException(
                status_code=400,
                detail="Dimension mismatch between source image and segmentation template. Both images must have the same width and height.",
            )

        try:
            loaded_json = json.loads(labels)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=422, detail="Failed to parse labels JSON. Ensure the labels are in valid JSON format."
            )

        segments = segmenter.segment(source_image_img, segmentation_template_img, loaded_json)
        results = ocr.image_to_text(segments)

    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="The request timed out. Please try again.")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected server error occurred.")
    return results


def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
