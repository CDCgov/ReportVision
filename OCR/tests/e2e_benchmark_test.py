import os
import pytest
from tests.batch_segmentation import SegmentationOCRBatch
from tests.batch_metrics import MetricsAnalysis


DESTINATION_BASE_FOLDER = ""


def get_full_path(subfolder):
    """
    Helper function to generate full paths from the base folder.
    """
    return os.path.join(DESTINATION_BASE_FOLDER, subfolder)


@pytest.fixture
def setup_paths():
    """
    Fixture to provide consistent paths for testing.
    """
    paths = {
        "image_folder": get_full_path("images_tax_forms"),
        "segmentation_template": get_full_path("tax_form_segmented.png"),
        "labels_path": get_full_path("tax_form_segmented_labels.json"),
        "output_folder": get_full_path("ocr_output_tax_forms"),
        "ground_truth_folder": get_full_path("ground_truth_test_tax"),
        "csv_output_folder": get_full_path("tax_forms_csv_metrics"),
    }

    return paths


def test_benchmark_ocr_and_metrics(setup_paths):
    """
    Test to run OCR and metrics analysis and ensure output is created as expected.
    """
    paths = setup_paths

    # Step 1: Run segmentation and OCR
    segmentation_ocr = SegmentationOCRBatch(
        paths["image_folder"], paths["segmentation_template"], paths["labels_path"], paths["output_folder"]
    )
    segmentation_ocr.process_images()

    # Step 2: Run metrics analysis and save CSVs
    metrics_analysis = MetricsAnalysis(
        paths["output_folder"], paths["ground_truth_folder"], paths["csv_output_folder"]
    )
    total_metrics_summary = metrics_analysis.calculate_batch_metrics()

    # Ensure CSV output folder is not empty
    assert os.listdir(paths["csv_output_folder"]), "CSV output folder is empty."

    # Check that total metrics summary is not empty
    assert total_metrics_summary, "Total metrics summary is empty."
