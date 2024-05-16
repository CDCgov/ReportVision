from PIL import Image

# Load the image containing the 9 checkboxes
img_path = "/Users/arindamkulshi/IDWA/IDWA/OCR/ocr/services/1.png"
img = Image.open(img_path)

# Define the dimensions for splitting
# Assuming there are 3x3 grid of images
img_width, img_height = img.size
single_width = img_width // 3
single_height = img_height // 3

# Create a list to hold the images
images = []

# Split the image
for i in range(3):
    for j in range(3):
        left = j * single_width
        upper = i * single_height
        right = left + single_width
        lower = upper + single_height
        # Crop the image and append to the list
        images.append(img.crop((left, upper, right, lower)))

# Save the cropped images
output_paths = []
for index, image in enumerate(images):
    output_file = f"{index + 1}.png"
    image.save(output_file)
    output_paths.append(output_file)

output_paths
