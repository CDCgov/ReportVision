import PyInstaller.__main__
from pathlib import Path

HERE = Path(__file__).parent.absolute()
path_to_main = str(HERE / "main.py")


# This function installs/packages the main OCR function as an executable
# while also including the needed assets ie. the mapping labels and segmentation template
def install():
    PyInstaller.__main__.run(
        [
            path_to_main,
            "--onefile",
            "--windowed",
            # SOURCE:DESTINATION
            # "--add-data=ocr/assets/form_filled.png:assets/",
            # "--add-data=ocr/assets/form_segmention_template.png:assets/",
            # "--add-data=ocr/assets/labels.json:assets/",
            # other pyinstaller options...
        ]
    )
