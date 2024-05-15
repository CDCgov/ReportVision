from services.checkbox_detector import CheckboxDetector

import os

path = os.path.dirname(__file__)

checkbox_template = os.path.join(path, "../tests/assets/checkbox_template.png")
checkbox_example_filled = os.path.join(path, "../tests/assets/checkbox_example_filled.png")
try:
    detector = CheckboxDetector(checkbox_template)
    result = detector.is_checked(checkbox_example_filled)
    print("Checkbox is checked:", result)
except FileNotFoundError as e:
    print(e)
except Exception as e:
    print("An error occurred:", e)


