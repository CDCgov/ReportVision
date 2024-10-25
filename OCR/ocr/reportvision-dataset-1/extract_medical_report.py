import json
from pathlib import Path

# Define the core keys you want to extract
CORE_KEYS = [
    "name",
    "medical record number",
    "age",
    "dob",
    "gender",
    "address",
    "city",
    "state",
    "country",
    "postalcode",
    "maritalStatus",
]


def extract_core_elements(data):
    """
    Extract the key-value pairs from the input JSON data.
    """
    return {key: data.get(key) for key in CORE_KEYS if key in data}


def process_folder(input_folder, output_folder):
    """
    Processes all JSON files in the input folder and extracts core elements.
    Saves the extracted data to a new folder.
    """
    input_path = Path(input_folder)
    output_path = Path(output_folder)

    output_path.mkdir(parents=True, exist_ok=True)

    for json_file in input_path.glob("*.json"):
        with open(json_file, "r") as f:
            data = json.load(f)

        # Extract core elements
        extracted_data = extract_core_elements(data)

        # Save to JSON file
        output_file = output_path / json_file.name
        with open(output_file, "w") as f:
            json.dump(extracted_data, f, indent=4)

    print(f"Extraction complete. Files saved to: {output_folder}")


input_folder = input("Enter the path to the input folder: ")
output_folder = input("Enter the path to the output folder: ")

process_folder(input_folder, output_folder)
