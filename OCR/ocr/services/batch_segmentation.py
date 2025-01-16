"""Process and segment a batch of images and perform OCR on the results."""

import os
import json
import time
import csv

from ocr.services.image_segmenter import ImageSegmenter
from ocr.services.image_ocr import ImageOCR


class BatchSegmentationOCR:
    """Class that processes a batch of images by segmenting them and performing OCR on the segments.

    Attributes:
        image_folder (str): Path to the folder containing images to process.
        segmentation_template (str): Path to the segmentation template to guide image segmentation.
        labels_path (str): Path to the file containing label data used for segmentation.
        output_folder (str): Path to the folder where OCR results and timing information will be saved.
        model (ImageOCR): An optional pre-defined OCR model; if None, a default instance of ImageOCR is used.
    """

    def __init__(
        self, image_folder: str, segmentation_template: str, labels_path: str, output_folder: str, model=None
    ) -> None:
        """Initializes the BatchSegmentationOCR instance with the specified paths and an optional OCR model.

        Args:
            image_folder (str): Path to the folder containing images to process.
            segmentation_template (str): Path to the segmentation template to guide image segmentation.
            labels_path (str): Path to the file containing label data used for segmentation.
            output_folder (str): Path to the folder where OCR results and timing information will be saved.
            model (ImageOCR, optional): An optional pre-defined OCR model. Defaults to `ImageOCR`.
        """
        self.image_folder = image_folder
        self.segmentation_template = segmentation_template
        self.labels_path = labels_path
        self.output_folder = output_folder
        self.model = model
        if self.model is None:
            self.model = ImageOCR()
        os.makedirs(self.output_folder, exist_ok=True)

    def process_images(self) -> list[dict]:
        """Processes all images and returns OCR results with time taken.

        Returns:
            list[dict]: A list of dictionaries containing the OCR results and time taken for each image.
        """
        segmenter = ImageSegmenter()
        ocr = self.model
        results = []
        time_dict = {}

        valid_images = [
            f for f in os.listdir(self.image_folder) if f.lower().endswith((".png", ".jpg", ".jpeg", ".tiff"))
        ]
        total_files = len(valid_images)  # Total valid files
        print(f"Found {total_files} valid images to process.")

        # Set a maximum iterations
        max_iterations = min(2, total_files)

        for i, image_file in enumerate(valid_images[:max_iterations]):
            image_path = os.path.join(self.image_folder, image_file)
            print(f"Processing {image_file}... ({i + 1}/{max_iterations})")

            # Perform segmentation and OCR
            ocr_result, time_taken = self.segment_ocr_image(segmenter, ocr, image_path, image_file)

            # Append results with time taken
            results.append({"image_file": image_file, "ocr_result": ocr_result, "time_taken": time_taken})
            time_dict[image_file] = time_taken
            # Notify user how many files are left
            remaining = max_iterations - (i + 1)
            print(f"{time_taken} time taken for this iteration")
            print(f"{remaining} iterations left...")

        self.write_times_to_csv(time_dict, self.output_folder)
        print("Processing complete.")
        return results

    def segment_ocr_image(
        self, segmenter: ImageSegmenter, ocr, image_path: str, image_file: str
    ) -> tuple[dict[str, tuple[str, float]], float]:
        """Segments the image and runs OCR, returning results and time taken.

        Args:
            segmenter (ImageSegmenter): An instance of the ImageSegmenter used to segment the image.
            ocr (ImageOCR): An instance of the OCR model used to extract text from the segments.
            image_path (str): Path to the image file to be processed.
            image_file (str): The name of the image file.

        Returns:
            tuple: A tuple containing:
                - dict: The OCR results, where the key is the label and the value is a tuple of (text, confidence).
                - float: The time taken to segment and process the image.
        """
        start_time = time.time()

        # Segment the image and run OCR
        segments = segmenter.load_and_segment(image_path, self.segmentation_template, self.labels_path)
        ocr_result = ocr.image_to_text(segments)

        print("{:<20} {:<20} {:<20}".format("Label", "Text", "Confidence"))
        for label, (text, confidence) in ocr_result.items():
            print("{:<20} {:<20} {:<20.2f}".format(label, text, confidence))

        # Save OCR results to JSON
        ocr_output_path = os.path.join(self.output_folder, f"{os.path.splitext(image_file)[0]}.json")
        with open(ocr_output_path, "w") as f:
            json.dump(ocr_result, f, indent=4)

        time_taken = time.time() - start_time
        return ocr_result, time_taken

    def write_times_to_csv(self, time_dict: dict[str, float], csv_output_path) -> None:
        """Writes the time taken for each file to a CSV.

        Args:
            time_dict (dict): A dictionary where the key is the image file name and the value is the time taken (in seconds).
            csv_output_path (str): Path to the folder where the CSV file will be saved.
        """
        csv_file_path = os.path.join(csv_output_path, "time_taken.csv")

        with open(csv_file_path, "w", newline="") as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(["File Name", "Time Taken (seconds)"])  # Write header

            for file_name, time_taken in time_dict.items():
                writer.writerow([file_name, f"{time_taken:.2f}"])

        print(f"Time taken for all files saved to: {csv_file_path}")
