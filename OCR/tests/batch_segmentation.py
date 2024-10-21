import os
import json
import time
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
        i = 0

        for image_file in os.listdir(self.image_folder):
            if image_file.lower().endswith((".png", ".jpg", ".jpeg", ".tiff")):
                image_path = os.path.join(self.image_folder, image_file)
                print(f"Processing {image_file}...")

                ocr_result, time_taken = self.segment_ocr_image(segmenter, ocr, image_path, image_file)

                results.append({"image_file": image_file, "ocr_result": ocr_result, "time_taken": time_taken})
            i = i + 1
            if i > 1:
                break
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
