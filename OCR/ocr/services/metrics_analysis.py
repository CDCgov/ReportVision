import json
from difflib import SequenceMatcher


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
    return correct_chars / len(ground_truth) * 100


def word_accuracy(ocr_text, ground_truth):
    ocr_words = ocr_text.split()
    ground_truth_words = ground_truth.split()
    correct_words = sum(1 for o, g in zip(ocr_words, ground_truth_words) if o == g)
    return correct_words / len(ground_truth_words) * 100


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
            {"key": key, "character_accuracy": char_acc, "word_accuracy": word_acc, "levenshtein_distance": lev_dist}
        )
    return metrics


ground_truth_json = ""
ocr_json = ""

with open(ground_truth_json, "r") as json_file:
    ground_truth_json = json.load(json_file)

with open(ocr_json, "r") as json_file:
    ocr_json = json.load(json_file)

print(type(ground_truth_json))  # Should be a list
print(type(ocr_json))

metrics = calculate_metrics(ocr_json, ground_truth_json)

for m in metrics:
    print(m)
