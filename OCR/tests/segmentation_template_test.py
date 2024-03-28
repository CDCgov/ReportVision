import pytest
import json
import os
from OCR.services.image_segmenter import ImageSegmenter
from dotenv import load_dotenv
import numpy as np
import cv2 as cv


load_dotenv()
segmentation_template = "./tests/assets/form_segmention_template.png"
raw_image = "./tests/assets/form_filled.png"
labels_path = "./tests/assets/labels.json"

class TestImageSegmenter:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.raw_image = raw_image
        self.segmentation_template = segmentation_template
        self.labels_path = labels_path
        self.segmenter = ImageSegmenter(self.raw_image, self.segmentation_template, self.labels_path)

    def test_segment(self):
        segments = self.segmenter.segment()
        assert isinstance(segments, dict)
        with open(self.labels_path, 'r') as f:
            labels = json.load(f)
        assert set(segments.keys()) == set(labels.values())
        for segment in segments.values():
            assert isinstance(segment, np.ndarray)

    def test_segment_shapes(self):
        segments = self.segmenter.segment()
        for segment in segments.values():
            assert len(segment.shape) == 3
    
    def test_segment_shapes(self):
        expected_shapes = {'nbs_patient_id': (41, 376, 3), 'nbs_cas_id': (57, 366, 3)}
        segments = self.segmenter.segment()
        for label, segment in segments.items():
            assert segment.shape == expected_shapes[label]

    def test_no_matching_pixels(self):
        segmentation_template = np.zeros((10, 10, 3), dtype=np.uint8)
        cv.imwrite('no_matching_colors.png', segmentation_template)
        segmenter = ImageSegmenter(self.raw_image, 'no_matching_colors.png', self.labels_path)
        with pytest.raises(ValueError):
            segmenter.segment()
        os.remove('no_matching_colors.png')
    
    def test_invalid_file_paths(self):
        with pytest.raises(FileNotFoundError):
            ImageSegmenter('invalid_path', 'invalid_path', {})

    def test_invalid_image_files(self):
        with open('empty_file1', 'w'), open('empty_file2', 'w'):
            pass

        with pytest.raises(ValueError):
            ImageSegmenter('empty_file1', 'empty_file2', {})
        os.remove('empty_file1')
        os.remove('empty_file2')

   