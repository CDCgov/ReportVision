FROM python:3.10-bullseye

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

RUN pip install poetry

COPY /ocr /ocr
COPY poetry.lock .
COPY pyproject.toml .

RUN poetry install --without dev

ENTRYPOINT ["poetry", "run", "api"]


