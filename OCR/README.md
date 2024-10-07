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

Here is the standarized form testing dataset
https://drive.google.com/drive/folders/1WS2FYn0BTxWv0juh7lblzdMaFlI7zbDd
You can download the data from google drive link above and drag and drop the two folders i.e images and ground-truth into the reportvision-dataset-1 folder. You can also run the script medical_report_import.py to pull in relevant data.

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
