"""Aligns two images using image homography algorithms."""

from pathlib import Path

import numpy as np
import cv2 as cv


class ImageHomography:
    """A class to align two images using homography techniques.

    Uses Scale-Invariant Feature Transform (SIFT) algorithm to detect keypoints and
    compute descriptors for image matching, and then estimates a homography
    transformation matrix to align the source image with a template image.

    Attributes:
        template (np.ndarray): The template image to align against, either as a path or a NumPy array.
        match_ratio (float): The ratio used for Lowe's ratio test to filter good matches.
        _sift (cv.SIFT): The SIFT detector used to find keypoints and descriptors.
    """

    def __init__(self, template: Path | np.ndarray, match_ratio=0.3):
        """Initializes the ImageHomography object with a template image.

        Optionally include a match ratio for filtering descriptor matches; this must be between 0 and 1.

        Args:
            template (Path | np.ndarray): The template image, either as a file path or a NumPy array.
            match_ratio (float, optional): The ratio threshold for Lowe's ratio test. Default is 0.3.

        Raises:
            ValueError: If `match_ratio` is not between 0 and 1.
        """
        if match_ratio >= 1 or match_ratio <= 0:
            raise ValueError("`match_ratio` must be between 0 and 1")

        if isinstance(template, np.ndarray):
            self.template = template
        else:
            self.template = cv.imread(template)
        self.match_ratio = match_ratio
        self._sift = cv.SIFT_create()

    @classmethod
    def align(self, source_image: np.ndarray, template_image: np.ndarray) -> np.ndarray:
        """Aligns a source image to a template image.

        Args:
            source_image (np.ndarray): The source image to align.
            template_image (np.ndarray): The template image to align to.

        Returns:
            np.ndarray: The aligned source image.
        """
        return ImageHomography(template_image).transform_homography(source_image)

    def estimate_self_similarity(self):
        """Calibrates the match ratio using a self-similarity metric (not implemented).

        Raises:
            NotImplementedError: Since this method is not implemented.
        """
        raise NotImplementedError

    def compute_descriptors(self, img: np.ndarray):
        """Computes the SIFT descriptors for a given image.

        These descriptors represent distinctive features in the image that can be used for matching.

        Args:
            img (np.ndarray): The image for which to compute descriptors.

        Returns:
            tuple: A 2-element tuple containing the keypoints and their corresponding descriptors.
        """
        return self._sift.detectAndCompute(img, None)

    def knn_match(self, descriptor_template, descriptor_query):
        """Performs k-nearest neighbors matching (k=2) between descriptors to find best homography matches.

        Args:
            descriptor_template (np.ndarray): The SIFT descriptors from the template image.
            descriptor_query (np.ndarray): The SIFT descriptors from the query image.

        Returns:
            list: A list of k-nearest neighbor matches between the template and query descriptors.
        """
        matcher = cv.DescriptorMatcher_create(cv.DescriptorMatcher_FLANNBASED)
        return matcher.knnMatch(descriptor_template, descriptor_query, 2)

    def estimate_transform_matrix(self, other: np.ndarray) -> np.ndarray:
        """Estimates the transformation matrix between the template image and another image.

        This function detects keypoints and descriptors, matches them using k-nearest neighbors,
        and applies Lowe's ratio test to filter for quality matches.

        Args:
            other (np.ndarray): The image to estimate the transformation matrix against.

        Returns:
            np.ndarray: The homography matrix that transforms the other image to align with the template image.
        """
        # find the keypoints and descriptors with SIFT
        kp1, descriptors1 = self.compute_descriptors(self.template)
        kp2, descriptors2 = self.compute_descriptors(other)

        knn_matches = self.knn_match(descriptors1, descriptors2)

        # Filter matches using the Lowe's ratio test
        # use an aggressive threshold here- the larger the image the more aggresively this should be filtered
        good_matches = []
        for m, n in knn_matches:
            if m.distance < self.match_ratio * n.distance:
                good_matches.append(m)

        src_pts = np.float32([kp1[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
        dst_pts = np.float32([kp2[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)

        M, _ = cv.findHomography(dst_pts, src_pts, cv.RANSAC, 5.0)
        return M

    def transform_homography(self, other: np.ndarray, min_axis=100, matrix=None) -> np.ndarray:
        """Run the full image homography pipeline against a query image.

        If the size of the `other` image is smaller than the minimum axis length `min_axis`,
        the image is returned unchanged.

        If a transformation matrix is provided, it is used directly; otherwise, the matrix is
        estimated using `estimate_transform_matrix`.

        Args:
            other (np.ndarray): The image to be transformed.
            min_axis (int, optional): The minimum axis length (in pixels) to attempt the homography transform.
                                      If the image is smaller, it will be returned unchanged. Default is 100.
            matrix (np.ndarray, optional): The homography transformation matrix to apply. If not provided,
                                            it will be estimated.

        Returns:
            np.ndarray: The transformed image if homography was applied, or the original image if it is
                        smaller than the minimum axis size.
        """
        if other.shape[0] < min_axis and other.shape[1] < min_axis:
            return other

        if matrix is None:
            try:
                matrix = self.estimate_transform_matrix(other)
            except cv.error:
                print("could not estimate transform matrix")
                return other

        return cv.warpPerspective(other, matrix, (self.template.shape[1], self.template.shape[0]))
