from services.phdc_converter.phdc_converter import PHDCConverter
import os
import json


path = os.path.dirname(__file__)


def main():
    json_file = os.path.join(path, "../tests/assets/ocr_values.json")
    with open(json_file, "r") as f:
        json_data = json.load(f)

    generator = PHDCConverter()
    phdc_xml = generator.generate_phdc_document(json_data)

    with open("phdc_document.xml", "w") as file:
        file.write(phdc_xml)


if __name__ == "__main__":
    main()
