import cv2 as cv
import numpy as np
import json
import os


def crop_zeros(image):
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


def segment_by_mask_then_crop(raw_image, segmentation_template, labels, debug) -> dict[str, np.ndarray]:
    segments = {}

    # iterate over the labels
    for item in labels:
        label, color = item["label"], item["color"]
        raw_image = np.array(raw_image, copy=True)
        segmentation_template = np.array(segmentation_template, copy=True)
        color = tuple(map(int, reversed(color.split(","))))
        # create a mask for that color
        mask = np.all(segmentation_template == color, axis=2).astype(int)

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


def segment_by_color_bounding_box(raw_image, segmentation_template, labels, debug) -> dict[str, np.ndarray]:
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
    def __init__(
        self,
        segmentation_function=segment_by_mask_then_crop,
        debug=False,
    ):
        self.segmentation_function = segmentation_function
        self.debug = debug

    def segment(
        self,
        raw_image,
        segmentation_template,
        labels,
    ) -> dict[str, np.ndarray]:
        return self.segmentation_function(raw_image, segmentation_template, labels, self.debug)

    def load_and_segment(self, raw_image_path, segmentation_template_path, labels_path):
        if (
            not os.path.isfile(raw_image_path)
            or not os.path.isfile(segmentation_template_path)
            or not os.path.isfile(labels_path)
        ):
            raise FileNotFoundError("One or more input files do not exist.")

        raw_image = cv.imread(raw_image_path)
        if raw_image is None:
            raise ValueError(f"Failed to open image file: {raw_image_path}")

        segmentation_template = cv.imread(segmentation_template_path)
        if segmentation_template is None:
            raise ValueError(f"Failed to open image file: {segmentation_template_path}")

        labels = json.load(open(labels_path, "r"))

        if self.debug is True:
            self.debug_folder = "debug_segments"
            os.makedirs(self.debug_folder, exist_ok=True)
            print(f"raw_image shape: {raw_image.shape}")
            print(f"segmentation_template shape: {segmentation_template.shape}")

        return self.segment(raw_image, segmentation_template, labels)
