"""Module for OCR using a transformers-based OCR model."""

from collections.abc import Iterator

from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import torch
import numpy as np
import cv2 as cv


class ImageOCR:
    """A class for OCR using the transformers-based models.

    Defaults to using the Microsoft TrOCR model from Hugging Face's transformers library.

    Attributes:
        processor (TrOCRProcessor): Processor for TrOCR model that prepares images for OCR.
        model (VisionEncoderDecoderModel): Pre-trained TrOCR model for extracting text from images.
    """

    def __init__(self, model="microsoft/trocr-large-printed"):
        """Initializes the ImageOCR class with the specified OCR model.

        Args:
            model (str, optional): The name of the pre-trained model to use. Default is "microsoft/trocr-large-printed".

        See Also:
        * https://huggingface.co/microsoft/trocr-large-printed
        """
        self.processor = TrOCRProcessor.from_pretrained(model)
        self.model = VisionEncoderDecoderModel.from_pretrained(model)

    @staticmethod
    def compute_line_angle(lines: list) -> Iterator[float]:
        """Computes the angle in degrees of the lines detected by the Hough transform, based on their endpoints.

        This method processes the output of `cv.HoughLinesP` (lines in (x1, y1, x2, y2) format) and computes the angle
        between each line and the horizontal axis.

        Args:
            lines (list): A list of lines represented as a list or tuple of endpoints [x1, y1, x2, y2].

        Yields:
            float: The angle (in degrees) of each line with respect to the horizontal axis.
        """
        for line in lines:
            start = line[0][0:2]
            end = line[0][2:4]
            diff = end - start
            yield 180 / np.pi * np.arctan2(*diff) - 90

    @staticmethod
    def merge_bounding_boxes(boxes: list) -> Iterator[list]:
        """Merges overlapping bounding boxes into a single bounding box.

        Given a list of bounding boxes in (x, y, w, h) format, this function merges overlapping boxes
        into one larger box.

        Args:
            boxes (list): A list of bounding boxes, where each box is represented as a list or tuple [x, y, w, h].

        Yields:
            list: Merged bounding boxes, represented in [x, y, w, h] format.
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

    def identify_blocks(self, input_image: np.ndarray, kernel: np.ndarray):
        """Identifies potential text blocks in an image by applying morphological operations.

        The function uses the input image, applies thresholding and dilation, and then finds contours to identify
        potential text blocks. It then merges overlapping bounding boxes into larger ones.

        Args:
            input_image (np.ndarray): The input image to process.
            kernel (np.ndarray): The kernel used for morphological operations (dilation).

        Returns:
            Iterator[list]: An iterator of merged bounding boxes, each represented as [x, y, w, h].
        """
        # Invert threshold `input_image` and dilate using `kernel` to "expand" the size of text blocks
        _, thresh = cv.threshold(cv.cvtColor(input_image, cv.COLOR_BGR2GRAY), 128, 255, cv.THRESH_BINARY_INV)
        dial = cv.dilate(thresh, kernel)

        # Estimate contours, only looking for outlines (`RETR_EXTERNAL`) and simplifying the shapes (`CHAIN_APPROX_SIMPLE`)
        contours, _ = cv.findContours(dial, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

        # Simplify each contour into a bounding box and merge potential overlaps
        return self.merge_bounding_boxes([cv.boundingRect(contour) for contour in contours])

    def deskew_image_text(self, image: np.ndarray, line_length_prop=0.5, max_skew_angle=10) -> np.ndarray:
        """Deskew an image using Hough transforms to detect lines and rotating the image to correct any skew.

        Since even small-angled skews can compromise the line segmentation algorithm, this is needed as a preprocessing step.

        Args:
            image (np.ndarray): The image to be deskewed.
            line_length_prop (float, optional): Proportion of the image's width used to determine line length. Default is 0.5.
            max_skew_angle (float, optional): Maximum allowed skew angle for valid lines (in degrees). Default is 10.

        Returns:
            np.ndarray: The deskewed image.
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
        """Splits an image with text in it into (possibly) multiple images, one for each line.

        The function first deskews the image, then uses morphological operations to identify potential lines and words.
        It then separates the image into individual text blocks (lines and words).

        Args:
            image (np.ndarray): The image to split into text blocks.
            line_length_prop (float, optional): Proportion of the image's width used to determine the typical line length. Default is 0.5.

        Returns:
            list[np.ndarray]: A list of images representing individual text blocks.
        """
        line_length = image.shape[1] * line_length_prop
        rotated = self.deskew_image_text(image, line_length_prop)

        # Kernels for morphological operations.
        # Kernel height of 1 implies a minimum separation between lines of 1px
        line_kernel = np.ones([1, int(line_length)], np.uint8)
        # 11x5 cross-shaped kernel to help identify words in blank space.
        word_kernel = cv.getStructuringElement(cv.MORPH_CROSS, (11, 5))

        acc = []

        # Sort identified lines by y-position (top to bottom)
        for x, y, w, h in sorted(self.identify_blocks(rotated, line_kernel), key=lambda x: x[1]):
            # Filter lines that are too tiny and probably invalid
            if h < 5:
                continue

            res = rotated[y : (y + h), x : (x + w)]

            # Sort identified text blocks (putative words or phrases) by x-position (left to right)
            for x, y, w, h in sorted(self.identify_blocks(res, word_kernel), key=lambda x: x[0]):
                acc.append(res[y : (y + h), x : (x + w)])

        # If we skipped all potential text blocks due to filtering conditions, return the
        # original image anyway.
        if len(acc) == 0:
            return [image]
        return acc

    def image_to_text(self, segments: dict[str, np.ndarray]) -> dict[str, tuple[str, float]]:
        """Converts image segments into text using Transformers OCR.

        For each segment, it extracts the text and the average confidence score.

        Args:
            segments (dict[str, np.ndarray]): A dictionary where keys are segment labels (e.g., 'name', 'date'),
                                              and values are NumPy arrays representing the corresponding image segments.

        Returns:
            dict[str, tuple[str, float]]: A dictionary where each key corresponds to a segment label, and each value is
                                          a tuple containing the OCR result (string) and the confidence score (float).
        """
        digitized: dict[str, tuple[str, float]] = {}
        for label, image in segments.items():
            if image is None:
                continue

            generated_text = []
            confidence = []

            text_blocks = self.split_text_blocks(image)

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
        """Calculates the confidence level of the OCR output.

        Args:
            outputs: The output of the model, containing prediction scores.

        Returns:
            float: The confidence percentage of the OCR output.
        """
        probs = torch.softmax(outputs.scores[0], dim=-1)
        max_probs = torch.max(probs, dim=-1).values

        # Calculate the average confidence
        avg_confidence = torch.mean(max_probs).item()

        # Convert to percentage
        confidence_percentage = avg_confidence * 100

        return confidence_percentage
