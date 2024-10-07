import os
import json
from datasets import load_dataset
import random


destination_folder = "reportvision-dataset-1"

dataset = load_dataset("singhsays/fake-w2-us-tax-form-dataset")


if not os.path.exists(destination_folder):
    os.makedirs(destination_folder)

images_folder = os.path.join(destination_folder, "images")
json_folder = os.path.join(destination_folder, "ground_truth")

os.makedirs(images_folder, exist_ok=True)
os.makedirs(json_folder, exist_ok=True)

generated_numbers = set()


def generate_unique_random_number():
    while True:
        random_number = random.randint(100000, 999999)  # Generates a random unique 6-digit number
        if random_number not in generated_numbers:
            generated_numbers.add(random_number)
            return random_number


for split in dataset.keys():
    split_data = dataset[split]
    for example in split_data:
        unique_id = generate_unique_random_number()
        image = example["image"]
        image_filename = f"report_{unique_id}.png"
        image_path = os.path.join(images_folder, image_filename)

        image.save(image_path)

        # example["json"]
        ground_truth_data = json.loads(example["ground_truth"])["gt_parse"]

        # Save the corresponding ground truth (JSON)
        json_filename = f"report_{unique_id}.json"
        json_path = os.path.join(json_folder, json_filename)

        json_filename = f"report_{unique_id}.json"
        json_path = os.path.join(json_folder, json_filename)

        with open(json_path, "w") as f:
            json.dump(ground_truth_data, f, indent=4)

        print(f"Saved {image_filename} and {json_filename}")

print(f"Dataset has been successfully saved to {destination_folder}")
