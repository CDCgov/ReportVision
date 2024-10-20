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

        text = str(text)

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
        if json_data is None:
            return {}
        extracted_values = {}
        for key, value in json_data.items():
            if isinstance(value, list) and len(value) >= 2:
                extracted_value, confidence = value[0], value[1]
            else:
                extracted_value, confidence = value, 100.0  # defaults to 100% if no confidence provided.

            normalized_key = self.normalize(key)
            normalized_value = self.normalize(extracted_value)

            extracted_values[normalized_key] = {
                "value": normalized_value,
                "confidence": confidence,
            }

        return extracted_values

    def calculate_metrics(self):
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
    def total_metrics(metrics):
        total_raw_distance = sum(item["raw_distance"] for item in metrics if isinstance(item["raw_distance"], int))
        total_levenshtein_distance = sum(
            item["levenshtein_distance"] for item in metrics if isinstance(item["levenshtein_distance"], int)
        )
        total_confidence = sum(item["confidence"] for item in metrics)
        avg_confidence = total_confidence / len(metrics) if metrics else 0

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
    def save_metrics_to_csv(metrics, total_metrics, file_path):
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
