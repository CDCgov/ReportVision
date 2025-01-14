# OCR Layer - ReportVision

The **OCR Layer** in the ReportVision project processes document images, performs segmentation and optical character recognition (OCR), and computes accuracy metrics by comparing OCR outputs to ground truth data.

---

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Development Tools](#development-tools)
5. [Testing](#testing)
6. [End-to-End Benchmarking](#end-to-end-benchmarking)
7. [Dockerized Development](#dockerized-development)
8. [Benchmarking](#end-to-end-benchmarking)
9. [Project Architecture](#project-architecture)
10. [API Endpoints](#api-endpoints)


---

## Introduction

The OCR layer uses **Poetry** for dependency management and virtual environment setup. It provides:
- An API for performing OCR operations.
- Support for benchmarking OCR accuracy.
- Configuration for different OCR models and segmentation templates.

### Installation

### Prerequisites
- Python 3.9 or later
- [Poetry](https://python-poetry.org/) for dependency management
- Docker (optional for containerized development)

```shell
pipx install poetry
```

### Running The Application
Activate the virtual environment and install dependencies, all subsequent commands assume you are in the virtual env

```shell
poetry shell
poetry install
```

```shell
fastapi dev ocr/api.py
```

### Testing

Run unit tests

```shell 
poetry run pytest
```

### Development Tools

Adding new dependencies

```shell
poetry add package-name
```

To manually update the poetry lock file

```shell
poetry lock
```

To view installed packages in the virtual env

```shell
poetry show
```

To lint your files using ruff

```shell
ruff check --fix
```

To format your files using ruff

```shell
ruff format
```

To run the API in dev mode with reload

```shell
fastapi dev ocr/api.py
```

To run the API in prod mode

```shell
poetry run api
```


To build the OCR service into an executable artifact

```shell
poetry run build
```

### Dockerized Development

It is also possible to run the project in a collection of docker containers. This is useful for development and testing purposes as it doesn't require any additional dependencies to be installed.

To start the containers, run the following command:

```shell
docker compose -f dev-env.yaml up
```

This will start the following containers:

- ocr: The OCR service container
- frontend: The frontend container

The frontend container will automatically reload when changes are made to the frontend. To access the frontend, navigate to http://localhost:5173 in your browser.

The OCR service container will restart automatically when changes are made to the OCR code. To access the API, navigate to http://localhost:8000/ in your browser.


### End to End Benchmarking

#### Overview
End-to-end benchmarking evaluates OCR accuracy by:

End-to-end benchmarking scripts can:

1. Segment and run OCR on a folder of images using given segmentation template and labels file.
2. Compare OCR outputs to ground truth data based on matching file names.
3. Write metrics (confidence, raw distance, Hamming distance, Levenshtein distance) as well as total metrics to a CSV file.


To run benchmarking:

1. Locate file `benchmark_main.py`
2. Ensure all the paths/folders exist by downloading from [Google Drive for all segmentation/label files](https://drive.google.com/drive/folders/1WS2FYn0BTxWv0juh7lblzdMaFlI7zbDd?usp=sharing)
3. Ensure `ground_truth` folder and files exist
4. Ensure `labels.json` is in the correct format (see `tax_form_segmented_labels.json` as an example) 
5. When running make sure to pass arguments in this order:

* `/path/to/image/folder` (path to the original image files which we need to run OCR on)
* `/path/to/segmentation_template.png` (single file)
* `/path/to/labels.json` (single file)
* `/path/to/output/folder` (path to folder where the output would be. This should exist but can be empty)
* `/path/to/ground/truth_folder` (path to folder for metrics that we would compare against)
* `/path/to/csv_out_folder` (path to folder where all metrics would be. This should exist but can be empty)

By default, segmentation, OCR, and metrics computation are all run together. To disable one or the other, pass the `--no-ocr` or `--no-metrics` flags. You can change the backend model by passing `--model=...` as well.

Run notes:
* Benchmark takes one second per segment for OCR using the default `trocr` model. Please be patient or set a counter to limit the number of files processed.
* Only one segment can be input at a time


### Test Data Sets

You can  run the script `pytest run reportvision-dataset-1/medical_report_import.py` to pull in all relevant data.



## Project Architecture

The OCR Layer is organized as follows:

- **`ocr/`**:
  - **`api.py`**: Defines the API for the OCR service.
  - **`main.py`**: Entry point script to run the OCR service.
  - **`segmenter.py`**: Handles image segmentation based on templates and labels.
  - **`ocr_engine.py`**: OCR logic using the specified OCR models.
  - **`metrics.py`**: Computes metrics (e.g., confidence, Levenshtein distance) by comparing OCR results with ground truth.
  - **`config.py`**: Contains configuration files for paths, environment variables, and model settings.

- **`tests/`**: Contains unit tests, integration tests, and benchmarking scripts.
  - **`benchmark_test.py`**: Tests benchmarking logic for OCR and metrics.
  - **`unit_test.py`**: Includes unit tests for individual components of the OCR service.
  - **`benchmark_main.py`**: Main script for running end-to-end benchmarking, including segmentation, OCR, and metrics computation.

- **`data/`**: location of segmentation templates, labels, ground truth, and test datasets (not included in the repository by default).

- **`reportvision-dataset-1/`**: Example dataset folder for running benchmarks and tests.
  - **`medical_report_import.py`**: Script to import and prepare medical reports for testing.

- **`Dockerfile`**: Defines the container for running the OCR service in a Dockerized environment.

- **`dev-env.yaml`**: Docker Compose file for setting up a development environment with containers for the OCR service and frontend.

- **`pyproject.toml`**: Poetry configuration file specifying project dependencies and settings.

- **`poetry.lock`**: Lock file generated by Poetry to ensure dependency consistency.

## API Endpoints

### For Swagger Docs Start API and go to /docs endpoint

ex: http://localhost:8000/docs

The OCR service exposes the following API endpoints:

#### Health Check
- **`GET /`**
  - **Description**: Returns the status of the OCR service.
  - **Response**: Status message indicating the service's health.

#### Image Alignment
- **`POST /image_alignment/`**
  - **Description**: Aligns a source image with a segmentation template.
  - **Request Body**:
    - `source_image` (Base64-encoded string): The source image to align.
    - `segmentation_template` (Base64-encoded string): The segmentation template to align with.
  - **Response**:
    - Base64-encoded string of the aligned image.

#### Image File to Text
- **`POST /image_file_to_text/`**
  - **Description**: Processes an image file and a segmentation template to extract text based on labeled regions.
  - **Request Body**:
    - `source_image` (file): The uploaded source image file.
    - `segmentation_template` (file): The uploaded segmentation template file.
    - `labels` (JSON string): Defines labeled regions in the segmentation template.
  - **Response**:
    - JSON object containing text extracted from labeled regions.

#### Image to Text
- **`POST /image_to_text`**
  - **Description**: Processes Base64-encoded images and extracts text from labeled regions.
  - **Request Body**:
    - `source_image` (Base64-encoded string): The source image.
    - `segmentation_template` (Base64-encoded string): The segmentation template.
    - `labels` (JSON string): Defines labeled regions in the segmentation template.
  - **Response**:
    - JSON object containing text extracted from labeled regions.
