import json
from difflib import SequenceMatcher
import os

from dotenv import load_dotenv
import csv


def load_json_file(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)
    return data


def normalize(text):
    if text is None:
        return ""
    return " ".join(text.strip().lower().replace(":", "").replace("#", "").replace(" ", "").split())


def character_accuracy(ocr_text, ground_truth):
    correct_chars = sum(1 for o, g in zip(ocr_text, ground_truth) if o == g)
    return correct_chars / len(ground_truth) * 100 if len(ground_truth) > 0 else 0


def word_accuracy(ocr_text, ground_truth):
    ocr_words = ocr_text.split()
    ground_truth_words = ground_truth.split()
    correct_words = sum(1 for o, g in zip(ocr_words, ground_truth_words) if o == g)
    return correct_words / len(ground_truth_words) * 100 if len(ground_truth_words) > 0 else 0


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
        # print(f"Comparing OCR text: '{ocr_text}' with Ground Truth: '{ground_truth}' for key: '{key}'")
        # if not ocr_text:
        # print(f"Warning: No OCR text found for key '{key}'")
        char_acc = character_accuracy(ocr_text, ground_truth)
        word_acc = word_accuracy(ocr_text, ground_truth)
        lev_dist = levenshtein_distance(ocr_text, ground_truth)
        metrics.append(
            {
                "key": key,
                "ocr_text": ocr_text,
                "ground_truth": ground_truth,
                "character_accuracy": char_acc,
                "word_accuracy": word_acc,
                "levenshtein_distance": lev_dist,
            }
        )
    return metrics


def total_metrics(metrics):
    char_acc_sum = sum(m["character_accuracy"] for m in metrics)
    word_acc_sum = sum(m["word_accuracy"] for m in metrics)
    lev_dist_sum = sum(m["levenshtein_distance"] for m in metrics)
    count = len(metrics)

    avg_char_acc = char_acc_sum / count if count else 0
    avg_word_acc = word_acc_sum / count if count else 0
    avg_lev_dist = lev_dist_sum / count if count else 0

    return {
        "average_character_accuracy": avg_char_acc,
        "average_word_accuracy": avg_word_acc,
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
    file_relative_path_ground_truth = "../../tests/assets/ground_truth.json"
    file_relative_path_ocr = "../../tests/assets/extracted_elements.json"
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
