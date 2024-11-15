import os

import tesserocr
import numpy as np
from PIL import Image


class TesseractOCR:
    @staticmethod
    def _guess_tessdata_path(wanted_lang="eng") -> bytes:
        """
        Attempts to guess potential locations for the `tessdata` folder.

        The `tessdata` folder is needed to use pre-trained Tesseract OCR data, though the automatic detection
        provided in `tesserocr` may not be reliable. Instead iterate over common paths on various systems (e.g.,
        Red Hat, Ubuntu, macOS) and check for the presence of a `tessdata` folder.

        If `TESSDATA_PREFIX` is available in the environment, this function will check that location first.
        If all guessed locations do not exist, fall back to automatic detection provided by `tesserocr` and
        the tesseract API.

        `wanted_lang` (str): a desired language to search for. Defaults to English `eng`.
        """
        candidate_paths = [
            "/usr/local/share/tesseract/tessdata",
            "/usr/share/tesseract/tessdata",
            "/usr/share/tesseract-ocr/4.00/tessdata",
            "/opt/homebrew/share/tessdata",
            "/opt/local/share/tessdata",
        ]

        # Prepend env variable if defined
        if "TESSDATA_PREFIX" in os.environ:
            candidate_paths.insert(os.environ["TESSDATA_PREFIX"], 0)

        # Test candidate paths
        for path in candidate_paths:
            retpath, langs = tesserocr.get_languages(path)
            if wanted_lang in langs:
                return retpath

        # Nothing matched, just return the default path
        return tesserocr.get_languages()[0]

    def image_to_text(self, segments: dict[str, np.ndarray]) -> dict[str, tuple[str, float]]:
        digitized: dict[str, tuple[str, float]] = {}
        with tesserocr.PyTessBaseAPI(path=self._guess_tessdata_path()) as api:
            for label, image in segments.items():
                if image is None:
                    continue

                api.SetImage(Image.fromarray(image))
                digitized[label] = (api.GetUTF8Text(), api.MeanTextConf())

        return digitized
