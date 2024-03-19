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
        
        
        self.labels = labels
        self.segments = {}

    def segment(self):
        with open(self.labels, 'r') as f:
            labels = json.load(f)
        #iterate over the labels
        for color, label in labels.items():
            color = tuple(map(int, color.split(',')))
            #find indices of the color in the segmentation template where the color matches the expected colors
            indices = np.where(np.all(self.segmentation_template == color, axis=-1))
            #if there any matching pixels
            if indices[0].size == 0:
                raise ValueError(f"No pixels found for color {color} in segmentation template.")
            if indices[0].size > 0:
                #Find the x-y coordinates
                y_min, y_max = indices[0].min(), indices[0].max()
                x_min, x_max = indices[1].min(), indices[1].max()
                #crop the area and store the image in the dict
                self.segments[label] = self.raw_image[y_min:y_max+1, x_min:x_max+1]
        return self.segments



