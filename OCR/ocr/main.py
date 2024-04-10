import os
import csv

from services.image_segmenter import ImageSegmenter
from services.image_ocr import ImageOCR

path = os.path.dirname(__file__)


def main():

    segmentation_template = os.path.join(
        path, "../tests/assets/form_segmentation_template_hep_box.png"
    )
    raw_image = os.path.join(path, "../tests/assets/form_filled_hep.jpg")
    labels_path = os.path.join(path, "../tests/assets/labels_hep_box.json")

    segmenter = ImageSegmenter(raw_image, segmentation_template, labels_path)
    segments = segmenter.segment()

    print("{:<20} {:<30}".format("Label", "Segment"))

    for label, segment in segments.items():
        print(f"{label}: Segment shape {segment.shape if segment is not None else 'Not found'}")




    ''' print("{:<20} {:<20}".format("Label", "Segment shape"))
    for label, segment in segments.items():
        print("{:<20} {:<20}".format(label, f"{segment.shape}"))

    

    ocr = ImageOCR()
    values = ocr.image_to_text(segments=segments)

    print("{:<20} {:<20}".format("Label", "Text"))
    for label, text in values.items():
        print("{:<20} {:<20}".format(label, text))'''


if __name__ == "__main__":
    main()
