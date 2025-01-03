import os

import numpy as np
import cv2 as cv
import pytest

from ocr.services.image_segmenter import (
    ImageSegmenter,
    segment_by_color_bounding_box,
)
from ocr.services.image_ocr import ImageOCR
from ocr.services.tesseract_ocr import TesseractOCR


path = os.path.dirname(__file__)

segmentation_template_path = os.path.join(path, "./assets/form_segmention_template.png")
raw_image_path = os.path.join(path, "./assets/form_filled.png")
paragraph_image_path = os.path.join(path, "./assets/ocr_paragraph.png")
labels_path = os.path.join(path, "./assets/labels.json")


class TestOCR:
    @pytest.mark.parametrize("ocr_class", [TesseractOCR, ImageOCR])
    def test_extra_blank_space(self, ocr_class):
        ocr = ocr_class()
        paragraph = cv.imread(paragraph_image_path, cv.IMREAD_COLOR)
        padding = (200, 200, 200, 200)
        paragraph_extra_space = cv.copyMakeBorder(paragraph, *padding, cv.BORDER_CONSTANT, value=(255, 255, 255))
        segment = {"text": paragraph, "text_extra": paragraph_extra_space}
        results = ocr.image_to_text(segment)
        assert results["text"][0] == results["text_extra"][0]

    def test_split_text_blocks(self):
        ocr = ImageOCR()
        img = np.ones([10, 10, 3], np.uint8)
        result = ocr.split_text_blocks(img)
        assert np.array_equiv(result, img)

    @pytest.mark.parametrize("ocr_class", [TesseractOCR, ImageOCR])
    def test_ocr_printed(self, ocr_class):
        segmenter = ImageSegmenter(
            segmentation_function=segment_by_color_bounding_box,
        )
        ocr = ocr_class()

        results = ocr.image_to_text(
            segmenter.load_and_segment(
                raw_image_path,
                segmentation_template_path,
                labels_path,
            )
        )

        patient_id, patient_confidence = results["nbs_patient_id"]
        cas_id, cas_confidence = results["nbs_cas_id"]

        assert patient_id.upper() == "SIENNA HAMPTON"
        assert cas_id == "123555"

    @pytest.mark.parametrize("ocr_class", [TesseractOCR, ImageOCR])
    def test_ocr_paragraph(self, ocr_class):
        ocr = ocr_class()
        segment = {"text": cv.imread(paragraph_image_path, cv.IMREAD_COLOR)}
        results = ocr.image_to_text(segment)
        text, confidence = results["text"]
        assert (
            text.upper().replace("\n", " ")
            == "THIS TEST WAS DEVELOPED AND ITS ANALYTICAL PERFORMANCE CHARACTERISTICS HAVE BEEN DETERMINED BY QUEST DIAGNOSTICS NICHOLS INSTITUTE SAN JUAN CAPISTRANO. IT HAS NOT BEEN CLEARED OR APPROVED BY FDA. THIS ASSAY HAS BEEN VALIDATED PURSUANT TO THE CLIA REGULATIONS AND IS USED FOR CLINICAL PURPOSES."
        )
        assert confidence > 50

    @pytest.mark.parametrize("ocr_class", [TesseractOCR, ImageOCR])
    def test_confidence_values_returned(self, ocr_class):
        segmenter = ImageSegmenter(
            segmentation_function=segment_by_color_bounding_box,
        )
        ocr = ocr_class()

        results = ocr.image_to_text(
            segmenter.load_and_segment(
                raw_image_path,
                segmentation_template_path,
                labels_path,
            )
        )

        patient_id, patient_confidence = results["nbs_patient_id"]
        cas_id, cas_confidence = results["nbs_cas_id"]

        assert patient_confidence > 0
        assert cas_confidence > 0
