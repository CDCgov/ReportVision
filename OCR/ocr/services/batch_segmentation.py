import os
import json
import time
import csv

from ocr.services.image_segmenter import ImageSegmenter
from ocr.services.image_ocr import ImageOCR


class BatchSegmentationOCR:
    def __init__(self, image_folder, segmentation_template, labels_path, output_folder):
        self.image_folder = image_folder
        self.segmentation_template = segmentation_template
        self.labels_path = labels_path
        self.output_folder = output_folder
        os.makedirs(self.output_folder, exist_ok=True)

    def process_images(self):
        """
        Processes all images and returns OCR results with time taken.
        """
        segmenter = ImageSegmenter()
        ocr = ImageOCR()
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

    def segment_ocr_image(self, segmenter, ocr, image_path, image_file):
        """
        Segments the image and runs OCR, returning results and time taken.
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

    def write_times_to_csv(self, time_dict, csv_output_path):
        """
        Writes the time taken for each file to a CSV.
        """
        csv_file_path = os.path.join(csv_output_path, "time_taken.csv")

        with open(csv_file_path, "w", newline="") as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(["File Name", "Time Taken (seconds)"])  # Write header

            for file_name, time_taken in time_dict.items():
                writer.writerow([file_name, f"{time_taken:.2f}"])

        print(f"Time taken for all files saved to: {csv_file_path}")
