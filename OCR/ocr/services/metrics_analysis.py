import json

import csv
import Levenshtein


class OCRMetrics:
    """
    A class to calculate and manage OCR metrics.

    """

    def __init__(
        self, ocr_json_path=None, ground_truth_json_path=None, ocr_json=None, ground_truth_json=None, testMode=False
    ):
        """
        Parameters:
        ocr_json (dict): The JSON data extracted from OCR.
        ground_truth_json (dict): The JSON data containing ground truth.
        """
        if testMode:
            self.ocr_json = ocr_json
            self.ground_truth_json = ground_truth_json
        else:
            self.ocr_json = self.load_json_file(ocr_json_path)
            self.ground_truth_json = self.load_json_file(ground_truth_json_path)

    def load_json_file(self, file_path):
        if file_path:
            with open(file_path, "r") as file:
                data = json.load(file)
            return data

    @staticmethod
    def normalize(text):
        if text is None:
            return ""
        return " ".join(text.strip().lower().split())

    @staticmethod
    def raw_distance(ocr_text, ground_truth):
        return len(ground_truth) - len(ocr_text)

    @staticmethod
    def hamming_distance(ocr_text, ground_truth):
        if len(ocr_text) != len(ground_truth):
            raise ValueError("Strings must be of the same length to calculate Hamming distance.")
        return Levenshtein.hamming(ocr_text, ground_truth)

    @staticmethod
    def levenshtein_distance(ocr_text, ground_truth):
        return Levenshtein.distance(ocr_text, ground_truth)

    def extract_values_from_json(self, json_data):
        extracted_values = {}
        for item in json_data:
            if isinstance(item, dict) and "key" in item and "value" in item:
                key = self.normalize(item["key"])
                value = self.normalize(item["value"])
                extracted_values[key] = value
            else:
                raise ValueError("Invalid JSON format")
        return extracted_values

    def calculate_metrics(self):
        ocr_values = self.extract_values_from_json(self.ocr_json)
        ground_truth_values = self.extract_values_from_json(self.ground_truth_json)

        metrics = []
        for key in ground_truth_values:
            ocr_text = ocr_values.get(key, "")
            ground_truth = ground_truth_values[key]
            raw_dist = self.raw_distance(ocr_text, ground_truth)
            try:
                ham_dist = self.hamming_distance(ocr_text, ground_truth)
            except ValueError as e:
                ham_dist = str(e)
            lev_dist = self.levenshtein_distance(ocr_text, ground_truth)
            metrics.append(
                {
                    "key": key,
                    "ocr_text": ocr_text,
                    "ground_truth": ground_truth,
                    "raw_distance": raw_dist,
                    "hamming_distance": ham_dist,
                    "levenshtein_distance": lev_dist,
                }
            )
        return metrics

    @staticmethod
    def total_metrics(metrics):
        total_raw_distance = sum(item["raw_distance"] for item in metrics if isinstance(item["raw_distance"], int))
        total_levenshtein_distance = sum(
            item["levenshtein_distance"] for item in metrics if isinstance(item["levenshtein_distance"], int)
        )

        try:
            total_hamming_distance = sum(
                item["hamming_distance"] for item in metrics if isinstance(item["hamming_distance"], int)
            )
        except ValueError:
            total_hamming_distance = "N/A due to length mismatch"

        ground_truth_length = sum(len(item["ground_truth"]) for item in metrics)
        normalized_levenshtein_distance = (
            total_levenshtein_distance / ground_truth_length if ground_truth_length else 0
        )
        accuracy = (1 - normalized_levenshtein_distance) * 100

        return {
            "total_raw_distance": total_raw_distance,
            "total_hamming_distance": total_hamming_distance,
            "total_levenshtein_distance": total_levenshtein_distance,
            "levenshtein_accuracy": f"{accuracy:.2f}%",
        }

    @staticmethod
    def save_metrics_to_csv(metrics, file_path):
        keys = metrics[0].keys()
        with open(file_path, "w", newline="") as output_file:
            dict_writer = csv.DictWriter(output_file, fieldnames=keys)
            dict_writer.writeheader()
            dict_writer.writerows(metrics)

    def process_dataset(self, dataset_paths):
        """
        Processes multiple datasets for calculating metrics.
        Parameters:
        dataset_paths (list of dict): A list of dictionaries containing paths for ocr_json, ground_truth_json, and original_image.
        """
        all_metrics = []
        for paths in dataset_paths:
            self.ocr_json = self.load_json_file(paths['ocr_json_path'])
            self.ground_truth_json = self.load_json_file(paths['ground_truth_json_path'])
            metrics = self.calculate_metrics()
            all_metrics.extend(metrics)

        return all_metrics

    @staticmethod
    def batch_save_metrics_to_csv(metrics, file_path):
        """
        Save metrics for multiple datasets to a CSV.
        """
        if metrics:
            keys = metrics[0].keys()
            with open(file_path, "w", newline="") as output_file:
                dict_writer = csv.DictWriter(output_file, fieldnames=keys)
                dict_writer.writeheader()
                dict_writer.writerows(metrics)