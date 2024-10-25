import numpy as np

from ocr.services.alignment import ImageHomography


class ImageAligner:
    def __init__(self, aligner=ImageHomography):
        self.aligner = aligner

    def align(self, source_image: np.ndarray, template_image: np.ndarray) -> np.ndarray:
        """
        Aligns an image using the specified image alignment backend.

        source_image: the image to be aligned, as a numpy ndarray.
        template_image: the image that `source_image` will be aligned against, as a numpy ndarray.
            May not be used for all image alignment backends.
        """
        aligned_image = self.aligner.align(source_image, template_image)
        return aligned_image
