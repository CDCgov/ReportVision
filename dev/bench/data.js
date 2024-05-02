window.BENCHMARK_DATA = {
  "lastUpdate": 1714660547877,
  "repoUrl": "https://github.com/CDCgov/IDWA",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "derek.a.dombek.com",
            "name": "Derek Dombek"
          },
          "committer": {
            "email": "derek.a.dombek.com",
            "name": "Derek Dombek"
          },
          "distinct": true,
          "id": "cd28d7ba4b4a4ce4a586c8507f77c84b4feb74b2",
          "message": "add auto-push",
          "timestamp": "2024-05-02T08:29:46-06:00",
          "tree_id": "5a341a59eb02b15af46d82b2849e95b24bb79bb7",
          "url": "https://github.com/CDCgov/IDWA/commit/cd28d7ba4b4a4ce4a586c8507f77c84b4feb74b2"
        },
        "date": 1714660547187,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.24751530828359608,
            "unit": "iter/sec",
            "range": "stddev: 0.046295873217674234",
            "extra": "mean: 4.040154150199987 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.27393175696306843,
            "unit": "iter/sec",
            "range": "stddev: 0.021351749786635045",
            "extra": "mean: 3.650544249000018 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 19.97717581027327,
            "unit": "iter/sec",
            "range": "stddev: 0.003172721000082616",
            "extra": "mean: 50.05712566666955 msec\nrounds: 21"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 14968955.721596373,
            "unit": "iter/sec",
            "range": "stddev: 1.1289491343650904e-8",
            "extra": "mean: 66.80492738436322 nsec\nrounds: 154512"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 19.783034430859125,
            "unit": "iter/sec",
            "range": "stddev: 0.006394178103579701",
            "extra": "mean: 50.54836271427207 msec\nrounds: 21"
          }
        ]
      }
    ]
  }
}