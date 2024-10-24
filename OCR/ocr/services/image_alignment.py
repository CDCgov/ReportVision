import cv2 as cv
import numpy as np

from ocr.services.alignment import ImageHomography

class ImageAligner:
    def __init__(self, aligner=ImageHomography):
        self.aligner = aligner

    def align(self, source_image: np.ndarray, template_image: np.ndarray) -> np.ndarray:
        aligned_image = self.aligner.align(source_image, template_image)
        cv.imwrite("aligned.png", aligned_image)
        cv.imwrite("template.png", template_image)
        cv.imwrite("raw.png", source_image)
        return aligned_image
