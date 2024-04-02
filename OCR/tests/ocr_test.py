import pytest
import os
from ocr.services.image_segmenter import ImageSegmenter
from ocr.services.image_ocr import ImageOCR


path = os.path.dirname(__file__)

segmentation_template = os.path.join(path, "./assets/form_segmention_template.png")
raw_image = os.path.join(path, "./assets/form_filled.png")
labels_path = os.path.join(path, "./assets/labels.json")


class TestOCR:

    @pytest.fixture(autouse=True)
    def setup(self):
        self.segmenter = ImageSegmenter(raw_image, segmentation_template, labels_path)
        self.ocr = ImageOCR()

    def test_ocr(self):
        results = self.ocr.image_to_text(self.segmenter.segment())
        assert results["nbs_patient_id"] == "123555"
        assert results["nbs_cas_id"] == "SIENNA HAMPTON"
