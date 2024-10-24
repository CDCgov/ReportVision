import cv2 as cv
import numpy as np
import json
import os

from ocr.services.alignment import ImageHomography, FourPointTransform

class ImageAligner:
    def __init__(self, aligner=ImageHomography):
        self.aligner = aligner

    def align(self, source_image: np.ndarray, template_image: np.ndarray) -> np.ndarray:
        aligner = self.aligner(template_image)
        aligned_image = aligner.transform_homography(source_image)
        cv.imwrite("aligned.png", aligned_image)
        cv.imwrite("template.png", template_image)
        cv.imwrite("raw.png", source_image)
        return aligned_image

