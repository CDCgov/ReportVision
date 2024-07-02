from .builder import PHDCBuilder
from .models import PHDCInputData, Patient, Name, Address, Telecom


class PHDCConverter:
    """
    Parse the OCR data converted to json to create an instance of the Patient data class.
    """

    def parse_patient_data(self, json_data):
        name = Name(first=json_data.get("patient_first_name", ""), family=json_data.get("patient_last_name", ""))

        address = Address(
            street_address_line_1=json_data.get("patient_address", ""),
            city=json_data.get("patient_city", ""),
            postal_code=json_data.get("patient_zip", ""),
            county=json_data.get("patient_country", ""),
            state=json_data.get("patient_region", ""),
            country="USA",
        )

        telecom = Telecom(value=json_data.get("patient_phone", ""), type="HP")

        patient = Patient(
            name=[name],
            address=[address],
            telecom=[telecom],
            birth_time=json_data.get("patient_dob", "").replace("/", ""),
        )

        return patient

    def generate_phdc_document(self, json_data):
        """
        Generate the PHDC document using parsed OCR data.
        """
        patient = self.parse_patient_data(json_data)

        phdc_input = PHDCInputData(patient=patient, type="case_report")

        builder = PHDCBuilder()
        builder.set_input_data(phdc_input)
        phdc = builder.build()

        # Output PHDC XML
        phdc_xml = phdc.to_xml_string()
        return phdc_xml
