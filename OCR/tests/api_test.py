import os
import json

from fastapi.testclient import TestClient

from ocr.api import app

client = TestClient(app)

path = os.path.dirname(__file__)

segmentation_template_path = os.path.join(path, "./assets/form_segmention_template.png")
source_image_path = os.path.join(path, "./assets/form_filled.png")
labels_path = os.path.join(path, "./assets/labels.json")


class TestAPI:

    def test_hello_world(self):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Hello World"}

    def test_ocr(self):
        # load the files
        with (
            open(segmentation_template_path, "rb") as segmentation_template_file,
            open(source_image_path, "rb") as source_image_file,
            open(labels_path, "rb") as labels
        ):
            label_data = json.load(labels)

            files_to_send = [
                ("source_image", source_image_file),
                ("segmentation_template", segmentation_template_file)
            ]

            # call ocr api
            response = client.post(
                url="/image_to_text",
                files=files_to_send,
                data={"labels": json.dumps(label_data)}
            )

            assert response.status_code == 200

            # assert output
            response_json = response.json()
            assert response_json['nbs_patient_id'][0] == 'SIENNA HAMPTON'
            assert response_json['nbs_cas_id'][0] == '123555'

