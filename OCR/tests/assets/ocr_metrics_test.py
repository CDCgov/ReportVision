from ocr.services.metrics_analysis import OCRMetrics
import pytest


@pytest.fixture
def ocr_metrics():
    ocr_data = [{"key": "Name", "value": "John Doe"}, {"key": "Date of Birth", "value": "1990-01-01"}]
    ground_truth_data = [
        {"key": "Name", "value": "John Doe"},
        {"key": "Date of Birth", "value": "1990-01-01"},
    ]
    return OCRMetrics(ocr_json=ocr_data, ground_truth_json=ground_truth_data, testMode=True)


def test_calculate_metrics(ocr_metrics):
    metrics = ocr_metrics.calculate_metrics()
    assert metrics[0]["key"] == "name"
    assert metrics[0]["ocr_text"] == "john doe"
    assert metrics[0]["ground_truth"] == "john doe"
    assert metrics[0]["raw_distance"] == 0
    assert metrics[0]["levenshtein_distance"] == 0


def test_total_metrics(ocr_metrics):
    metrics = [
        {
            "key": "name",
            "ocr_text": "john doe",
            "ground_truth": "john doe",
            "raw_distance": 0,
            "hamming_distance": 0,
            "levenshtein_distance": 0,
        },
        {
            "key": "date of birth",
            "ocr_text": "1990-01-01",
            "ground_truth": "1990-01-01",
            "raw_distance": 0,
            "hamming_distance": 0,
            "levenshtein_distance": 0,
        },
    ]
    totals = ocr_metrics.total_metrics(metrics)
    assert totals["total_raw_distance"] == 0
    assert totals["total_hamming_distance"] == 0
    assert totals["total_levenshtein_distance"] == 0
    assert totals["levenshtein_accuracy"] == "100.00%"
