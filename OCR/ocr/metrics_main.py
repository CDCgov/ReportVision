from services.metrics_analysis import OCRMetrics
import os

def main():
    current_script_dir = os.path.dirname(os.path.abspath(__file__))

    file_relative_path_ground_truth = ".."
    file_relative_path_ocr = ".."


    ground_truth_json_path = os.path.join(current_script_dir, file_relative_path_ground_truth)
    ocr_json_path = os.path.join(current_script_dir, file_relative_path_ocr)


    ocr_metrics = OCRMetrics(ocr_json_path, ground_truth_json_path)


    metrics = ocr_metrics.calculate_metrics()


    total_metrics = ocr_metrics.total_metrics(metrics)

    output_csv_path = os.path.join(current_script_dir, "metrics_file.csv")
    OCRMetrics.save_metrics_to_csv(metrics, total_metrics, output_csv_path)

if __name__ == "__main__":
    main()
