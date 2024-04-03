import os

from ocr.services.image_segmenter import ImageSegmenter
from ocr.services.image_ocr import ImageOCR

path = os.path.dirname(__file__)
# commenting for a test

def main():

    segmentation_template = os.path.join(
        path, "../tests/assets/form_segmention_template.png"
    )
    raw_image = os.path.join(path, "../tests/assets/form_filled.png")
    labels_path = os.path.join(path, "../tests/assets/labels.json")

    segmenter = ImageSegmenter(raw_image, segmentation_template, labels_path)
    segments = segmenter.segment()

    print("{:<20} {:<20}".format("Label", "Segment shape"))
    for label, segment in segments.items():
        print("{:<20} {:<20}".format(label, f"{segment.shape}"))

    ocr = ImageOCR()
    values = ocr.image_to_text(segments=segments)

    print("{:<20} {:<20}".format("Label", "Text"))
    for label, text in values.items():
        print("{:<20} {:<20}".format(label, text))


if __name__ == "__main__":
    main()
