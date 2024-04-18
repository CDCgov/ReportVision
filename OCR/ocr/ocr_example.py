import PyPDF2
import fitz
from PIL import Image
import os

path = os.path.dirname(__file__)


file_path = os.path.join(
        path, "../tests/assets/form_filled_example.pdf")

def segment_fields(file_path,field_names):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)
        form_fields = []

        # Iterate through each page in the PDF
        for page in reader.pages:
            # Check if there are annotations on the page (the textboxes are considered the annotations)
            if '/Annots' in page:
                annotations = page['/Annots']
                for annot in annotations:
                    if isinstance(annot, PyPDF2.generic.IndirectObject):
                        annot = annot.get_object()
                        # Resolve the IndirectObject issue indirect objects are not annotations
                        field = annot.get('/T')  # Pulls the field_name
                        rect = annot.get('/Rect')  # Pulls the rectangle coordinates of the field names
                        if field and rect:
                            # Convert field to string and collect rectangle coordinates
                            form_fields.append((str(field), rect))

        # Open the PDF using PyMuPDF (fitz)
        doc = fitz.open(file_path)
        page = doc[0]
        page_rect = page.mediabox

        
        
        # Iterate through the form fields and extract the images
        for field_name, rect in form_fields:
            if field_name in field_names:
                print(field_name)
                print(rect)
                # Convert the PDF coordinates to image coordinates
                left, bottom, right, top = [int(coord) for coord in rect]
                top = page_rect[3] - top
                bottom = page_rect[3] - bottom

                # Render the page and crop the image
                pix = page.get_pixmap(clip=fitz.Rect(left, top, right, bottom), dpi=300)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                img.save(f'extracted_{field_name.replace("/", "_")}.png')
                break  # Exit the loop after processing the specific fields


fields_to_extract = ["Region", "Address"]
segment_fields(file_path, fields_to_extract)