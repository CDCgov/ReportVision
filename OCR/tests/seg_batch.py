import os
import json
import argparse
from ocr.services.image_segmenter import ImageSegmenter
from ocr.services.image_ocr import ImageOCR


def process_images_in_batch(image_folder, segmentation_template, labels_path, output_folder):
    """
    Please only run this file locally for testing/dev purposes
    This class provides functions for batch running OCR on a folder full of images
    please provide the follow arguments in this order in order to run the batch OCR process:
    the images folder(input), segmentation template, labels path,output folder
    """

    os.makedirs(output_folder, exist_ok=True)

    segmenter = ImageSegmenter()
    ocr = ImageOCR()

    i = 0

    for image_file in os.listdir(image_folder):
        if image_file.lower().endswith((".png", ".jpg", ".jpeg", ".tiff")):
            image_path = os.path.join(image_folder, image_file)
            print(f"Processing {image_file}...")

            # Load and segment the image
            segments = segmenter.load_and_segment(image_path, segmentation_template, labels_path)

            # Print segment information (optional for debugging)
            print("{:<20} {:<20}".format("Label", "Segment shape"))
            for label, segment in segments.items():
                segment_shape = segment.shape if segment is not None else "INVALID"
                print("{:<20} {:<20}".format(f"{segment_shape}", label))

            # Run OCR on the segments
            ocr_results = ocr.image_to_text(segments)

            # Output the OCR results as a JSON file

            ocr_output_path = os.path.join(output_folder, f"{os.path.splitext(image_file)[0]}_ocr.json")
            with open(ocr_output_path, "w") as f:
                json.dump(ocr_results, f, indent=4)

            print(f"OCR results saved for {image_file} at {ocr_output_path}")
        i = i + 1
        if i > 5:
            break


if __name__ == "__main__":
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Batch OCR processing for a folder of images.")
    parser.add_argument("image_folder", help="Path to the folder containing image files.")
    parser.add_argument("segmentation_template", help="Path to the segmentation template.")
    parser.add_argument("labels_path", help="Path to the labels file (JSON).")
    parser.add_argument("output_folder", help="Path to the folder where OCR results will be saved.")

    args = parser.parse_args()

    # Run the batch processing function
    process_images_in_batch(args.image_folder, args.segmentation_template, args.labels_path, args.output_folder)
