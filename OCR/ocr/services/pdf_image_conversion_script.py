import os
from pdf2image import convert_from_path


def pdf_to_images(path):
    # Define the path to save images
    output_folder = os.getcwd()
    os.makedirs(output_folder, exist_ok=True)

    # Convert each page to an image using the pdf2image library
    image_paths = []
    images = convert_from_path(path, dpi=300)  # High DPI for better quality

    # Save each image to the defined path
    for i, image in enumerate(images):
        image_path = os.path.join(output_folder, f"page_{i+1}.png")
        image.save(image_path, "PNG")
        image_paths.append(image_path)

    return image_paths


pdf_to_images("/Users/arindamkulshi/IDWA/IDWA/OCR/tests/assets/fillable_marked.pdf")
