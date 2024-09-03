import uvicorn
import json
import cv2 as cv
import numpy as np

from fastapi import FastAPI, UploadFile, Form

from ocr.services.image_ocr import ImageOCR
from ocr.services.image_segmenter import ImageSegmenter, segment_by_color_bounding_box

app = FastAPI()
segmenter = ImageSegmenter(
    segmentation_function=segment_by_color_bounding_box,
)
ocr = ImageOCR()


@app.get("/")
async def health_check():
    return {"status": "UP"}


@app.post("/image_to_text/")
async def image_to_text(source_image: UploadFile, segmentation_template: UploadFile, labels: str = Form()):
    source_image_np = np.fromstring(await source_image.read(), np.uint8)
    source_image_img = cv.imdecode(source_image_np, cv.IMREAD_COLOR)

    segmentation_template_np = np.fromstring(await segmentation_template.read(), np.uint8)
    segmentation_template_img = cv.imdecode(segmentation_template_np, cv.IMREAD_COLOR)

    loaded_json = json.loads(labels)
    segments = segmenter.segment(source_image_img, segmentation_template_img, loaded_json)
    results = ocr.image_to_text(segments)

    return results


def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
