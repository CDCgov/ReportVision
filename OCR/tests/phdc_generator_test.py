import unittest
import json
from ocr.services.phdc_converter.ocr_phdc_converter import OCRPHDCConverter
import os


path = os.path.dirname(__file__)


class TestPHDCGenerator(unittest.TestCase):
    def setUp(self):
        ocr_path = os.path.join(path, "./assets/ocr_values.json")

        with open(ocr_path, "r") as f:
            self.ocr_data = json.load(f)

        self.generator = OCRPHDCConverter()

    def test_generate_phdc_document(self):
        phdc_xml = self.generator.generate_phdc_document(self.ocr_data)

        self.assertTrue(phdc_xml)

        self.assertIn("<family>SMITH</family>", phdc_xml)
        self.assertIn("<city>SAN RAMON</city>", phdc_xml)
        self.assertIn("<postalCode>94583</postalCode>", phdc_xml)
        self.assertIn("<county>CONTRA COSTA</county>", phdc_xml)
        self.assertIn("<state>NCAL</state>", phdc_xml)
