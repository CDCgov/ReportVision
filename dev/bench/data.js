window.BENCHMARK_DATA = {
  "lastUpdate": 1714661158399,
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
      },
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
          "id": "ba8861900471733767da10160b86a93b9d21dfb5",
          "message": "make change for another test commit for graph",
          "timestamp": "2024-05-02T08:42:34-06:00",
          "tree_id": "b8db950b19100262f9780815bc9f2a3115491192",
          "url": "https://github.com/CDCgov/IDWA/commit/ba8861900471733767da10160b86a93b9d21dfb5"
        },
        "date": 1714661157980,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.247085051208192,
            "unit": "iter/sec",
            "range": "stddev: 0.02065596854471063",
            "extra": "mean: 4.047189399399997 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.27255080630332484,
            "unit": "iter/sec",
            "range": "stddev: 0.014556676750759346",
            "extra": "mean: 3.6690406957999926 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 15.958923361531925,
            "unit": "iter/sec",
            "range": "stddev: 0.0032051110632990536",
            "extra": "mean: 62.660868615388125 msec\nrounds: 13"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 15266165.671541441,
            "unit": "iter/sec",
            "range": "stddev: 4.809897151808711e-9",
            "extra": "mean: 65.5043330143138 nsec\nrounds: 150558"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 15.177463598232748,
            "unit": "iter/sec",
            "range": "stddev: 0.006913056082014899",
            "extra": "mean: 65.8871618124941 msec\nrounds: 16"
          }
        ]
      }
    ]
  }
}