"""
Uses quadrilaterial edge detection and executes a four-point perspective transform on a source image.
"""

from pathlib import Path
import functools

import numpy as np
import cv2 as cv


class FourPointTransform:
    def __init__(self, image: Path):
        self.image = cv.imread(str(image), cv.IMREAD_GRAYSCALE)

    @classmethod
    def align(self, source_image, template_image):
        return FourPointTransform(source_image).dewarp()

    @staticmethod
    def _order_points(quadrilateral: np.ndarray) -> np.ndarray:
        "Reorder points from a 4x2 input array representing the vertices of a quadrilateral, such that the coordinates of each vertex are arranged in order from top left, top right, bottom right, and bottom left."
        quadrilateral = quadrilateral.reshape(4, 2)
        output_quad = np.zeros([4, 2]).astype(np.float32)
        s = quadrilateral.sum(axis=1)
        output_quad[0] = quadrilateral[np.argmin(s)]
        output_quad[2] = quadrilateral[np.argmax(s)]
        diff = np.diff(quadrilateral, axis=1)
        output_quad[1] = quadrilateral[np.argmin(diff)]
        output_quad[3] = quadrilateral[np.argmax(diff)]
        return output_quad

    def find_largest_contour(self):
        """Compute contours for an image and find the biggest one by area."""
        _, contours, _ = cv.findContours(self.image, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
        return functools.reduce(lambda a, b: b if cv.contourArea(a) < cv.contourArea(b) else a, contours)

    def simplify_polygon(self, contour):
        """Simplify to a polygon with (hopefully four) vertices."""
        perimeter = cv.arcLength(contour, True)
        return cv.approxPolyDP(contour, 0.01 * perimeter, True)

    def dewarp(self) -> np.ndarray:
        biggest_contour = self.find_largest_contour()
        simplified = self.simplify_polygon(biggest_contour)

        height, width = self.image.shape
        destination = np.array([[0, 0], [width, 0], [width, height], [0, height]], dtype=np.float32)

        M = cv.getPerspectiveTransform(self.order_points(simplified), destination)
        return cv.warpPerspective(self.image, M, (width, height))
