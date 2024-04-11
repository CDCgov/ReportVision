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

Run tests
```shell
poetry run pytest
```

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