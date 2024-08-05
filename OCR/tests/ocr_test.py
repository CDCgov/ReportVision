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

        patient_id, patient_confidence = results["nbs_patient_id"]
        cas_id, cas_confidence = results["nbs_cas_id"]

        assert patient_id == "SIENNA HAMPTON"
        assert cas_id == "123555"

    def test_ocr_handwritten(self):
        segmenter = ImageSegmenter(
            raw_image_handwritten,
            segmentation_template,
            labels_path,
            segmentation_function=segment_by_mask_then_crop,
        )
        ocr = ImageOCR(model="microsoft/trocr-base-handwritten")

        results = ocr.image_to_text(segmenter.segment())

        patient_id, patient_confidence = results["nbs_patient_id"]
        cas_id, cas_confidence = results["nbs_cas_id"]

        assert patient_id == "Harry Potter"
        assert cas_id == "123695"

    def test_confidence_values_returned(self):
        segmenter = ImageSegmenter(
            raw_image,
            segmentation_template,
            labels_path,
            segmentation_function=segment_by_color_bounding_box,
        )
        ocr = ImageOCR()

        results = ocr.image_to_text(segmenter.segment())

        patient_id, patient_confidence = results["nbs_patient_id"]
        cas_id, cas_confidence = results["nbs_cas_id"]

        assert isinstance(patient_confidence, float)
        assert isinstance(cas_confidence, float)
        assert patient_confidence > 0
        assert cas_confidence > 0
