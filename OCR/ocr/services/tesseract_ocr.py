import pathlib
import os

import tesserocr
import numpy as np
from PIL import Image


class TesseractOCR:
    @staticmethod
    def _guess_tessdata_path():
        candidate_paths = [
                "/usr/local/share/tesseract/",      # Default local install
                "/usr/share/tesseract/",            # Red Hat
                "/usr/share/tesseract-ocr/4.00",    # Ubuntu
                "/opt/homebrew/share",              # macOS (Homebrew)
                "/opt/local/share"                  # macOS (MacPorts)
                ]

        if "TESSDATA_PREFIX" in os.environ:
            return os.environ["TESSDATA_PREFIX"]

        for path in candidate_paths:
            tessdata = pathlib.Path(path) / "tessdata"
            if tessdata.exists():
                return bytes(tessdata)

        return None

    def image_to_text(self, segments: dict[str, np.ndarray]) -> dict[str, tuple[str, float]]:
        digitized: dict[str, tuple[str, float]] = {}
        with tesserocr.PyTessBaseAPI(path=self._guess_tessdata_path()) as api:
            for label, image in segments.items():
                if image is None:
                    continue

                api.SetImage(Image.fromarray(image))
                digitized[label] = (api.GetUTF8Text(), api.MeanTextConf())

        return digitized
