import os
from ocr.services.image_segmenter import ImageSegmenter
from ocr.services.image_ocr import ImageOCR


path = os.path.dirname(__file__)

segmentation_template = os.path.join(path, "./assets/form_segmention_template.png")
raw_image = os.path.join(path, "./assets/form_filled.png")
raw_image_handwritten = os.path.join(path, "./assets/form_hand_filled.png")
labels_path = os.path.join(path, "./assets/labels.json")


class TestOCR:
    def test_ocr_printed(self):
        segmenter = ImageSegmenter(raw_image, segmentation_template, labels_path)
        ocr = ImageOCR()

        results = ocr.image_to_text(segmenter.segment())

        assert results["nbs_patient_id"] == "123555"
        assert results["nbs_cas_id"] == "SIENNA HAMPTON"

    def test_ocr_handwritten(self):
        segmenter = ImageSegmenter(raw_image_handwritten, segmentation_template, labels_path)
        ocr = ImageOCR(model="microsoft/trocr-base-handwritten")

        results = ocr.image_to_text(segmenter.segment())

        assert results["nbs_patient_id"] == "123695"
        assert results["nbs_cas_id"] == "Harry Potter"
