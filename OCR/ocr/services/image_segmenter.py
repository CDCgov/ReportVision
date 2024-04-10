import cv2 as cv
import numpy as np
import json
import os


class ImageSegmenter:
    def __init__(self, raw_image, segmentation_template, labels):

        if not os.path.isfile(raw_image) or not os.path.isfile(segmentation_template):
            raise FileNotFoundError("One or more input files do not exist.")

        self.raw_image = cv.imread(raw_image)
        if self.raw_image is None:
            raise ValueError(f"Failed to open image file: {raw_image}")

        self.segmentation_template = cv.imread(segmentation_template)
        if self.segmentation_template is None:
            raise ValueError(f"Failed to open image file: {segmentation_template}")

        self.labels = self.read_labels(labels)

        self.segments = {}
    
    def read_labels(self, labels_path):
        if not os.path.isfile(labels_path):
            raise FileNotFoundError(f"Labels file does not exist: {labels_path}")
        with open(labels_path, 'r') as f:
            labels = json.load(f)
        return labels

    def segment(self, tolerance=5) -> dict[str, np.ndarray]:
        for label_info in self.labels:
            # Convert the color string to an RGB tuple
            color = tuple(int(value) for value in label_info["color"].split(","))
            label = label_info["label"]
            
            # Calculate the absolute difference between the template and target colors
            diff = np.abs(self.segmentation_template.astype(int) - np.array(color).astype(int))
            
            # Determine which pixels are within the specified tolerance for all color channels
            is_close = np.all(diff <= tolerance, axis=-1)
            
            # Find the indices where the color is within tolerance
            indices = np.where(is_close)

            if indices[0].size == 0:
                print(f"No pixels found for color {color} in segmentation template for label '{label}'.")
                continue

            y_min, y_max = indices[0].min(), indices[0].max()
            x_min, x_max = indices[1].min(), indices[1].max()
            self.segments[label] = self.raw_image[y_min:y_max+1, x_min:x_max+1]

        return self.segments

