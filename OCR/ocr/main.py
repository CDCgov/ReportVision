import os
import cv2 as cv

from ocr.services.image_segmenter import ImageSegmenter

path = os.path.dirname(__file__)


def main():

    segmentation_template = os.path.join(
        path, "../tests/assets/form_segmention_template.png"
    )
    raw_image = os.path.join(path, "../tests/assets/form_filled.png")
    labels_path = os.path.join(path, "../tests/assets/labels.json")

    segmenter = ImageSegmenter(raw_image, segmentation_template, labels_path)
    segments = segmenter.segment()

    segment_info = {
        label: segment_data.shape for label, segment_data in segments.items()
    }
    print(segment_info)

    nbs_patient_id_image_path = "nbs_patient_id_image_path.png"
    nbs_cas_id_image_path = "nbs_cas_id_image_path.png"

    # Save the images
    cv.imwrite(nbs_patient_id_image_path, segments["nbs_patient_id"])
    cv.imwrite(nbs_cas_id_image_path, segments["nbs_cas_id"])


if __name__ == "__main__":
    main()
