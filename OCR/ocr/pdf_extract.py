import subprocess
import PyPDF2
import os
from pdf2image import convert_from_path
from PIL import Image
import io


path = os.path.dirname(__file__)


file_path = os.path.join(
        path, "../tests/assets/form_filled_example.pdf")



with open(file_path, 'rb') as file:
    reader = PyPDF2.PdfReader(file)
    num_pages = len(reader.pages)
    form_fields = []
    # Iterate through each page in the PDF
    for page in reader.pages:
        # Check if there are annotations on the page in this case the textboxes are the annotations
        if '/Annots' in page:
            annotations = page['/Annots']
            for annot in annotations:
                if isinstance(annot, PyPDF2.generic.IndirectObject):
                    annot = annot.get_object()  # Resolve the IndirectObject
                field = annot.get('/T') #Pulls the field_name
                rect = annot.get('/Rect') #pulls the rectangle coordinates of the field names 
                if field and rect:
                    # Convert field to string and collect rectangle coordinates
                    form_fields.append((str(field), rect))
    
    
print(num_pages, form_fields[:10])




        