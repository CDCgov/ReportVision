from collections.abc import Iterator

from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import torch
import numpy as np
import cv2 as cv


class ImageOCR:
    def __init__(self, model="microsoft/trocr-large-printed"):
        self.processor = TrOCRProcessor.from_pretrained(model)
        self.model = VisionEncoderDecoderModel.from_pretrained(model)

    @staticmethod
    def compute_line_angle(lines: list) -> Iterator[float]:
        """
        Takes the output of cv.HoughLinesP (in x1, y1, x2, y2 format) and computes the angle in degrees based on these endpoints.
        """
        for line in lines:
            start = line[0][0:2]
            end = line[0][2:4]
            diff = end - start
            yield 180 / np.pi * np.arctan2(*diff) - 90

    @staticmethod
    def merge_bounding_boxes(boxes: list) -> Iterator[list]:
        """
        Merges overlapping boxes, passed in (x, y, w, h) format.
        """
        if not boxes:
            return []

        # Sort based on y-value. Each box is in format x, y, w, h, but convert it to xmin/xmax format for convenience
        boxes = sorted(([x, y, x + w, y + h] for x, y, w, h in boxes), key=lambda x: x[0])

        # Seed the 'current' box with the first bounding box. Iterate over all subsequent boxes,
        # comparing each to the 'current' box and merging the two if they overlap. When a non-overlapping
        # box is detected, return the 'current' box and set a new 'current' box.
        current = boxes[0]
        for box in boxes[1:]:
            if current[2] >= box[0] and box[2] >= current[0] and current[3] >= box[1] and box[3] >= current[1]:
                current = [
                    min(current[0], box[0]),
                    min(current[1], box[1]),
                    max(current[2], box[2]),
                    max(current[3], box[3]),
                ]
            else:
                # No overlap, return the last box and update the current box
                yield [current[0], current[1], current[2] - current[0], current[3] - current[1]]
                current = box
        # Return the final box
        yield [current[0], current[1], current[2] - current[0], current[3] - current[1]]

    def deskew_image_text(self, image: np.ndarray, line_length_prop=0.5, max_skew_angle=10) -> np.ndarray:
        """
        Deskew an image using Hough transforms to detect lines.

        Since even small-angled skews can compromise the line segmentation algorithm, this is needed as a preprocessing step.

        line_length_prop: typical line length as a fraction of the horizontal size of an image.
        max_skew_angle: maximum angle in degrees that a putative line can be skewed before it is removed from consideration
            for being too skewed.
        """
        line_length = image.shape[1] * line_length_prop
        # Flatten image to grayscale for edge detection
        image_grayscale = cv.cvtColor(np.array(image, dtype=np.uint8), cv.COLOR_BGR2GRAY)
        edges = cv.Canny(image_grayscale, 50, 20)
        lines = cv.HoughLinesP(
            edges, rho=1, theta=np.pi / 180, threshold=100, minLineLength=line_length, maxLineGap=20
        )
        # Assume that the larger image is mostly aligned, so filter out lines that have an angle too far off horizontal
        if lines is None:
            skew_angle = 0
        else:
            skew_angle = -np.mean([angle for angle in self.compute_line_angle(lines) if angle < max_skew_angle])

        # Rotate the image about its center `skew_angle` degrees, without scaling (s=1).
        rotation_mat = cv.getRotationMatrix2D((image.shape[1] / 2, image.shape[0] / 2), skew_angle, 1)
        return cv.warpAffine(np.array(image, dtype=np.uint8), rotation_mat, (image.shape[1], image.shape[0]))

    def split_text_blocks(self, image: np.ndarray, line_length_prop=0.5) -> list[np.ndarray]:
        """
        Splits an image with text in it into possibly multiple images, one for each line.

        line_length_prop: typical line length as a fraction of the horizontal size of an image.
        """
        line_length = image.shape[1] * line_length_prop
        rotated = self.deskew_image_text(image, line_length_prop)

        # Invert threshold and dilate using a horizontal kernel to "expand" the size of text blocks
        _, thresh = cv.threshold(cv.cvtColor(rotated, cv.COLOR_BGR2GRAY), 128, 255, cv.THRESH_BINARY_INV)

        # Kernel height of 1 implies a minimum separation between lines of 1px
        kernel = np.ones([1, int(line_length)], np.uint8)
        dial = cv.dilate(thresh, kernel)

        # Estimate contours, only looking for outlines (`RETR_EXTERNAL`) and simplifying the shapes (`CHAIN_APPROX_SIMPLE`)
        contours, _ = cv.findContours(dial, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

        # Simplify each contour into a bounding box
        bbox = [cv.boundingRect(contour) for contour in contours]

        acc = []
        # Merge overlapping bounding boxes, then sort the bounding boxes by y-position (top to bottom)
        for x, y, w, h in sorted(self.merge_bounding_boxes(bbox), key=lambda x: x[1]):
            # Filter lines that are too tiny and probably invalid
            if h < 10:
                continue

            res = rotated[y : (y + h), x : (x + w)]
            acc.append(res)

        # If we skipped all potential text blocks due to filtering conditions, return the
        # original image anyway.
        if len(acc) == 0:
            return [image]
        return acc

    def image_to_text(self, segments: dict[str, np.ndarray]) -> dict[str, tuple[str, float]]:
        digitized: dict[str, tuple[str, float]] = {}
        for label, image in segments.items():
            if image is None:
                continue

            generated_text = []
            confidence = []

            text_blocks = self.split_text_blocks(image)

            # Ignore output from `split_text_blocks` algorithm if only one text block is detected
            if len(text_blocks) == 1:
                text_blocks = [image]

            for block in text_blocks:
                pixel_values = self.processor(images=block, return_tensors="pt").pixel_values
                with torch.no_grad():
                    outputs = self.model.generate(
                        pixel_values, max_new_tokens=100, output_scores=True, return_dict_in_generate=True
                    )

                generated_text.append(self.processor.batch_decode(outputs.sequences, skip_special_tokens=True)[0])
                confidence.append(self.calculate_confidence(outputs))

            digitized[label] = (" ".join(generated_text), min(confidence))

        return digitized

    def calculate_confidence(self, outputs):
        probs = torch.softmax(outputs.scores[0], dim=-1)
        max_probs = torch.max(probs, dim=-1).values

        # Calculate the average confidence
        avg_confidence = torch.mean(max_probs).item()

        # Convert to percentage
        confidence_percentage = avg_confidence * 100

        return confidence_percentage
