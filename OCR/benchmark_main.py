import argparse

from ocr.services.batch_segmentation import BatchSegmentationOCR
from ocr.services.batch_metrics import BatchMetricsAnalysis


def main():
    parser = argparse.ArgumentParser(description="Run OCR and metrics analysis.")
    parser.add_argument("image_folder", help="Path to the folder containing image files.")
    parser.add_argument("segmentation_template", help="Path to the segmentation template.")
    parser.add_argument("labels_path", help="Path to the labels file (JSON).")
    parser.add_argument("output_folder", help="Path to the folder where OCR results will be saved.")
    parser.add_argument("ground_truth_folder", help="Path to the folder with ground truth JSON files.")
    parser.add_argument("csv_output_folder", help="Path to the folder where CSV metrics will be saved.")
    parser.add_argument(
        "run_type",
        type=int,
        choices=[1, 2, 3],
        help="Choose run type: 1 for Segmentation Only, 2 for Metrics Only, 3 for Both.",
    )

    args = parser.parse_args()

    ocr_results = None

    if args.run_type == 1:  # Segmentation Only
        print("Running segmentation and OCR...")
        ocr_results = run_segmentation_and_ocr(args)
    elif args.run_type == 2:  # Metrics Only
        print("Running metrics analysis...")
        run_metrics_analysis(args, ocr_results=None)
    elif args.run_type == 3:
        print("Running both segmentation,ocr and metrics analysis...")
        ocr_results = run_segmentation_and_ocr(args)
        run_metrics_analysis(args, ocr_results)


def run_segmentation_and_ocr(args):
    """
    Runs segmentation and OCR processing.
    Returns OCR results with processing time.
    """
    segmentation_ocr = BatchSegmentationOCR(
        args.image_folder, args.segmentation_template, args.labels_path, args.output_folder
    )
    ocr_results = segmentation_ocr.process_images()
    print(f"OCR results saved to: {args.output_folder}")
    return ocr_results


def run_metrics_analysis(args, ocr_results):
    """
    Runs metrics analysis based on OCR output and ground truth.
    Uses OCR results to capture time values if available.
    """
    metrics_analysis = BatchMetricsAnalysis(args.output_folder, args.ground_truth_folder, args.csv_output_folder)
    metrics_analysis.calculate_batch_metrics(ocr_results)  # Pass OCR results
    print(f"Metrics analysis completed. Results saved to: {args.csv_output_folder}")


if __name__ == "__main__":
    main()
