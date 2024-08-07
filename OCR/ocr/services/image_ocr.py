from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import torch
import numpy as np


class ImageOCR:
    def __init__(self, model="microsoft/trocr-large-printed"):
        self.processor = TrOCRProcessor.from_pretrained(model)
        self.model = VisionEncoderDecoderModel.from_pretrained(model)

    def image_to_text(self, segments: dict[str, np.ndarray]) -> dict[str, tuple[str, float]]:
        digitized: dict[str, tuple[str, float]] = {}
        for label, image in segments.items():
            if image is None:
                continue

            pixel_values = self.processor(images=image, return_tensors="pt").pixel_values

            with torch.no_grad():
                outputs = self.model.generate(pixel_values, output_scores=True, return_dict_in_generate=True)

            generated_text = self.processor.batch_decode(outputs.sequences, skip_special_tokens=True)[0]

            # Calculate confidence score
            confidence = self.calculate_confidence(outputs)

            digitized[label] = (generated_text, confidence)

        return digitized

    def calculate_confidence(self, outputs):
        probs = torch.softmax(outputs.scores[0], dim=-1)
        max_probs = torch.max(probs, dim=-1).values

        # Calculate the average confidence
        avg_confidence = torch.mean(max_probs).item()

        # Convert to percentage
        confidence_percentage = avg_confidence * 100

        return confidence_percentage
