import pathlib
import os

import tesserocr
import numpy as np
from PIL import Image


class TesseractOCR:
    @staticmethod
    def _guess_tessdata_path():
        """
        Attempts to guess potential locations for the `tessdata` folder.

        The `tessdata` folder is needed to use pre-trained Tesseract OCR data, though the automatic detection
        provided in `tesserocr` may not be reliable. Instead iterate over common paths on various systems (e.g.,
        Red Hat, Ubuntu, macOS) and check for the presence of a `tessdata` folder.

        If `TESSDATA_PREFIX` is available in the environment, preferentially use that instead, skipping the
        guessing step. If all guessed locations lack a `tessdata` folder, fall back to automatic detection
        provided by `tesserocr` and the tesseract API.
        """
        candidate_paths = [
            "/usr/local/share/tesseract/",
            "/usr/share/tesseract/",
            "/usr/share/tesseract-ocr/4.00",
            "/opt/homebrew/share",
            "/opt/local/share",
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
