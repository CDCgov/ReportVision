import os
import json
import argparse
import time
import csv
from ocr.services.image_segmenter import ImageSegmenter
from ocr.services.image_ocr import ImageOCR


def process_images_in_batch(image_folder, segmentation_template, labels_path, output_folder, csv_output_path):
    os.makedirs(output_folder, exist_ok=True)
    i = 0
    time_dict = {}
    segmenter = ImageSegmenter()
    ocr = ImageOCR()

    for image_file in os.listdir(image_folder):
        if image_file.lower().endswith((".png", ".jpg", ".jpeg", ".tiff")):
            image_path = os.path.join(image_folder, image_file)
            print(f"Processing {image_file}...")

            # Measure the time taken for segmentation and OCR
            time_taken = segment_ocr_image(
                segmenter, ocr, image_path, segmentation_template, labels_path, output_folder, image_file
            )

            print(f"Time taken for {image_file}: {time_taken:.2f} seconds")
            time_dict[image_file] = time_taken
        # added an if to limit iterations otherwise it takes a long time...
        i = i + 1
        if i > 2:
            break
    write_times_to_csv(time_dict, csv_output_path)


def segment_ocr_image(segmenter, ocr, image_path, segmentation_template, labels_path, output_folder, image_file):
    """
    Segments and runs ocr on image. Measures time it takes to run OCR
    """
    start_time = time.time()

    segments = segmenter.load_and_segment(image_path, segmentation_template, labels_path)

    print("{:<20} {:<20}".format("Label", "Segment shape"))
    for label, segment in segments.items():
        segment_shape = segment.shape if segment is not None else "INVALID"
        print("{:<20} {:<20}".format(f"{segment_shape}", label))

    ocr_results = ocr.image_to_text(segments)

    ocr_output_path = os.path.join(output_folder, f"{os.path.splitext(image_file)[0]}_ocr.json")
    with open(ocr_output_path, "w") as f:
        json.dump(ocr_results, f, indent=4)

    end_time = time.time()
    time_taken = end_time - start_time

    return time_taken


def write_times_to_csv(time_dict, csv_output_path):
    """
    Writes the time taken for each image file to a CSV file.
    """
    with open(csv_output_path, mode="w", newline="") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(["Image File", "Processing Time (seconds)"])

        for image_file, time_taken in time_dict.items():
            writer.writerow([image_file, f"{time_taken:.2f}"])

    print(f"Processing times saved to {csv_output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch OCR processing for a folder of images.")
    parser.add_argument("image_folder", help="Path to the folder containing image files.")
    parser.add_argument("segmentation_template", help="Path to the segmentation template.")
    parser.add_argument("labels_path", help="Path to the labels file (JSON).")
    parser.add_argument("output_folder", help="Path to the folder where OCR results will be saved.")

    args = parser.parse_args()

    process_images_in_batch(
        args.image_folder, args.segmentation_template, args.labels_path, args.output_folder, "time_values.csv"
    )
