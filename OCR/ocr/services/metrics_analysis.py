"""Module to calculate OCR metrics and compare results to ground truth data."""

import json
import csv
import Levenshtein
from statistics import mean


class OCRMetrics:
    """Class to calculate and manage OCR metrics, comparing OCR results with ground truth data.

    This class computes various OCR performance metrics such as raw distance, Hamming distance, and Levenshtein distance
    between the OCR output and the ground truth. It also calculates overall accuracy and confidence metrics.

    Attributes:
        ocr_json (dict): A dict from JSON data containing OCR results.
        ground_truth_json (dict): A dict from JSON data containing the ground truth values.
    """

    def __init__(self, ocr_json_path=None, ground_truth_json_path=None, ocr_json=None, ground_truth_json=None):
        """Initializes the OCRMetrics object with OCR and ground truth data, either loaded from files or provided as dictionaries.

        Args:
            ocr_json_path (str, optional): Path to the OCR JSON file.
            ground_truth_json_path (str, optional): Path to the ground truth JSON file.
            ocr_json (dict, optional): The OCR results as a dictionary.
            ground_truth_json (dict, optional): The ground truth values as a dictionary.

        Raises:
            ValueError: If both file paths and dictionaries are provided.
        """
        if ocr_json and ocr_json_path:
            raise ValueError("Cannot specify both OCR results dict and JSON path!")
        if ground_truth_json and ground_truth_json_path:
            raise ValueError("Cannot specify both OCR ground truth dict and JSON path!")

        if ocr_json_path:
            ocr_json = self.load_json_file(ocr_json_path)
        if ground_truth_json_path:
            ground_truth_json = self.load_json_file(ground_truth_json_path)

        self.ocr_json = ocr_json
        self.ground_truth_json = ground_truth_json

    def load_json_file(self, file_path: str) -> dict | None:
        """Loads JSON data from a file.

        Args:
            file_path (str): Path to the JSON file.

        Returns:
            dict: Parsed JSON data as a dictionary, or None if the file path was not passed.
        """
        if file_path:
            with open(file_path, "r") as file:
                data = json.load(file)
            return data

    @staticmethod
    def normalize(text: str | None) -> str:
        """Normalizes text by stripping whitespace, converting to lowercase, and collapsing multiple spaces.

        Args:
            text (str or None): The input text to normalize.

        Returns:
            str: The normalized text.
        """
        if text is None:
            return ""

        text = str(text)

        return " ".join(text.strip().lower().split())

    @staticmethod
    def raw_distance(ocr_text: str, ground_truth: str) -> int:
        """Calculates a raw distance between text strings by the difference in length.

        Args:
            ocr_text (str): The OCR-generated text.
            ground_truth (str): The ground truth text.

        Returns:
            int: The difference in length between the OCR text and ground truth.
        """
        return len(ground_truth) - len(ocr_text)

    @staticmethod
    def hamming_distance(ocr_text: str, ground_truth: str) -> int:
        """Calculates the Hamming distance between two strings, assuming they have the same length.

        Args:
            ocr_text (str): The OCR-generated text.
            ground_truth (str): The ground truth text.

        Returns:
            int: The number of positions where the characters differ.

        Raises:
            ValueError: If the strings are not of the same length.
        """
        if len(ocr_text) != len(ground_truth):
            raise ValueError("Strings must be of the same length to calculate Hamming distance.")
        return Levenshtein.hamming(ocr_text.upper(), ground_truth.upper())

    @staticmethod
    def levenshtein_distance(ocr_text: str, ground_truth: str) -> int:
        """Calculates the Levenshtein distance between two strings.

        Args:
            ocr_text (str): The OCR-generated text.
            ground_truth (str): The ground truth text.

        Returns:
            int: The minimum number of single-character edits required to change one string into the other.
        """
        return Levenshtein.distance(ocr_text.upper(), ground_truth.upper())

    def extract_values_from_json(self, json_data: dict) -> dict:
        """Extracts and normalizes the values from JSON data.

        Args:
            json_data (dict): The input JSON data.

        Returns:
            dict: A dictionary containing normalized data.
        """
        if json_data is None:
            return {}
        extracted_values = {}
        for key, value in json_data.items():
            if isinstance(value, list) and len(value) >= 2:
                extracted_value, confidence = value[0], value[1]
            else:
                extracted_value, confidence = value, 0  # defaults to 0% if no confidence provided.

            normalized_key = self.normalize(key)
            normalized_value = self.normalize(extracted_value)

            extracted_values[normalized_key] = {
                "value": normalized_value,
                "confidence": confidence,
            }

        return extracted_values

    def calculate_metrics(self) -> list[dict[str, str | float | int]]:
        """Calculates OCR performance metrics for each key-value pair in the ground truth data.

        This compares the OCR output to ground-truth data and calculates:
        * Raw distance
        * Hamming distance
        * Levenshtein distance

        Returns:
            list: A list of dictionaries containing, for each key, the OCR output, ground truth data, confidence, and distance metrics.
        """
        ocr_values = self.extract_values_from_json(self.ocr_json)
        ground_truth_values = self.extract_values_from_json(self.ground_truth_json)
        metrics = []
        for key in ground_truth_values:
            ocr_entry = ocr_values.get(key, {"value": "", "confidence": 0.0})
            ocr_text = ocr_entry["value"]
            confidence = ocr_entry["confidence"]
            ground_truth = ground_truth_values[key]["value"]

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
                    "confidence": confidence,
                    "raw_distance": raw_dist,
                    "hamming_distance": ham_dist,
                    "levenshtein_distance": lev_dist,
                }
            )
        return metrics

    @staticmethod
    def total_metrics(metrics: dict) -> dict[str, int | float]:
        """Summarizes many OCR metrics and calculates total distances and accuracy.

        Args:
            metrics (list): A list of dictionaries containing individual metrics for each key.

        Returns:
            dict: A dictionary containing summary metrics.
        """
        total_raw_distance = sum(item["raw_distance"] for item in metrics if isinstance(item["raw_distance"], int))
        total_levenshtein_distance = sum(
            item["levenshtein_distance"] for item in metrics if isinstance(item["levenshtein_distance"], int)
        )
        avg_confidence = mean(item["confidence"] for item in metrics) if metrics else 0

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
            "avg_confidence": f"{avg_confidence:.2f}",
        }

    @staticmethod
    def save_metrics_to_csv(metrics: list, total_metrics: dict, file_path: str) -> None:
        """Saves OCR metrics and summarized metrics to a CSV file.

        Args:
            metrics (list): A list of dictionaries containing individual metrics.
            total_metrics (dict): A dictionary containing the summary metrics.
            file_path (str): The path where metrics will be saved as a CSV file.
        """
        metric_keys = metrics[0].keys()

        total_metric_keys = total_metrics.keys()

        with open(file_path, "w", newline="") as output_file:
            dict_writer = csv.DictWriter(output_file, fieldnames=metric_keys)
            dict_writer.writeheader()
            dict_writer.writerows(metrics)

            output_file.write("\n")

            total_writer = csv.DictWriter(output_file, fieldnames=total_metric_keys)

            total_writer.writeheader()

            total_writer.writerow(total_metrics)
