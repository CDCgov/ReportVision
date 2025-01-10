"""Perspective transforms a base image between 10% and 90% distortion."""

from pathlib import Path

import numpy as np
import cv2 as cv
from PIL import Image


class RandomPerspectiveTransform:
    """Class to generates a random perspective transform based on a template image.

    This class allows you to apply random distortions to an image by computing
    a perspective transformation matrix and warping the image accordingly.

    Attributes:
        image (PIL.Image): The input image to which the perspective transform will be applied.
    """

    def __init__(self, image: Path) -> None:
        """Initializes the RandomPerspectiveTransform instance with the given image path.

        Args:
            image (Path): Path to the image to be used for the transformation.
        """
        self.image = Image.open(image)

    def make_transform(self, distortion_scale: float) -> np.ndarray:
        """Create a transformation matrix for a random perspective transform.

        Args:
            distortion_scale (float): A scale factor that controls the amount of distortion.
                It should be between 0 (no distortion) and 1 (maximum distortion).

        Returns:
            np.ndarray: The transformation matrix (from cv.PerspectiveTransform) that can be applied to this image.

        Raises:
            ValueError: If `distortion_scale` is outside the range [0, 1).
        """
        if distortion_scale < 0 or distortion_scale >= 1:
            raise ValueError("`distortion_scale` must be between 0 and 1")

        # We delay import until this is called due to torch's long initialization time.
        import torch

        # From torchvision. BSD 3-clause
        height = self.image.height
        width = self.image.width
        half_height = height // 2
        half_width = width // 2
        topleft = [
            int(torch.randint(0, int(distortion_scale * half_width) + 1, size=(1,)).item()),
            int(torch.randint(0, int(distortion_scale * half_height) + 1, size=(1,)).item()),
        ]
        topright = [
            int(torch.randint(width - int(distortion_scale * half_width) - 1, width, size=(1,)).item()),
            int(torch.randint(0, int(distortion_scale * half_height) + 1, size=(1,)).item()),
        ]
        botright = [
            int(torch.randint(width - int(distortion_scale * half_width) - 1, width, size=(1,)).item()),
            int(torch.randint(height - int(distortion_scale * half_height) - 1, height, size=(1,)).item()),
        ]
        botleft = [
            int(torch.randint(0, int(distortion_scale * half_width) + 1, size=(1,)).item()),
            int(torch.randint(height - int(distortion_scale * half_height) - 1, height, size=(1,)).item()),
        ]
        startpoints = [[0, 0], [width - 1, 0], [width - 1, height - 1], [0, height - 1]]
        endpoints = [topleft, topright, botright, botleft]
        return cv.getPerspectiveTransform(
            np.array(endpoints, dtype=np.float32), np.array(startpoints, dtype=np.float32)
        )

    def transform(self, transformer: np.ndarray) -> np.ndarray:
        """Warp the template image with a specified transform matrix.

        Args:
            transformer (np.ndarray): A perspective transformation matrix to apply.

        Returns:
            np.ndarray: The warped image after applying the transformation.
        """
        return cv.warpPerspective(np.array(self.image), transformer, (self.image.width, self.image.height))

    def random_transform(self, distortion_scale: float) -> np.ndarray:
        """Warp the template image with specified distortion_scale.

        This method internally calls `make_transform` to generate the transformation matrix
        and applies it using `transform`.

        Args:
            distortion_scale (float): A scale factor that controls the amount of distortion.
                It should be between 0 (no distortion) and 1 (maximum distortion).

        Returns:
            np.ndarray: The warped image after applying the random perspective transformation.

        Raises:
            ValueError: If `distortion_scale` is outside the range [0, 1).
        """
        if distortion_scale < 0 or distortion_scale >= 1:
            raise ValueError("`distortion_scale` must be between 0 and 1")

        return self.transform(self.make_transform(distortion_scale))
