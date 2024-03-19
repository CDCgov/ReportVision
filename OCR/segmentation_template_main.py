
from dotenv import load_dotenv
import os
import json
import cv2 as cv

from services.image_segmenter import ImageSegmenter

load_dotenv()

segmentation_template = os.getenv('SEGMENTATION_TEMPLATE_PATH')
raw_image = os.getenv('RAW_IMAGE_PATH')
labels_path = os.getenv('LABELS_PATH')



segmenter = ImageSegmenter(raw_image, segmentation_template,labels_path)
segments = segmenter.segment()

segment_info = {label: segment_data.shape for label, segment_data in segments.items()}



nbs_patient_id_image_path = 'nbs_patient_id_image_path.png'
nbs_cas_id_image_path = 'nbs_cas_id_image_path.png'

# Save the images
cv.imwrite(nbs_patient_id_image_path , segments['nbs_patient_id'])
cv.imwrite(nbs_cas_id_image_path, segments['nbs_cas_id'])