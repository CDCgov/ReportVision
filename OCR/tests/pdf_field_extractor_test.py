import pytest
from ocr.services.pdf_field_extractor import PDFFieldExtractor
import os
import pypdf


@pytest.fixture
def pdf_extractor():
    current_script_dir = os.path.dirname(os.path.abspath(__file__))
    file_relative_path = "./assets/per_example.pdf"
    file_absolute_path = os.path.join(current_script_dir, file_relative_path)
    extractor = PDFFieldExtractor(file_absolute_path)
    extractor.initialize_reader()
    yield extractor
    extractor.close_reader()


def test_initialize_reader(pdf_extractor):
    assert pdf_extractor.reader is not None, "The PDF reader should be initialized."


def test_close_reader(pdf_extractor):
    pdf_extractor.close_reader()
    assert pdf_extractor.reader is None, "The PDF reader should be closed."


def test_generate_random_color(pdf_extractor):
    color = pdf_extractor.generate_random_color()
    assert isinstance(color, str), "Output should be a string"
    parts = color.split(",")
    assert len(parts) == 3, "Color should have three parts"
    all(int(part) >= 0 and int(part) <= 255 for part in parts), "All RGB values should be within 0-255"


def test_create_rectangle_annotation(pdf_extractor):
    rect = [0, 0, 100, 100]
    color = "255,0,0"
    annotation = pdf_extractor.create_rectangle_annotation(rect, color)
    assert isinstance(annotation, pypdf.generic.DictionaryObject), "Should return a DictionaryObject"
    assert list(map(float, annotation["/C"])) == [1.0, 0.0, 0.0], "Color should be correctly set"


def test_mark_rectangles_on_pdf(pdf_extractor, mocker):
    mocker.patch.object(pdf_extractor, "update_annotations_and_save", return_value=("path_to_pdf", "path_to_labels"))
    output, labels = pdf_extractor.mark_rectangles_on_pdf()
    assert output == "path_to_pdf", "Should return the correct path to the modified PDF"
    assert labels == "path_to_labels", "Should return the correct path to the labels JSON"
