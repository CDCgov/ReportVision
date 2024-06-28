import os

import cv2 as cv
import numpy as np

from alignment import ImageHomography, RandomPerspectiveTransform


path = os.path.dirname(__file__)

template_image_path = os.path.join(path, "./assets/template_hep.jpg")
filled_image_path = os.path.join(path, "./assets/form_filled_hep.jpg")
filled_image = cv.imread(filled_image_path)


class TestAlignment:
    def test_random_warp(self):
        transformed = RandomPerspectiveTransform(filled_image_path).transform(distortion_scale=0.1)
        assert np.median(cv.absdiff(np.array(transformed), filled_image)) > 0

    def test_alignment_filled(self):
        aligner = ImageHomography(template_image_path)
        warped_image = np.array(RandomPerspectiveTransform(filled_image_path).transform(distortion_scale=0.1))
        aligned = aligner.transform_homography(warped_image)
        res = cv.absdiff(aligner.template, aligned)
        assert aligner.template.shape == warped_image.shape
        assert np.median(res) == 0
