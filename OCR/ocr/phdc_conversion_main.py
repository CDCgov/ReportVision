from services.phdc_converter.ocr_phdc_converter import OCRPHDCConverter
import os
import json


path = os.path.dirname(__file__)


def main():
    ocr_file = os.path.join(path, "../tests/assets/ocr_values.json")
    with open(ocr_file, "r") as f:
        ocr_data = json.load(f)

    generator = OCRPHDCConverter()
    phdc_xml = generator.generate_phdc_document(ocr_data)

    with open("phdc_document.xml", "w") as file:
        file.write(phdc_xml)


if __name__ == "__main__":
    main()
