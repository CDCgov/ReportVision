import os
import string
import random

import numpy as np
import pytest
from Levenshtein import distance, ratio

from ocr.services.image_ocr import ImageOCR
from ocr.services.tesseract_ocr import TesseractOCR
from PIL import Image, ImageDraw, ImageFont

path = os.path.dirname(__file__)

segmentation_template = os.path.join(path, "./assets/form_segmention_template.png")
raw_image = os.path.join(path, "./assets/form_filled.png")
raw_image_handwritten = os.path.join(path, "./assets/form_hand_filled.png")
labels_path = os.path.join(path, "./assets/labels.json")
declaration_of_independence_path = os.path.join(path, "./assets/declarationOfIndependence.txt")


def generate_sentence_segments(size=2, sentence_length=1, show_images=True) -> dict[str, np.ndarray]:
    def text_file_to_word_list():
        f = open(declaration_of_independence_path, "r")
        return (f.read()).split()

    def randomly_select_paragraphs():
        book = np.array(text_file_to_word_list())
        if sentence_length > 1:
            result = []
            for n in range(size):
                result.append(" ".join(np.random.choice(book, size=sentence_length)))
            return result
        else:
            return np.random.choice(book, size=size)

    segments: dict[str, np.ndarray] = {}
    paragraphs = randomly_select_paragraphs()
    print("paragraphs", paragraphs)
    for paragraph in paragraphs:
        text, image = generate_image_from_exact_text(paragraph)
        segments[text] = image
        # show for debugging purposes
        if show_images:
            img = Image.fromarray(image)
            img.show()
    return segments


def generate_random_string(length, choices=string.ascii_uppercase):
    return "".join(random.choices(choices, k=length))


def generate_text_image(length, string_choices=string.ascii_uppercase):
    text = generate_random_string(length, choices=string_choices)
    return generate_image_from_exact_text(text)


def generate_image_from_exact_text(text):
    font_size = 16
    width, height = round(font_size + (font_size * len(text) * 0.7)), round(font_size * 2) * (text.count("\n") + 1)
    font = ImageFont.load_default(font_size)

    img = Image.new("RGB", (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    draw.text((width / 2, height / 2), text, fill=(0, 0, 0), align="center", anchor="mm", font=font)
    return text, np.array(img)


def generate_random_segments(string_choices=string.ascii_uppercase, show_images=True) -> dict[str, np.ndarray]:
    segments: dict[str, np.ndarray] = {}
    for i in range(1, 5):
        text, image = generate_text_image(i, string_choices)
        segments[text] = image
        # show for debugging purposes
        if show_images:
            img = Image.fromarray(image)
            img.show()
    return segments


def generate_exact_segments(
    space=string.ascii_uppercase + string.ascii_lowercase + string.digits, show_images=True
) -> dict[str, np.ndarray]:
    segments: dict[str, np.ndarray] = {}
    for letter in list(space):
        text, image = generate_image_from_exact_text(letter)
        segments[text] = image
        # show for debugging purposes
        if show_images:
            img = Image.fromarray(image)
            img.show()
    return segments


class TestBenchmark:
    ocr = ImageOCR()
    tess = TesseractOCR()
    sample_size = 10

    test_cases = [
        ("single word sentences", generate_sentence_segments(sample_size, sentence_length=1, show_images=False)),
        ("two word sentences", generate_sentence_segments(sample_size, sentence_length=2, show_images=False)),
        ("three word sentences", generate_sentence_segments(sample_size, sentence_length=3, show_images=False)),
        ("four word sentences", generate_sentence_segments(sample_size, sentence_length=4, show_images=False)),
        ("five word sentences", generate_sentence_segments(sample_size, sentence_length=5, show_images=False)),
        ("six word sentences", generate_sentence_segments(sample_size, sentence_length=6, show_images=False)),
        ("seven word sentences", generate_sentence_segments(sample_size, sentence_length=7, show_images=False)),
        ("eight word sentences", generate_sentence_segments(sample_size, sentence_length=8, show_images=False)),
        ("nine word sentences", generate_sentence_segments(sample_size, sentence_length=9, show_images=False)),
        ("ten word sentences", generate_sentence_segments(sample_size, sentence_length=10, show_images=False)),
        ("printed uppercase letter space", generate_exact_segments(space=string.ascii_uppercase, show_images=False)),
        ("printed lowercase letter space", generate_exact_segments(space=string.ascii_lowercase, show_images=False)),
        ("printed number space", generate_exact_segments(space=string.digits, show_images=False)),
    ]

    @pytest.mark.benchmark(group="OCR Model Performance", min_rounds=1)
    @pytest.mark.parametrize("name,segments", test_cases)
    @pytest.mark.parametrize("model", (ocr, tess))
    def test_ocr_english_sentences(self, name, segments, model, benchmark):
        print("\n", name)
        results = benchmark(model.image_to_text, segments)

        actual_labels = [x.lower() for x in list(results.keys())]
        predicted_labels = [x[0].lower() for x in list(results.values())]
        print("actual_labels", actual_labels)
        print("predicted_labels", predicted_labels)
        print("distance:", distance(actual_labels, predicted_labels))
        print("ratio:", ratio(actual_labels, predicted_labels))

        benchmark.extra_info["distance"] = distance(actual_labels, predicted_labels)
        benchmark.extra_info["ratio"] = ratio(actual_labels, predicted_labels)
