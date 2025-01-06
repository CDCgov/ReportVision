## OCR

### Installation

```shell
pipx install poetry
```

Activate the virtual environment and install dependencies, all subsequent commands assume you are in the virtual env

```shell
poetry shell
poetry install
```

Run unit tests

```shell
poetry run pytest
```

Run benchmark tests

```shell
cd tests
poetry run pytest benchmark_test.py -v
```

poetry run pytest bench_test.py -v

Run main, hoping to convert this to a cli at some point

```shell
poetry run main
```

To build the OCR service into an executable artifact

```shell
poetry run build
```

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

### Test Data Sets

You can also run the script `pytest run reportvision-dataset-1/medical_report_import.py` to pull in all relevant data.


### Run end-to-end benchmarking

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

### Dockerized Development

It is also possible to run the entire project in a collection of docker containers. This is useful for development and testing purposes as it doesn't require any additional dependencies to be installed on your local machine.

To start the containers, run the following command:

```shell
docker compose -f dev-env.yaml up
```

This will start the following containers:

- ocr: The OCR service container
- frontend: The frontend container

The frontend container will automatically reload when changes are made to the frontend code. To access the frontend, navigate to http://localhost:5173 in your browser.

The OCR service container will restart automatically when changes are made to the OCR code. To access the API, navigate to http://localhost:8000/ in your browser.
