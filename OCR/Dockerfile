FROM python:3.10-bullseye

RUN pip install poetry

COPY /ocr /ocr
COPY poetry.lock .
COPY pyproject.toml .

RUN poetry install --without dev

ENTRYPOINT ["poetry", "run", "api"]


