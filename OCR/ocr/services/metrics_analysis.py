import json
from difflib import SequenceMatcher
import os

from dotenv import load_dotenv
import csv
import Levenshtein


def load_json_file(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)
    return data


def normalize(text):
    if text is None:
        return ""
    return " ".join(text.strip().lower().replace(":", "").replace("#", "").replace(" ", "").split())


def raw_distance(ocr_text, ground_truth):
    return len(ground_truth) - len(ocr_text)


def hamming_distance(ocr_text, ground_truth):
    if len(ocr_text) != len(ground_truth):
        raise ValueError("Strings must be of the same length to calculate Hamming distance.")
    return Levenshtein.hamming(ocr_text, ground_truth)


def levenshtein_distance(ocr_text, ground_truth):
    return SequenceMatcher(None, ocr_text, ground_truth).ratio()


def extract_values_from_json(json_data):
    extracted_values = {}
    for item in json_data:
        if isinstance(item, dict) and "key" in item and "value" in item:
            key = normalize(item["key"])
            value = normalize(item["value"])
            extracted_values[key] = value
        else:
            raise ValueError("Invalid JSON format")
    return extracted_values


def calculate_metrics(ocr_json, ground_truth_json):
    ocr_values = extract_values_from_json(ocr_json)
    ground_truth_values = extract_values_from_json(ground_truth_json)

    metrics = []
    for key in ground_truth_values:
        ocr_text = ocr_values.get(key, "")
        ground_truth = ground_truth_values[key]
        raw_dist = raw_distance(ocr_text, ground_truth)
        try:
            ham_dist = hamming_distance(ocr_text, ground_truth)
        except ValueError as e:
            ham_dist = str(e)
        lev_dist = levenshtein_distance(ocr_text, ground_truth)
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


def total_metrics(metrics):
    raw_dist_sum = sum(m["raw_distance"] for m in metrics if isinstance(m["raw_distance"], int))
    ham_dist_sum = sum(m["hamming_distance"] for m in metrics if isinstance(m["hamming_distance"], int))
    lev_dist_sum = sum(m["levenshtein_distance"] for m in metrics)

    count_raw = sum(1 for m in metrics if isinstance(m["raw_distance"], int))
    count_ham = sum(1 for m in metrics if isinstance(m["hamming_distance"], int))
    count_lev = len(metrics)

    avg_raw_dist = raw_dist_sum / count_raw if count_raw else 0
    avg_ham_dist = ham_dist_sum / count_ham if count_ham else 0
    avg_lev_dist = lev_dist_sum / count_lev if count_lev else 0

    return {
        "average_raw_distance": avg_raw_dist,
        "average_hamming_distance": avg_ham_dist,
        "average_levenshtein_distance": avg_lev_dist,
    }


def save_metrics_to_csv(metrics, file_path):
    keys = metrics[0].keys()
    with open(file_path, "w", newline="") as output_file:
        dict_writer = csv.DictWriter(output_file, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(metrics)


def main():
    load_dotenv()
    current_script_dir = os.path.dirname(os.path.abspath(__file__))
    file_relative_path_ground_truth = "../../tests/assets/ltbi_legacy.json"
    file_relative_path_ocr = "../../tests/assets/ltbi_legacy_ocr.json"
    ground_truth_json_path = os.path.join(current_script_dir, file_relative_path_ground_truth)
    ocr_json_path = os.path.join(current_script_dir, file_relative_path_ocr)

    ground_truth_json = load_json_file(ground_truth_json_path)
    ocr_json = load_json_file(ocr_json_path)

    print(type(ground_truth_json))  # Should be a list
    print(type(ocr_json))  # Should be a list

    metrics = calculate_metrics(ocr_json, ground_truth_json)
    for m in metrics:
        print(m)
    overall_metrics = total_metrics(metrics)
    print("Overall Metrics:", overall_metrics)
    save_metrics_to_csv(metrics, "new.csv")


if __name__ == "__main__":
    main()
