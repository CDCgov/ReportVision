import os
import json
from datasets import load_dataset

# Define the destination folder
destination_base_folder = "OCR/ocr/reportvision-dataset-1"
datasets_info = [
    {"name": "singhsays/fake-w2-us-tax-form-dataset", "json_key": "ground_truth"},
    {"name": "AnubhutiBhardwaj/medical-reports-demo", "json_key": "json"},
    {"name": "Technoculture/medical-prescriptions", "json_key": "json"},
]


images_folder = os.path.join(destination_base_folder, "images")
json_folder = os.path.join(destination_base_folder, "ground_truth")

os.makedirs(images_folder, exist_ok=True)
os.makedirs(json_folder, exist_ok=True)


def process_dataset(dataset_name, json_key):
    print(f"Processing dataset: {dataset_name}")
    dataset = load_dataset(dataset_name)

    for split in dataset.keys():
        split_data = dataset[split]
        for idx, example in enumerate(split_data):
            unique_id = f"{split}_{idx}"

            # Save image
            image = example["image"]
            image_filename = f"report_{unique_id}.png"
            image_path = os.path.join(images_folder, image_filename)

            image.save(image_path)

            # Parse the ground truth JSON data
            if json_key == "json":
                ground_truth_data = json.loads(example[json_key])
            elif json_key == "ground_truth":
                ground_truth_data = json.loads(example[json_key])["gt_parse"]

            json_filename = f"report_{unique_id}.json"
            json_path = os.path.join(json_folder, json_filename)

            with open(json_path, "w") as f:
                json.dump(ground_truth_data, f, indent=4)

            print(f"Saved {image_filename} and {json_filename}")

    print(f"Finished processing dataset: {dataset_name}")


# Process all datasets
for dataset_info in datasets_info:
    process_dataset(dataset_info["name"], dataset_info["json_key"])

print(f"All datasets have been successfully saved to {destination_base_folder}")
