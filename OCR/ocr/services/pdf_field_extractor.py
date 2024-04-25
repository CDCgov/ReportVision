import PyPDF2
import fitz  # PyMuPDF
from PIL import Image
import os


class PDFFieldExtractor:
    def __init__(self, file_path):
        self.file_path = file_path
        self.reader = None
        self.form_fields = []

    def initialize_reader(self, base_path=None):
        if base_path is None:
            base_path = os.path.dirname(__file__)
        full_path = os.path.join(base_path, self.file_path)
        self.reader = PyPDF2.PdfReader(full_path)

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
                    if isinstance(annot, PyPDF2.generic.IndirectObject):
                        annot = annot.get_object()
                        field = annot.get("/T")
                        rect = annot.get("/Rect")
                        if field and rect:
                            field_str = str(field)
                            if field_str in field_names:
                                self.form_fields.append((field_str, rect))

    def extract_images(self):
        if self.reader is None:
            raise ValueError("PDF reader is not initialized. Call initialize_reader() first.")
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
        self.close_reader()
