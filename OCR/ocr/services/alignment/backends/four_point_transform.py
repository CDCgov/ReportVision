"""Uses quadrilaterial edge detection and executes a four-point perspective transform on a source image."""

from pathlib import Path
import functools

import numpy as np
import cv2 as cv


class FourPointTransform:
    """A class to perform a four-point perspective transformation on an image.

    This involves detecting the largest quadrilateral in the image and transforming it
    to a standard rectangular form using a perspective warp.

    Attributes:
        image (np.ndarray): The input image as a NumPy array.
    """

    def __init__(self, image: Path | np.ndarray):
        """Initializes the FourPointTransform object with an image.

        The image can either be provided as a file path (Path) or a NumPy array.

        Args:
            image (Path | np.ndarray): The input image, either as a path to a file or as a NumPy array.
        """
        if isinstance(image, np.ndarray):
            self.image = image
        else:
            self.image = cv.imread(str(image))

    @classmethod
    def align(self, source_image: np.ndarray, template_image: np.ndarray) -> np.ndarray:
        """Aligns a source image to a template image using the four-point transform.

        Args:
            source_image (np.ndarray): The source image to be aligned.
            template_image (np.ndarray): The template image to align to.

        Returns:
            np.ndarray: The transformed image.
        """
        return FourPointTransform(source_image).dewarp()

    @staticmethod
    def _order_points(quadrilateral: np.ndarray) -> np.ndarray:
        """Reorders the points of a quadrilateral from an unordered 4x2 array to a specific order of top-left, top-right, bottom-right, and bottom-left.

        Args:
            quadrilateral (np.ndarray): A 4x2 array representing the vertices of a quadrilateral.

        Returns:
            np.ndarray: A 4x2 array with the points ordered as [top-left, top-right, bottom-right, bottom-left].
        """
        quadrilateral = quadrilateral.reshape(4, 2)
        output_quad = np.zeros([4, 2]).astype(np.float32)
        s = quadrilateral.sum(axis=1)
        output_quad[0] = quadrilateral[np.argmin(s)]
        output_quad[2] = quadrilateral[np.argmax(s)]
        diff = np.diff(quadrilateral, axis=1)
        output_quad[1] = quadrilateral[np.argmin(diff)]
        output_quad[3] = quadrilateral[np.argmax(diff)]
        return output_quad

    def find_largest_contour(self) -> np.ndarray:
        """Finds the largest contour in the image by computing the contours and selecting the one with the greatest area.

        Returns:
            np.ndarray: The largest contour found in the image.
        """
        contours, _ = cv.findContours(
            cv.cvtColor(self.image, cv.COLOR_BGR2GRAY), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE
        )
        return functools.reduce(lambda a, b: b if cv.contourArea(a) < cv.contourArea(b) else a, contours)

    def simplify_polygon(self, contour):
        """Simplifies a given contour to a polygon with a reduced number of vertices, ideally four.

        Args:
            contour (np.ndarray): The contour to simplify.

        Returns:
            np.ndarray: The simplified polygon.
        """
        perimeter = cv.arcLength(contour, True)
        return cv.approxPolyDP(contour, 0.01 * perimeter, True)

    def dewarp(self) -> np.ndarray:
        """Performs a four-point perspective transform to "dewarp" the image.

        This involves detecting the largest quadrilateral, simplifying it to a polygon, and
        applying a perspective warp to straighten the image into a rectangle.

        Returns:
            np.ndarray: The perspective-transformed (dewarped) image.
        """
        biggest_contour = self.find_largest_contour()
        simplified = self.simplify_polygon(biggest_contour)

        height, width, _ = self.image.shape
        destination = np.array([[0, 0], [width, 0], [width, height], [0, height]], dtype=np.float32)

        M = cv.getPerspectiveTransform(self._order_points(simplified), destination)
        return cv.warpPerspective(self.image, M, (width, height))
