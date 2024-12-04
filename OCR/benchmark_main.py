import argparse

from ocr.services.batch_segmentation import BatchSegmentationOCR
from ocr.services.batch_metrics import BatchMetricsAnalysis

from ocr.services.tesseract_ocr import TesseractOCR, PSM
from ocr.services.image_ocr import ImageOCR


def parse_args():
    parser = argparse.ArgumentParser(
        description="Run OCR and metrics analysis.", formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument("image_folder", help="Path to the folder containing image files.")
    parser.add_argument("segmentation_template", help="Path to the segmentation template.")
    parser.add_argument("labels_path", help="Path to the labels file (JSON).")
    parser.add_argument("output_folder", help="Path to the folder where OCR results will be saved.")
    parser.add_argument("ground_truth_folder", help="Path to the folder with ground truth JSON files.")
    parser.add_argument("csv_output_folder", help="Path to the folder where CSV metrics will be saved.")
    parser.add_argument(
        "--ocr",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Run (or don't run) segmentation and OCR analysis",
    )
    parser.add_argument(
        "--metrics", action=argparse.BooleanOptionalAction, default=True, help="Run (or don't run) metrics analysis"
    )
    parser.add_argument(
        "--model", choices=["tesseract", "trocr"], default="trocr", help="OCR model to run for `--ocr` option."
    )

    return parser.parse_args()


def main():
    args = parse_args()
    ocr_results = None

    if args.ocr:
        print(f"Running segmentation and OCR using {args.model}...")
        ocr_results = run_segmentation_and_ocr(args)
    if args.metrics:
        print("Running metrics analysis...")
        run_metrics_analysis(args, ocr_results=ocr_results)


def run_segmentation_and_ocr(args):
    """
    Runs segmentation and OCR processing.
    Returns OCR results with processing time.
    """

    model = None

    if args.model == "tesseract":
        # We are doing segmentation (not tesseract) so:
        # * Disable border rejection of text too close to the edge of the image
        # * Enforce single-line mode for tesseract
        model = TesseractOCR(psm=PSM.SINGLE_LINE, variables=dict(tessedit_image_border="0"))
    elif args.model == "trocr":
        model = ImageOCR()

    segmentation_ocr = BatchSegmentationOCR(
        args.image_folder, args.segmentation_template, args.labels_path, args.output_folder, model=model
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
