import base64

import uvicorn
import json
import cv2 as cv
import numpy as np

from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

from ocr.services.image_ocr import ImageOCR
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


@app.get("/")
async def health_check():
    return {"status": "UP"}


@app.post("/image_file_to_text/")
async def image_file_to_text(source_image: UploadFile, segmentation_template: UploadFile, labels: str = Form()):
    source_image_np = np.frombuffer(await source_image.read(), np.uint8)
    source_image_img = cv.imdecode(source_image_np, cv.IMREAD_COLOR)

    segmentation_template_np = np.frombuffer(await segmentation_template.read(), np.uint8)
    segmentation_template_img = cv.imdecode(segmentation_template_np, cv.IMREAD_COLOR)

    loaded_json = json.loads(labels)
    segments = segmenter.segment(source_image_img, segmentation_template_img, loaded_json)
    results = ocr.image_to_text(segments)

    return results


@app.post("/image_to_text/")
async def image_to_text(source_image: str = Form(), segmentation_template: str = Form(), labels: str = Form()):
    source_image_stripped = source_image.replace("data:image/png;base64,", "", 1)
    source_image_np = np.frombuffer(base64.b64decode(source_image_stripped), np.uint8)
    source_image_img = cv.imdecode(source_image_np, cv.IMREAD_COLOR)

    segmentation_template_stripped = segmentation_template.replace("data:image/png;base64,", "", 1)
    segmentation_template_np = np.frombuffer(base64.b64decode(segmentation_template_stripped), np.uint8)
    segmentation_template_img = cv.imdecode(segmentation_template_np, cv.IMREAD_COLOR)

    loaded_json = json.loads(labels)
    segments = segmenter.segment(source_image_img, segmentation_template_img, loaded_json)
    results = ocr.image_to_text(segments)

    return results


def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
