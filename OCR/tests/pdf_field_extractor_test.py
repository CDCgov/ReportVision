from math import isclose
import pytest
from OCR.ocr.services.pdf_field_extractor import PDFFieldExtractor
import os


# Setup a fixture for the PDF extractor
@pytest.fixture
def pdf_extractor():
    current_script_dir = os.path.dirname(os.path.abspath(__file__))
    file_relative_path = "./assets/fillable.pdf"
    file_absolute_path = os.path.join(current_script_dir, file_relative_path)
    extractor = PDFFieldExtractor(file_absolute_path)
    extractor.initialize_reader()
    yield extractor
    extractor.close_reader()


def test_initialize_reader(pdf_extractor):
    # Check if the reader is initialized
    assert pdf_extractor.reader is not None, "The PDF reader should be initialized."


def test_close_reader(pdf_extractor):
    # Close the reader and check if it's closed properly
    pdf_extractor.close_reader()
    assert pdf_extractor.reader is None, "The PDF reader should be closed."


def test_segment_fields(pdf_extractor):
    # Test segmenting the "Address" field
    field_names = ["Address"]
    pdf_extractor.segment_fields(field_names)

    # Expected coordinates for the "Address" field
    expected_address_rect = [80.08, 611.28, 339.76, 624.151]

    # Find the "Address" field in the form_fields list
    address_field = None
    for field_name, rect in pdf_extractor.form_fields:
        if field_name == "Address":
            address_field = rect
            print(address_field)
            break

    # Check if the "Address" field is found and its coordinates match the expected values
    assert address_field is not None, "The 'Address' field should be found."
    assert all(isclose(a, b) for a, b in zip(expected_address_rect, address_field))
