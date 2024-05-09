from .builder import PHDCBuilder
from .models import PHDCInputData, Patient, Name, Address, Telecom


class OCRPHDCConverter:
    """
    Parse the OCR data to create an instance of the Patient data class.
    """

    def parse_ocr_to_patient_data(self, ocr_data):
        name = Name(first=ocr_data.get("patient_first_name", ""), family=ocr_data.get("patient_last_name", ""))

        address = Address(
            street_address_line_1=ocr_data.get("patient_address", ""),
            city=ocr_data.get("patient_city", ""),
            postal_code=ocr_data.get("patient_zip", ""),
            county=ocr_data.get("patient_country", ""),
            state=ocr_data.get("patient_region", ""),
            country="USA",
        )

        telecom = Telecom(value=ocr_data.get("patient_phone", ""), type="HP")

        patient = Patient(
            name=[name],
            address=[address],
            telecom=[telecom],
            birth_time=ocr_data.get("patient_dob", "").replace("/", ""),
        )

        return patient

    def generate_phdc_document(self, ocr_data):
        """
        Generate the PHDC document using parsed OCR data.
        """
        patient = self.parse_ocr_to_patient_data(ocr_data)

        phdc_input = PHDCInputData(patient=patient, type="case_report")

        builder = PHDCBuilder()
        builder.set_input_data(phdc_input)
        phdc = builder.build()

        # Output PHDC XML
        phdc_xml = phdc.to_xml_string()
        return phdc_xml
