from pathlib import Path

import numpy as np
import cv2 as cv


class ImageHomography:
    def __init__(self, template: Path, match_ratio=0.3):
        """Initialize the image homography pipeline with a `template` image."""
        if match_ratio >= 1 or match_ratio <= 0:
            raise ValueError("`match_ratio` must be between 0 and 1")

        self.template = cv.imread(template)
        self.match_ratio = match_ratio
        self._sift = cv.SIFT_create()

    def estimate_self_similarity(self):
        """Calibrate `match_ratio` using a self-similarity metric."""
        raise NotImplementedError

    def compute_descriptors(self, img):
        """Compute SIFT descriptors for a target `img`."""
        return self._sift.detectAndCompute(img, None)

    def knn_match(self, descriptor_template, descriptor_query):
        """Return k-nearest neighbors match (k=2) between descriptors generated from a template and query image."""
        matcher = cv.DescriptorMatcher_create(cv.DescriptorMatcher_FLANNBASED)
        return matcher.knnMatch(descriptor_template, descriptor_query, 2)

    def transform_homography(self, other):
        """Run the image homography pipeline against a query image."""
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

        return cv.warpPerspective(other, M, (self.template.shape[1], self.template.shape[0]))
