import base64
import os
import json
from unittest import mock
import asyncio


from fastapi.testclient import TestClient

from ocr.api import app

client = TestClient(app)

path = os.path.dirname(__file__)

segmentation_template_path = os.path.join(path, "./assets/form_segmention_template.png")
source_image_path = os.path.join(path, "./assets/form_filled.png")
labels_path = os.path.join(path, "./assets/labels.json")
invalid_dimension_path = os.path.join(path, "./assets/invalid_dimension_template.png")
invalid_image_file_path = os.path.join(path, "./assets/invalid_image_file.png")


class TestAPI:
    def test_health_check(self):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"status": "UP"}

    def test_image_file_to_text(self):
        # load the files
        with (
            open(segmentation_template_path, "rb") as segmentation_template_file,
            open(source_image_path, "rb") as source_image_file,
            open(labels_path, "rb") as labels,
        ):
            label_data = json.load(labels)

            files_to_send = [
                ("source_image", source_image_file),
                ("segmentation_template", segmentation_template_file),
            ]

            # call ocr api
            response = client.post(
                url="/image_file_to_text", files=files_to_send, data={"labels": json.dumps(label_data)}
            )

            assert response.status_code == 200

            # assert output
            response_json = response.json()
            assert response_json["nbs_patient_id"][0] == "SIENNA HAMPTON"
            assert response_json["nbs_cas_id"][0] == "123555"

    def test_image_to_text(self):
        # load the files
        with (
            open(segmentation_template_path, "rb") as segmentation_template_file,
            open(source_image_path, "rb") as source_image_file,
            open(labels_path, "rb") as labels,
        ):
            label_data = json.load(labels)

            source_image_base64 = base64.b64encode(source_image_file.read()).decode("ascii")
            segmentation_template_base64 = base64.b64encode(segmentation_template_file.read()).decode("ascii")

            response = client.post(
                url="/image_to_text",
                data={
                    "labels": json.dumps(label_data),
                    "source_image": str(source_image_base64),
                    "segmentation_template": str(segmentation_template_base64),
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )

            assert response.status_code == 200

            # assert output
            response_json = response.json()
            assert response_json["nbs_patient_id"][0] == "SIENNA HAMPTON"
            assert response_json["nbs_cas_id"][0] == "123555"

    def test_image_to_text_with_padding(self):
        # load the files
        with (
            open(segmentation_template_path, "rb") as segmentation_template_file,
            open(source_image_path, "rb") as source_image_file,
            open(labels_path, "rb") as labels,
        ):
            label_data = json.load(labels)

            source_image_base64 = base64.b64encode(source_image_file.read()).decode("ascii")
            segmentation_template_base64 = base64.b64encode(segmentation_template_file.read()).decode("ascii")

            response = client.post(
                url="/image_to_text",
                data={
                    "labels": json.dumps(label_data),
                    "source_image": f"data:image/png;base64,{str(source_image_base64)}",
                    "segmentation_template": f"data:image/png;base64,{str(segmentation_template_base64)}",
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )

            assert response.status_code == 200

            # assert output
            response_json = response.json()
            assert response_json["nbs_patient_id"][0] == "SIENNA HAMPTON"
            assert response_json["nbs_cas_id"][0] == "123555"

    def test_invalid_source_image_format(self):
        with (
            open(segmentation_template_path, "rb") as segmentation_template_file,
            open(invalid_image_file_path, "rb") as source_image_file,  # using invalid image
            open(labels_path, "r") as labels,
        ):
            label_data = json.load(labels)
            files_to_send = [
                ("source_image", source_image_file),
                ("segmentation_template", segmentation_template_file),
            ]

            response = client.post(
                url="/image_file_to_text", files=files_to_send, data={"labels": json.dumps(label_data)}
            )

            assert response.status_code == 422
            response_json = response.json()
            assert (
                response_json["detail"] == "Failed to decode source image. Ensure the file is a valid image format."
            )

    def test_invalid_segmentation_template_format(self):
        with (
            open(invalid_image_file_path, "rb") as segmentation_template_file,  # using a invalid image
            open(source_image_path, "rb") as source_image_file,
            open(labels_path, "r") as labels,
        ):
            label_data = json.load(labels)
            files_to_send = [
                ("source_image", source_image_file),
                ("segmentation_template", segmentation_template_file),
            ]

            response = client.post(
                url="/image_file_to_text", files=files_to_send, data={"labels": json.dumps(label_data)}
            )

            assert response.status_code == 422
            assert (
                response.json()["detail"]
                == "Failed to decode segmentation template. Ensure the file is a valid image format."
            )

    def test_dimension_mismatch(self):
        with (
            open(source_image_path, "rb") as source_image_file,
            open(invalid_dimension_path, "rb") as invalid_dimension_file,  # using a file with separate dimensions
            open(labels_path, "r") as labels,
        ):
            label_data = json.load(labels)
            files_to_send = [
                ("source_image", source_image_file),
                ("segmentation_template", invalid_dimension_file),
            ]

            response = client.post(
                url="/image_file_to_text", files=files_to_send, data={"labels": json.dumps(label_data)}
            )

            assert response.status_code == 400
            assert (
                response.json()["detail"]
                == "Dimension mismatch between source image and segmentation template. Both images must have the same width and height."
            )

    def test_invalid_json_labels(self):
        with (
            open(source_image_path, "rb") as source_image_file,
            open(segmentation_template_path, "rb") as segmentation_template_file,
        ):
            invalid_label_data = "{invalid: json}"  # file with invalid json format
            files_to_send = [
                ("source_image", source_image_file),
                ("segmentation_template", segmentation_template_file),
            ]

            response = client.post(
                url="/image_file_to_text", files=files_to_send, data={"labels": invalid_label_data}
            )

            assert response.status_code == 422
            assert (
                response.json()["detail"]
                == "Failed to parse labels JSON. Ensure the labels are in valid JSON format."
            )

    def test_timeout_error_simulation(self):
        with (
            open(source_image_path, "rb") as source_image_file,
            open(segmentation_template_path, "rb") as segmentation_template_file,
            open(labels_path, "r") as labels,
        ):
            label_data = json.load(labels)
            files_to_send = [
                ("source_image", source_image_file),
                ("segmentation_template", segmentation_template_file),
            ]

            with mock.patch(
                "ocr.services.image_segmenter.ImageSegmenter.segment", side_effect=asyncio.TimeoutError
            ):  # mocks a invoked segment call
                response = client.post(
                    url="/image_file_to_text", files=files_to_send, data={"labels": json.dumps(label_data)}
                )

            assert response.status_code == 504
            assert response.json()["detail"] == "The request timed out. Please try again."
