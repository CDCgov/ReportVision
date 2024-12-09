"""
Perspective transforms a base image between 10% and 90% distortion.
"""

from pathlib import Path

import numpy as np
import cv2 as cv
from PIL import Image


class RandomPerspectiveTransform:
    """Generate a random perspective transform based on a template `image`."""

    def __init__(self, image: Path):
        self.image = Image.open(image)

    def make_transform(self, distortion_scale: float) -> object:
        """
        Create a transformation matrix for a random perspective transform.
        """
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

    def transform(self, transformer) -> object:
        """Warp the template image with a specified transform matrix."""
        return cv.warpPerspective(np.array(self.image), transformer, (self.image.width, self.image.height))

    def random_transform(self, distortion_scale: float) -> object:
        """Warp the template image with specified `distortion_scale`."""
        if distortion_scale < 0 or distortion_scale >= 1:
            raise ValueError("`distortion_scale` must be between 0 and 1")

        return self.transform(self.make_transform(distortion_scale))
