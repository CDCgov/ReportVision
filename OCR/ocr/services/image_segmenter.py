"""Module to segment images based on a segmentation template and a set of labels."""

import cv2 as cv
import numpy as np
import json
import os


def crop_zeros(image: np.ndarray) -> np.ndarray:
    """Crops the given image to remove all-zero (black) regions.

    Args:
        image (np.ndarray): The input image represented as a NumPy array,
                            where zero values represent black areas to be cropped.

    Returns:
        np.ndarray: A cropped version of the image with zero regions removed.
    """
    # argwhere will give you the coordinates of every non-zero point
    true_points = np.argwhere(image)

    if len(true_points) == 0:
        return None

    # take the smallest points and use them as the top left of your crop
    top_left = true_points.min(axis=0)
    # take the largest points and use them as the bottom right of your crop
    bottom_right = true_points.max(axis=0)
    return image[
        top_left[0] : bottom_right[0] + 1,  # plus 1 because slice isn't
        top_left[1] : bottom_right[1] + 1,
    ]  # inclusive


def segment_by_mask_then_crop(
    raw_image: np.ndarray, segmentation_template: np.ndarray, labels: list[dict[str, str]], debug: bool
) -> dict[str, np.ndarray]:
    """Segments a raw image based on a color mask in the segmentation template, and then crops the resulting regions to remove zero (black) areas.

    Args:
        raw_image (np.ndarray): The input image to be segmented, as a NumPy array.
        segmentation_template (np.ndarray): A template image used for segmenting the raw image with color masks.
        labels (list[dict[str, str]]): A list of dicts containing 'label' and 'color' keys, where 'label' is the segment label
                             and 'color' is the color to match in the segmentation template.
        debug (bool): If `True`, saves debug images and prints additional information.

    Returns:
        dict[str, np.ndarray]: A dictionary where keys are segment labels and values are the cropped segmented images.
    """
    segments = {}

    # iterate over the labels
    for item in labels:
        label, color = item["label"], item["color"]
        raw_image = np.array(raw_image, copy=True)
        segmentation_template = np.array(segmentation_template, copy=True)
        color = tuple(map(int, reversed(color.split(","))))
        # create a mask for that color
        mask = np.all(segmentation_template == color, axis=2).astype(np.uint8)

        # add a third dimension to the mask
        mask = mask[:, :, np.newaxis]

        # multiply the original image with the mask then crop it
        segments[label] = crop_zeros(raw_image * mask)

        if debug is True:
            print(f"label: {label}")
            print(f"color {color}")
            print("mask.shape", mask.shape)
            mask[mask >= 1] = 255
            cv.imwrite(f"{label}_mask.png", mask)
            if segments[label] is not None:
                print("segment.shape", segments[label].shape)
                cv.imwrite(f"{label}.png", segments[label])
            print("====")

    return segments


def segment_by_color_bounding_box(
    raw_image: np.ndarray, segmentation_template: np.ndarray, labels: list[dict[str, str]], debug: bool
) -> dict[str, np.ndarray]:
    """Segments a raw image by detecting colored boundary boxes in the segmentation template.

    Args:
        raw_image (np.ndarray): The input image to be segmented, as a NumPy array.
        segmentation_template (np.ndarray): A template image used for segmenting the raw image with colored boxes.
        labels (list[dict[str, str]]): A list of dicts containing 'label' and 'color' keys, where 'label' is the segment label
                                       and 'color' is the color to match in the segmentation template.
        debug (bool): If `True`, saves debug images and prints additional information.

    Returns:
        dict[str, np.ndarray]: A dictionary where keys are segment labels and values are the cropped segmented images.
    """
    segments = {}

    # iterate over the labels
    for item in labels:
        label, color = item["label"], item["color"]
        # we are reversing from RGB in the label to BGR used by the openCV
        color = tuple(map(int, reversed(color.split(","))))
        # find indices of the color in the segmentation template where the color matches the expected colors
        indices = np.where(np.all(segmentation_template == color, axis=-1))
        # if there are matching pixels
        if indices[0].size > 0:
            # Find the x-y coordinates
            y_min, y_max = indices[0].min(), indices[0].max()
            x_min, x_max = indices[1].min(), indices[1].max()
            # crop the area and store the image in the dict
            segments[label] = raw_image[y_min : y_max + 1, x_min : x_max + 1]
        else:
            segments[label] = None
    return segments


class ImageSegmenter:
    """A class for segmenting images based on a segmentation template and labels.

    Supports different segmentation strategies by passing in functions to `segmentation_function`.

    Attributes:
        segmentation_function (function): A function used for segmenting the image, such as
                                          `segment_by_mask_then_crop` or `segment_by_color_bounding_box`.
        debug (bool): If `True`, saves debug images and prints additional information.
    """

    def __init__(
        self,
        segmentation_function=segment_by_mask_then_crop,
        debug=False,
    ):
        """Initializes the ImageSegmenter with the specified segmentation function.

        Args:
            segmentation_function (function): The segmentation function to use. Default is `segment_by_mask_then_crop`.
            debug (bool): If `True`, saves debug images and prints additional information.
        """
        self.segmentation_function = segmentation_function
        self.debug = debug

    def segment(
        self,
        raw_image: np.ndarray,
        segmentation_template: np.ndarray,
        labels: list[dict[str, str]],
    ) -> dict[str, np.ndarray]:
        """Segments a raw image using the class instance's segmentation function.

        Args:
            raw_image (np.ndarray): The input image to be segmented, as a NumPy array.
            segmentation_template (np.ndarray): A template image used for segmenting the raw image.
            labels (list[dict[str, str]]): A list of dicts containing 'label' and 'color' keys, where 'label' is the segment label
                                           and 'color' is the color to match in the segmentation template.

        Returns:
            dict[str, np.ndarray]: A dictionary where keys are segment labels and values are the cropped segmented images.
        """
        return self.segmentation_function(raw_image, segmentation_template, labels, self.debug)

    def load_and_segment(
        self, raw_image_path: str, segmentation_template_path: str, labels_path: str
    ) -> dict[str, np.ndarray]:
        """Loads image files and labels from specified paths, and then segments the image.

        Args:
            raw_image_path (str): Path to the raw image file.
            segmentation_template_path (str): Path to the segmentation template image.
            labels_path (str): Path to the JSON file containing the segment labels and colors.

        Returns:
            dict[str, np.ndarray]: A dictionary where keys are segment labels and values are the cropped segmented images.

        Raises:
            FileNotFoundError: If any of the input files do not exist.
            ValueError: If an image file cannot be opened.
        """
        if (
            not os.path.isfile(raw_image_path)
            or not os.path.isfile(segmentation_template_path)
            or not os.path.isfile(labels_path)
        ):
            raise FileNotFoundError("One or more input files do not exist.")

        raw_image = cv.imread(raw_image_path, cv.IMREAD_COLOR)
        if raw_image is None:
            raise ValueError(f"Failed to open image file: {raw_image_path}")

        segmentation_template = cv.imread(segmentation_template_path, cv.IMREAD_COLOR)
        if segmentation_template is None:
            raise ValueError(f"Failed to open image file: {segmentation_template_path}")

        labels = json.load(open(labels_path, "r"))

        if self.debug is True:
            self.debug_folder = "debug_segments"
            os.makedirs(self.debug_folder, exist_ok=True)
            print(f"raw_image shape: {raw_image.shape}")
            print(f"segmentation_template shape: {segmentation_template.shape}")

        return self.segment(raw_image, segmentation_template, labels)
