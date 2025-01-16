"""Module for OCR services using a Tesseract backend."""

import os

import tesserocr
from tesserocr import PSM
import numpy as np
from PIL import Image


class TesseractOCR:
    """A class to provide OCR services using Tesseract as the backend.

    This class supports configuring Tesseract's page segmentation modes and customizing its behavior
    through internal variables.

    Attributes:
        psm (int): The page segmentation mode for Tesseract, specifying how Tesseract interprets the structure of the document.
        variables (dict): A dictionary of variables to customize Tesseract's behavior.

    See Also:
    * https://github.com/sirfz/tesserocr/blob/bbe0fb8edabdcc990f1e6fa9334c0747c2ac76ee/tesserocr/__init__.pyi#L47
    * https://tesseract-ocr.github.io/tessdoc/tess3/ControlParams.html
    """

    def __init__(self, psm=PSM.AUTO, variables=dict()):
        """Initializes the TesseractOCR object with the specified page segmentation mode and internal variables.

        Args:
            psm (int, optional): The page segmentation mode (from `tesserocr.PSM`). Default is `PSM.AUTO`.
            variables (dict, optional): A dictionary of variables to customize Tesseract's behavior. Default is an empty dictionary.
        """
        self.psm = psm
        self.variables = variables

    @staticmethod
    def _guess_tessdata_path(wanted_lang="eng") -> bytes:
        """Attempts to guess potential locations for the `tessdata` folder.

        The `tessdata` folder is needed to use pre-trained Tesseract OCR data, though the automatic detection
        provided in `tesserocr` may not be reliable.

        The function first checks the path defined by the environment variable `TESSDATA_PREFIX` (if available),
        and then falls back to searching several default candidate paths on various systems (e.g., Red Hat, Ubuntu,
        macOS). If no valid path is found, it uses the automatic detection provided by the Tesseract API, which may fail.

        Args:
            wanted_lang (str, optional): The desired language to search for in the `tessdata` folder. Default is 'eng' (English).

        Returns:
            bytes: The path to the `tessdata` directory containing the OCR language files.
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
        """Converts image segments into text using Tesseract OCR.

        The function processes a dictionary of image segments, where each key corresponds to a segment label,
        and each value is a NumPy array representing an image segment.

        For each segment, it extracts the text and the average confidence score returned from the Tesseract API.

        Args:
            segments (dict[str, np.ndarray]): A dictionary where keys are segment labels (e.g., 'name', 'date'),
                                              and values are NumPy arrays representing the corresponding image segments.

        Returns:
            dict[str, tuple[str, float]]: A dictionary where each key corresponds to a segment label, and each value is
                                          a tuple containing the OCR result (string) and the confidence score (float).
        """
        digitized: dict[str, tuple[str, float]] = {}
        with tesserocr.PyTessBaseAPI(psm=self.psm, variables=self.variables, path=self._guess_tessdata_path()) as api:
            for label, image in segments.items():
                if image is None:
                    continue

                api.SetImage(Image.fromarray(image))
                digitized[label] = (api.GetUTF8Text().strip(), api.MeanTextConf())

        return digitized
