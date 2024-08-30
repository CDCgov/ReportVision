import pytest
import json
import os
from ocr.services.image_segmenter import ImageSegmenter
import numpy as np
import cv2 as cv

path = os.path.dirname(__file__)


segmentation_template_path = os.path.join(path, "./assets/form_segmention_template.png")
raw_image_path = os.path.join(path, "./assets/form_filled.png")
labels_path = os.path.join(path, "./assets/labels.json")


class TestImageSegmenter:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.raw_image_path = raw_image_path
        self.segmentation_template_path = segmentation_template_path
        self.labels_path = labels_path
        self.segmenter = ImageSegmenter()

    def test_segment(self):
        segments = self.segmenter.load_and_segment(
            self.raw_image_path, self.segmentation_template_path, self.labels_path
        )
        assert isinstance(segments, dict)
        with open(self.labels_path, "r") as f:
            labels = json.load(f)
        assert set(segments.keys()) == set(labels.values())
        for segment in segments.values():
            assert isinstance(segment, np.ndarray)

    def test_segment_shapes(self):
        expected_shapes = {"nbs_patient_id": (57, 366, 3), "nbs_cas_id": (41, 376, 3)}
        segments = self.segmenter.load_and_segment(
            self.raw_image_path, self.segmentation_template_path, self.labels_path
        )
        for label, segment in segments.items():
            assert segment.shape == expected_shapes[label]

    def test_no_matching_pixels(self):
        segmentation_template = np.zeros((10, 10, 3), dtype=np.uint8)
        raw_image = np.ones((10, 10, 3), dtype=np.uint8)
        cv.imwrite("no_matching_colors_raw.png", raw_image)
        cv.imwrite("no_matching_colors_seg.png", segmentation_template)
        segmenter = ImageSegmenter()
        segments = segmenter.load_and_segment(
            "no_matching_colors_raw.png", "no_matching_colors_seg.png", self.labels_path
        )
        assert len(segments) == 2
        assert segments["nbs_patient_id"] is None
        assert segments["nbs_cas_id"] is None
        os.remove("no_matching_colors_raw.png")
        os.remove("no_matching_colors_seg.png")

    def test_invalid_file_paths(self):
        segmenter = ImageSegmenter()

        with pytest.raises(FileNotFoundError):
            segmenter.load_and_segment("invalid_path", "invalid_path", {})

    def test_invalid_image_files(self):
        segmenter = ImageSegmenter()

        with open("empty_file1", "w"), open("empty_file2", "w"), open("empty_file3", "w"):
            pass

        with pytest.raises(ValueError):
            segmenter.load_and_segment("empty_file1", "empty_file2", "empty_file3")
        os.remove("empty_file1")
        os.remove("empty_file2")
        os.remove("empty_file3")
