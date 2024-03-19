# Record Linkage Performance Testing

This repository contains a performance testing project aimed at evaluating the scalability and responsiveness of the [record-linkage](https://github.com/CDCgov/phdi/tree/main/containers/record-linkage) API using [OpenTelemetry](https://opentelemetry.io/) for instrumentation. By utilizing Docker Compose, it provides an easy-to-use environment setup for running performance tests against the target API.

## Prerequisites

Before getting started, ensure you have the following installed:

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup

1. Build the Docker images and start the environment:

    ```bash
    docker compose up --build -d
    ```

    This command will build the necessary Docker images and start the environment in detached mode.

2. Once the environment is up and running, you can verify that it worked by checking Jaeger at [http://localhost:16686](http://localhost:16686).

3. Run a "Find Traces" query in the Jaeger UI and verify that at least 1 "record-linkage-api: POST /link-record" trace is present.

## Running Performance Tests

More to come...

## Monitoring with OpenTelemetry

The API is instrumented with OpenTelemetry for monitoring and tracing purposes. You can explore the collected metrics and traces using your preferred observability platform compatible with OpenTelemetry, such as Jaeger or Prometheus.

By default, the OpenTelemetry collector is configured to export telemetry data to the local instance of Jaeger, which can be accessed at [http://localhost:16686](http://localhost:16686).

## Cleanup

After you've finished running performance tests and analyzing the results, you can stop and remove the Docker containers by running:

```bash
docker compose down
```
