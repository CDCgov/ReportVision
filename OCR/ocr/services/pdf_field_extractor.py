import json
import random
import pypdf
import os
from pdf2image import convert_from_bytes
from PIL import Image, ImageDraw
import fitz


class PDFFieldExtractor:
    def __init__(self, file_path):
        self.file_path = file_path
        self.reader = None
        self.form_fields = []

    def initialize_reader(self, base_path=None):
        if base_path is None:
            base_path = os.path.dirname(__file__)
        full_path = os.path.join(base_path, self.file_path)
        self.reader = pypdf.PdfReader(full_path)

    def close_reader(self):
        if self.reader is not None:
            self.reader.stream.close()  # Close the stream explicitly
            self.reader = None

    def segment_fields(self, field_names):
        # Iterate through each page in the PDF
        if self.reader is None:
            raise ValueError("PDF reader is not initialized. Call initialize_reader() first.")
        for page in self.reader.pages:
            # Check if there are annotations (textboxes are considered annotations)
            if "/Annots" in page:
                annotations = page["/Annots"]
                for annot in annotations:
                    if isinstance(annot, pypdf.generic.IndirectObject):
                        annot = annot.get_object()
                        field = annot.get("/T")
                        rect = annot.get("/Rect")
                        if field and rect:
                            field_str = str(field)
                            self.form_fields.append((field_str, rect))

    def extract_images(self):
        # extracts the images from the rectangle coordinates
        doc = fitz.open(self.file_path)
        page = doc[0]
        page_rect = page.mediabox

        for field_name, rect in self.form_fields:
            left, bottom, right, top = [int(coord) for coord in rect]
            top = page_rect[3] - top
            bottom = page_rect[3] - bottom

            # Render the page and crop the image
            pix = page.get_pixmap(clip=fitz.Rect(left, top, right, bottom), dpi=300)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            img.save(f'extracted_{field_name.replace("/", "_")}.png')
            break

    def pdf_to_images(self):
        # converts the pdf to a png image
        if self.reader is None:
            raise ValueError("PDF reader is not initialized. Call initialize_reader() first.")

        # Define the path to save images
        output_folder = os.getcwd()
        os.makedirs(output_folder, exist_ok=True)

        # Convert each page to an image
        images = convert_from_bytes(self.reader.stream.getvalue(), dpi=300)  # High DPI for better quality
        image_paths = []

        # Save each image
        for i, image in enumerate(images):
            image_path = os.path.join(output_folder, f"page_{i+1}.png")
            image.save(image_path, "PNG")
            image_paths.append(image_path)

        return image_paths

    # Adds annotoations to the image
    def mark_annotations_on_image(self, image_paths, dpi=300):
        if not self.form_fields:
            raise ValueError("No form fields segmented. Call segment_fields() first.")

        labels = {}
        for image_path in image_paths:
            image = Image.open(image_path)
            draw = ImageDraw.Draw(image)

            # Get dimensions of the image for scaling
            width, height = image.size

            for field_name, rect in self.form_fields:
                scaling_factor = dpi / 72.0

                # Adjust the rectangle coordinates
                # PDF y-coordinate starts from the bottom
                # rect is expected to be in the format [x1, y1, x2, y2] where (x1, y1) is bottom left and (x2, y2) is top right in PDF coordinates
                adjusted_rect = [
                    rect[0] * scaling_factor,
                    height - rect[3] * scaling_factor,  # invert y1
                    rect[2] * scaling_factor,
                    height - rect[1] * scaling_factor,  # invert y2
                ]

                color = tuple([random.randint(0, 255) for _ in range(3)])
                draw.rectangle(adjusted_rect, outline=color)
                color_str = f"{color[0]},{color[1]},{color[2]}"
                labels[color_str] = field_name

            image.save(image_path)

        with open("labels.json", "w") as json_file:
            json.dump(labels, json_file)

        return image_paths, "labels.json"

    # different method for added the segments
    def mark_rectangles_on_pdf(self):
        if self.reader is None:
            raise ValueError("PDF reader is not initialized. Call initialize_reader() first.")

        output = pypdf.PdfWriter()  # write file

        for page in self.reader.pages:
            # Access existing annotations or create a new list if none exist
            annotations = page.get("/Annots", pypdf.generic.ArrayObject())

            for annot in annotations:
                if isinstance(annot, pypdf.generic.IndirectObject):
                    annot = annot.get_object()
                field = annot.get("/T")
                rect = annot.get("/Rect")
                if field and rect:
                    # Generate a random RGB color, normalized for PDF usage
                    r, g, b = [random.random() for _ in range(3)]

                    # Create a new annotation object to represent the rectangle
                    new_annot = pypdf.generic.DictionaryObject()
                    new_annot.update(
                        {
                            pypdf.generic.NameObject("/Type"): pypdf.generic.NameObject("/Annot"),
                            pypdf.generic.NameObject("/Subtype"): pypdf.generic.NameObject("/Square"),
                            pypdf.generic.NameObject("/Rect"): rect,
                            pypdf.generic.NameObject("/C"): pypdf.generic.ArrayObject(
                                [
                                    pypdf.generic.FloatObject(r),
                                    pypdf.generic.FloatObject(g),
                                    pypdf.generic.FloatObject(b),
                                ]
                            ),
                            pypdf.generic.NameObject("/F"): pypdf.generic.NumberObject(
                                4
                            ),  # Flag to make annotation visible
                        }
                    )

                    annotations.append(new_annot)  # Add the new annotation to the list

            # Set updated annotations back to the page
            page[pypdf.generic.NameObject("/Annots")] = annotations
            output.add_page(page)  # Add the modified page to the output PDF

        # Save the modified PDF
        output_path = os.path.splitext(self.file_path)[0] + "_marked.pdf"
        with open(output_path, "wb") as output_stream:
            output.write(output_stream)
        color_label_map = None
        labels_path = os.path.splitext(self.file_path)[0] + "_labels.json"
        with open(labels_path, "w") as json_file:
            json.dump(color_label_map, json_file, indent=4)

        return output_path
