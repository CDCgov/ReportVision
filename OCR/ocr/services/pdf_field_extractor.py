import PyPDF2
import fitz  # PyMuPDF
from PIL import Image
import os

class PDFFieldExtractor:
    def __init__(self, file_path):
        self.file_path = file_path
        self.form_fields = []
    

    def initialize_reader(self):
        path = os.path.dirname(__file__)
        full_path = os.path.join(path, self.file_path)
        with open(full_path, 'rb') as file:
            self.reader = PyPDF2.PdfReader(file)

    def segment_fields(self, field_names):
        with open(self.file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            # Iterate through each page in the PDF
            for page in reader.pages:
                # Check if there are annotations (textboxes are considered annotations)
                if '/Annots' in page:
                    annotations = page['/Annots']
                    for annot in annotations:
                        if isinstance(annot, PyPDF2.generic.IndirectObject):
                            annot = annot.get_object()
                            field = annot.get('/T')
                            rect = annot.get('/Rect')
                            if field and rect:
                                field_str = str(field)
                                if field_str in field_names:
                                    self.form_fields.append((field_str, rect))

    def extract_images(self):
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


file_relative_path = "../tests/assets/form_filled_example.pdf"
extractor = PDFFieldExtractor(file_relative_path)
extractor.segment_fields(["Region", "Address"])
extractor.extract_images()