from ocr.services.metrics_analysis import OCRMetrics
import os
import csv


class BatchMetricsAnalysis:
    def __init__(self, ocr_folder, ground_truth_folder, csv_output_folder):
        self.ocr_folder = ocr_folder
        self.ground_truth_folder = ground_truth_folder
        self.csv_output_folder = csv_output_folder

        os.makedirs(self.csv_output_folder, exist_ok=True)

    def calculate_batch_metrics(self, ocr_results=None):
        """
        Processes OCR and ground truth files and saves individual CSVs.
        """
        print(f"Loading OCR files from: {self.ocr_folder}")
        print(f"Loading ground truth files from: {self.ground_truth_folder}")
        print(f"Saving individual CSVs to: {self.csv_output_folder}")
        total_metrics_summary = {}
        time_taken = 0.0
        problematic_segments = []

        if ocr_results is not None:
            for result in ocr_results:
                time_taken = result["time_taken"]

        ocr_files = self.get_files_in_directory(self.ocr_folder)
        ground_truth_files = self.get_files_in_directory(self.ground_truth_folder)

        if len(ocr_files) != len(ground_truth_files):
            print("Warning: The number of OCR files and ground truth files do not match.")

        for ocr_file, ground_truth_file in zip(ocr_files, ground_truth_files):
            print(f"Processing OCR: {ocr_file} with Ground Truth: {ground_truth_file}")

            ocr_path = os.path.join(self.ocr_folder, ocr_file)
            ground_truth_path = os.path.join(self.ground_truth_folder, ground_truth_file)

            ocr_metrics = OCRMetrics(ocr_json_path=ocr_path, ground_truth_json_path=ground_truth_path)
            metrics = ocr_metrics.calculate_metrics()

            self.extract_problematic_segments(metrics, ocr_file, problematic_segments)

            total_metrics = ocr_metrics.total_metrics(metrics)
            total_metrics["total_time_taken"] = f"{time_taken:.2f} seconds"

            # Create a CSV path for this specific file pair
            csv_file_name = f"{os.path.splitext(ocr_file)[0]}_metrics.csv"
            csv_output_path = os.path.join(self.csv_output_folder, csv_file_name)

            print(f"Saving metrics to: {csv_output_path}")
            self.save_metrics_to_csv(metrics, total_metrics, csv_output_path)

            # Store total metrics for summary reporting
            total_metrics_summary[ocr_file] = total_metrics

        problematic_csv_path = os.path.join(self.csv_output_folder, "problematic_segments.csv")
        print(f"Saving problematic segments to: {problematic_csv_path}")
        self.save_problematic_segments_to_csv(problematic_segments, problematic_csv_path)

        print("Finished processing all files.")
        return total_metrics_summary

    @staticmethod
    def save_metrics_to_csv(metrics, total_metrics, file_path):
        """
        Saves individual and total metrics to a CSV file, including time taken.
        """
        print(metrics)
        metric_keys = list(metrics[0].keys())
        total_metric_keys = list(total_metrics.keys())

        with open(file_path, "w", newline="") as output_file:
            # Write individual metrics
            dict_writer = csv.DictWriter(output_file, fieldnames=metric_keys)
            dict_writer.writeheader()
            dict_writer.writerows(metrics)

            output_file.write("\n")

            # Write total metrics
            total_writer = csv.DictWriter(output_file, fieldnames=total_metric_keys)
            total_writer.writeheader()
            total_writer.writerow(total_metrics)

        print(f"Metrics saved to {file_path}")

    @staticmethod
    def save_problematic_segments_to_csv(segments, file_path):
        """
        Saves problematic segments (Levenshtein distance >= 1) to a CSV file.
        """
        if not segments:
            print("No problematic segments found.")
            return

        with open(file_path, "w", newline="") as output_file:
            fieldnames = ["file", "key", "ocr_value", "ground_truth", "confidence", "levenshtein_distance"]
            writer = csv.DictWriter(output_file, fieldnames=fieldnames)

            writer.writeheader()
            writer.writerows(segments)

        print(f"Problematic segments saved to {file_path}")

    def extract_problematic_segments(self, metrics, ocr_file, problematic_segments):
        """
        Extracts segments with Levenshtein distance >= 1 and stores them.
        """
        for metric in metrics:
            if metric["levenshtein_distance"] >= 1:
                problematic_segments.append(
                    {
                        "file": ocr_file,
                        "key": metric["key"],
                        "ocr_value": metric["ocr_text"],
                        "ground_truth": metric["ground_truth"],
                        "confidence": metric["confidence"],
                        "levenshtein_distance": metric["levenshtein_distance"],
                    }
                )

    @staticmethod
    def get_files_in_directory(directory):
        """
        Returns a list of files in the specified directory.
        """
        try:
            files = sorted(
                [
                    f
                    for f in os.listdir(directory)
                    if os.path.isfile(os.path.join(directory, f)) and not f.startswith(".")
                ]
            )
            print(f"Files found in {directory}: {files}")
            return files
        except FileNotFoundError as e:
            print(f"Error: {e}")
            return []
