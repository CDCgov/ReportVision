import os
import json
import time
from ocr.services.image_segmenter import ImageSegmenter
from ocr.services.image_ocr import ImageOCR


class SegmentationOCRBatch:
    def __init__(self, image_folder, segmentation_template, labels_path, output_folder):
        self.image_folder = image_folder
        self.segmentation_template = segmentation_template
        self.labels_path = labels_path
        self.output_folder = output_folder
        os.makedirs(output_folder, exist_ok=True)

    def process_images(self):
        i = 0
        segmenter = ImageSegmenter()
        ocr = ImageOCR()
        results = []

        for image_file in os.listdir(self.image_folder):
            if image_file.lower().endswith((".png", ".jpg", ".jpeg", ".tiff")):
                image_path = os.path.join(self.image_folder, image_file)
                print(f"Processing {image_file}...")

                ocr_result, time_taken = self.segment_ocr_image(segmenter, ocr, image_path, image_file)
                results.append({"image_file": image_file, "ocr_result": ocr_result, "time_taken": time_taken})

            # added an if to limit iterations otherwise it takes a long time...
            i = i + 1
            if i > 0:
                break
        return results

    def segment_ocr_image(self, segmenter, ocr, image_path, image_file):
        """
        Segments and runs ocr on image. Measures time it takes to run OCR
        """
        start_time = time.time()

        segments = segmenter.load_and_segment(image_path, self.segmentation_template, self.labels_path)

        ocr_result = ocr.image_to_text(segments)

        ocr_output_path = os.path.join(self.output_folder, f"{os.path.splitext(image_file)[0]}.json")

        print("{:<20} {:<20} {:<20}".format("Label", "Text", "Confidence"))
        for label, (text, confidence) in ocr_result.items():
            print("{:<20} {:<20} {:<20.2f}".format(label, text, confidence))
        with open(ocr_output_path, "w") as f:
            json.dump(ocr_result, f, indent=4)

        time_taken = time.time() - start_time
        return ocr_result, time_taken
