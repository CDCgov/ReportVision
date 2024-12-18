import os

import tesserocr
from tesserocr import PSM
import numpy as np
from PIL import Image


class TesseractOCR:
    def __init__(self, psm=PSM.AUTO, variables=dict()):
        """
        Initialize the tesseract OCR model.

        `psm` (int): an enum (from `PSM`) that defines tesseract's page segmentation mode. Default is `AUTO`.
        `variables` (dict): a dict to customize tesseract's behavior with internal variables
        """
        self.psm = psm
        self.variables = variables

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
            "/usr/share/tesseract-ocr/5/tessdata",
            "/opt/homebrew/share/tessdata",
            "/opt/local/share/tessdata",
        ]

        # Prepend env variable if defined
        if "TESSDATA_PREFIX" in os.environ:
            candidate_paths.insert(os.environ["TESSDATA_PREFIX"], 0)

        # Test candidate paths
        for path in candidate_paths:
            # When compiled for certain systems (macOS), libtesseract aborts due to an untrapped exception if it
            # cannot access the path for any reason (e.g., does not exist, lacks read permissions). Attempt to
            # enumerate the directory and, if it fails, skip this path.
            try:
                os.listdir(path)
            except OSError:
                continue

            retpath, langs = tesserocr.get_languages(path)
            if wanted_lang in langs:
                return retpath

        # Nothing matched, just return the default path
        return tesserocr.get_languages()[0]

    def image_to_text(self, segments: dict[str, np.ndarray]) -> dict[str, tuple[str, float]]:
        digitized: dict[str, tuple[str, float]] = {}
        with tesserocr.PyTessBaseAPI(psm=self.psm, variables=self.variables, path=self._guess_tessdata_path()) as api:
            for label, image in segments.items():
                if image is None:
                    continue

                api.SetImage(Image.fromarray(image))
                digitized[label] = (api.GetUTF8Text().strip(), api.MeanTextConf())

        return digitized
