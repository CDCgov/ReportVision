import tesserocr

import numpy as np


class TesseractOCR:
    def image_to_text(self, segments: dict[str, np.ndarray]) -> dict[str, tuple[str, float]]:
        digitized: dict[str, tuple[str, float]] = {}
        with tesserocr.PyTessBaseAPI() as api:
            for label, image in segments.items():
                if image is None:
                    continue

                api.SetImage(image)
                digitized[label] = (api.GetUTF8Text(), api.MeanTextConf())

        return digitized