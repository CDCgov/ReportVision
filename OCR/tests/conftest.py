def pytest_benchmark_update_json(config, benchmarks, output_json):
    # this is where we can alter the output json
    print("pytest_benchmark_update_json")
