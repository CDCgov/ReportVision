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