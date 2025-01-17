import os

import cv2 as cv
import numpy as np
import pytest

from ocr.services.alignment.backends import FourPointTransform, ImageHomography, RandomPerspectiveTransform
from ocr.services.alignment import ImageAligner


path = os.path.dirname(__file__)

template_image_path = os.path.join(path, "./assets/template_hep.jpg")
filled_image_path = os.path.join(path, "./assets/form_filled_hep.jpg")
filled_image = cv.imread(filled_image_path)


class TestAlignment:
    @pytest.mark.parametrize("align_class", [ImageHomography, FourPointTransform])
    def test_align_implementation(self, align_class):
        """Tests that the ImageAligner class backends implement the `align` method."""
        template_image = cv.imread(template_image_path)
        aligner = ImageAligner(aligner=align_class)
        result = aligner.align(filled_image, template_image)
        assert result.shape == template_image.shape, "Aliged image has wrong shape"
        assert np.median(cv.absdiff(template_image, result)) <= 1, "Median difference too high"

    def test_random_warp(self):
        """Test that a random warp generates an image different from the template."""
        transformed = RandomPerspectiveTransform(filled_image_path).random_transform(distortion_scale=0.1)
        assert np.median(cv.absdiff(np.array(transformed), filled_image)) > 0, "Random warp has no differences"

    def test_alignment_filled(self):
        """Test that a random warp that is unskewed with the image homography alignment algorithm is similar to the original template image."""
        aligner = ImageHomography(template_image_path)
        warped_image = np.array(RandomPerspectiveTransform(filled_image_path).random_transform(distortion_scale=0.1))
        aligned = aligner.transform_homography(warped_image)
        res = cv.absdiff(aligner.template, aligned)
        assert aligner.template.shape == warped_image.shape, "Warp has wrong shape"
        assert np.median(res) <= 1, "Median difference too high"

    def test_inverse_alignment(self):
        """Test that a random warp's inverse transform matrix is similar to the unskewing matrix generated by the image homography alignment algorithm."""
        aligner = ImageHomography(template_image_path)
        transformer = RandomPerspectiveTransform(filled_image_path)
        transform_matrix = transformer.make_transform(distortion_scale=0.1)
        warped_image = np.array(transformer.transform(transform_matrix))
        homography_params = aligner.estimate_transform_matrix(warped_image)
        sumdiff = np.median(np.absolute(np.linalg.inv(transform_matrix) - homography_params))
        assert sumdiff <= 1, "Median difference is too high"
