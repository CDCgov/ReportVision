import os
from ocr.services.image_segmenter import (
    ImageSegmenter,
    segment_by_color_bounding_box,
    segment_by_mask_then_crop,
)
from ocr.services.image_ocr import ImageOCR


path = os.path.dirname(__file__)

segmentation_template = os.path.join(path, "./assets/form_segmention_template.png")
raw_image = os.path.join(path, "./assets/form_filled.png")
raw_image_handwritten = os.path.join(path, "./assets/form_hand_filled.png")
labels_path = os.path.join(path, "./assets/labels.json")


class TestOCR:
    def test_ocr_printed(self):
        segmenter = ImageSegmenter(
            raw_image,
            segmentation_template,
            labels_path,
            segmentation_function=segment_by_color_bounding_box,
        )
        ocr = ImageOCR()

        results = ocr.image_to_text(segmenter.segment())

        assert results["nbs_patient_id"] == "SIENNA HAMPTON"
        assert results["nbs_cas_id"] == "123555"

    def test_ocr_handwritten(self):
        segmenter = ImageSegmenter(
            raw_image_handwritten,
            segmentation_template,
            labels_path,
            segmentation_function=segment_by_mask_then_crop,
        )
        ocr = ImageOCR(model="microsoft/trocr-base-handwritten")

        results = ocr.image_to_text(segmenter.segment())

        assert results["nbs_patient_id"] == "Harry Potter"
        assert results["nbs_cas_id"] == "123695"
