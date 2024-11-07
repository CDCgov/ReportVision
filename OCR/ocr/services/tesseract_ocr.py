import tesserocr

import numpy as np


class TesseractOCR:
    def image_to_text(self, segments: dict[str, np.ndarray]) -> dict[str, tuple[str, float]]:
        digitized: dict[str, tuple[str, float]] = {}
        for label, image in segments.items():
            if image is None:
                continue

            # TODO: expose confidence score
            digitized[label] = (tesserocr.image_to_text(image), 0)

        return digitized
