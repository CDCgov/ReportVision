import argparse
from tests.batch_segmentation import BatchSegmentationOCR
from tests.batch_metrics import BatchMetricsAnalysis


def main():
    parser = argparse.ArgumentParser(description="Run OCR and metrics analysis.")
    parser.add_argument("image_folder", help="Path to the folder containing image files.")
    parser.add_argument("segmentation_template", help="Path to the segmentation template.")
    parser.add_argument("labels_path", help="Path to the labels file (JSON).")
    parser.add_argument("output_folder", help="Path to the folder where OCR results will be saved.")
    parser.add_argument("ground_truth_folder", help="Path to the folder with ground truth JSON files.")
    parser.add_argument("csv_output_folder", help="Path to the folder where CSV metrics will be saved.")

    args = parser.parse_args()

    # Step 1: Run segmentation and OCR
    segmentation_ocr = BatchSegmentationOCR(
        args.image_folder, args.segmentation_template, args.labels_path, args.output_folder
    )
    ocr_results = segmentation_ocr.process_images()

    # Step 2: Run metrics analysis and save CSVs
    metrics_analysis = BatchMetricsAnalysis(args.output_folder, args.ground_truth_folder, args.csv_output_folder)
    metrics_analysis.calculate_batch_metrics(ocr_results)


if __name__ == "__main__":
    main()
