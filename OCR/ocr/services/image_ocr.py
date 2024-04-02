import numpy as np
from transformers import TrOCRProcessor, VisionEncoderDecoderModel


class ImageOCR:

    def __init__(self):
        self.processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-printed")
        self.model = VisionEncoderDecoderModel.from_pretrained(
            "microsoft/trocr-base-printed"
        )

    def image_to_text(self, segments: dict[str, np.ndarray]) -> dict[str, str]:
        digitized: dict[str, str] = {}
        for label, image in segments.items():

            pixel_values = self.processor(
                images=image, return_tensors="pt", warnings=False
            ).pixel_values

            generated_ids = self.model.generate(pixel_values)
            generated_text = self.processor.batch_decode(
                generated_ids, skip_special_tokens=True, warnings=False
            )
            digitized[label] = generated_text[0]

        return digitized
