import pytest
import os
import numpy as np
import cv2 as cv
from ocr.services.image_segmenter import ImageSegmenter
from ocr.services.image_ocr import ImageOCR


path = os.path.dirname(__file__)

segmentation_template = os.path.join(path, "./assets/form_segmention_template.png")
raw_image = os.path.join(path, "./assets/form_filled.png")
raw_image_handwritten = os.path.join(path, "./assets/form_hand_filled.png")
labels_path = os.path.join(path, "./assets/labels.json")

class TestOCRBenchmark:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.raw_image = raw_image
        self.segmentation_template = segmentation_template
        self.labels_path = labels_path
        self.segmenter = ImageSegmenter(self.raw_image, self.segmentation_template, self.labels_path)
        self.ocr_printed = ImageOCR()
        self.ocr_handwritten = ImageOCR(model="microsoft/trocr-base-handwritten")

    def test_ocr_printed_benchmark(self, benchmark):
        benchmark(self.ocr_printed.image_to_text, self.segmenter.segment())

    def test_ocr_handwritten_benchmark(self, benchmark):
        benchmark(self.ocr_handwritten.image_to_text, self.segmenter.segment())

class TestImageSegmenterBenchmark:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.raw_image = raw_image
        self.segmentation_template = segmentation_template
        self.labels_path = labels_path
        self.segmenter = ImageSegmenter(self.raw_image, self.segmentation_template, self.labels_path)

    def test_segment_benchmark(self, benchmark):
        benchmark(self.segmenter.segment)

    def test_segment_shapes_benchmark(self, benchmark):
        segments = self.segmenter.segment()
        benchmark(segments.items)

    def test_no_matching_pixels_benchmark(self, benchmark):
        segmentation_template = np.zeros((10, 10, 3), dtype=np.uint8)
        raw_image = np.ones((10, 10, 3), dtype=np.uint8)
        cv.imwrite("no_matching_colors_raw.png", raw_image)
        cv.imwrite("no_matching_colors_seg.png", segmentation_template)
        segmenter = ImageSegmenter("no_matching_colors_raw.png", "no_matching_colors_seg.png", self.labels_path)
        benchmark(self.segmenter.segment)
        os.remove("no_matching_colors_raw.png")
        os.remove("no_matching_colors_seg.png")