import unittest
import json
from ocr.services.phdc_converter.phdc_converter import PHDCConverter
import os


path = os.path.dirname(__file__)


class TestPHDCGenerator(unittest.TestCase):
    def setUp(self):
        json_path = os.path.join(path, "./assets/ocr_values.json")

        with open(json_path, "r") as f:
            self.json_data = json.load(f)

        self.generator = PHDCConverter()

    def test_generate_phdc_document(self):
        phdc_xml = self.generator.generate_phdc_document(self.json_data)

        self.assertTrue(phdc_xml)

        self.assertIn("<family>SMITH</family>", phdc_xml)
        self.assertIn("<city>SAN RAMON</city>", phdc_xml)
        self.assertIn("<postalCode>94583</postalCode>", phdc_xml)
        self.assertIn("<county>CONTRA COSTA</county>", phdc_xml)
        self.assertIn("<state>NCAL</state>", phdc_xml)
