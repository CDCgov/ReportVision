"""Module for aligning images using a specified image alignment backend."""

import numpy as np

from ocr.services.alignment.backends import ImageHomography


class ImageAligner:
    """Class for aligning images using a specified image alignment backend.

    Attributes:
        aligner: An alignment backend class or instance that provides an `align` method.
                 Default is the ImageHomography backend from the ocr.services.alignment module.
    """

    def __init__(self, aligner=ImageHomography):
        """Initializes an ImageAligner instance with the specified image alignment backend.

        Args:
            aligner (type): A class or instance of an alignment backend. Default is ImageHomography.
        """
        self.aligner = aligner

    def align(self, source_image: np.ndarray, template_image: np.ndarray) -> np.ndarray:
        """Aligns the source image with the template image using the specified alignment backend.

        Args:
            source_image (np.ndarray): The image to be aligned, represented as a NumPy array.
            template_image (np.ndarray): The image that `source_image` will be aligned against,
                                          represented as a NumPy array. May not be used for all
                                          image alignment backends.

        Returns:
            np.ndarray: The aligned image as a NumPy array.
        """
        aligned_image = self.aligner.align(source_image, template_image)
        return aligned_image
