"""
Perspective transforms a base image between 10% and 90% distortion.
"""

from pathlib import Path

import torchvision.transforms as transforms
from PIL import Image


class RandomPerspectiveTransform:
    """Generate a random perspective transform based on a template `image`."""

    def __init__(self, image: Path):
        self.image = Image.open(image)

    @staticmethod
    def _make_transform(distortion_scale: float) -> object:
        """
        Internal function to create a composed transformer for perspective warps.

        This needs to be instantiated new each time in order for the RandomPerspective transformer to be truly random between repeated calls to the `transform` function.
        """
        return transforms.Compose(
            [
                transforms.RandomPerspective(distortion_scale=distortion_scale, p=1),
                transforms.ToTensor(),
                transforms.ToPILImage(),
            ]
        )

    def transform(self, distortion_scale: float) -> object:
        """Warp the template image with specified `distortion_scale`."""
        if distortion_scale < 0 or distortion_scale >= 1:
            raise ValueError("`distortion_scale` must be between 0 and 1")

        return self._make_transform(distortion_scale)(self.image)
