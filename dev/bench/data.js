window.BENCHMARK_DATA = {
  "lastUpdate": 1714662425768,
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
          "id": "90e0da823124c57d4071b82337993272695ff32e",
          "message": "point to local init fun and not global",
          "timestamp": "2024-05-02T08:55:09-06:00",
          "tree_id": "c1035c3e9e5729c91487cbc160eb4e5710530246",
          "url": "https://github.com/CDCgov/IDWA/commit/90e0da823124c57d4071b82337993272695ff32e"
        },
        "date": 1714662022273,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.2515730737888557,
            "unit": "iter/sec",
            "range": "stddev: 0.011097873127372336",
            "extra": "mean: 3.9749882009999853 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.2774103205911196,
            "unit": "iter/sec",
            "range": "stddev: 0.01926182623588333",
            "extra": "mean: 3.6047685532000058 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 17.404567782474626,
            "unit": "iter/sec",
            "range": "stddev: 0.0052838620131196706",
            "extra": "mean: 57.45618118750073 msec\nrounds: 16"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 14879267.281991512,
            "unit": "iter/sec",
            "range": "stddev: 1.1979798071337534e-8",
            "extra": "mean: 67.20761049907425 nsec\nrounds: 152626"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 9947.658039836386,
            "unit": "iter/sec",
            "range": "stddev: 0.000013057700722124622",
            "extra": "mean: 100.52617369790964 usec\nrounds: 4646"
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
          "id": "c5fc62ac7e5c1fc14274a62961849350f632964a",
          "message": "end of line",
          "timestamp": "2024-05-02T09:03:20-06:00",
          "tree_id": "029c8923a0b5eb718a985ce122f1bb24f7d01767",
          "url": "https://github.com/CDCgov/IDWA/commit/c5fc62ac7e5c1fc14274a62961849350f632964a"
        },
        "date": 1714662424735,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.24763118027429262,
            "unit": "iter/sec",
            "range": "stddev: 0.02477960162431633",
            "extra": "mean: 4.0382636746000005 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.2754785248282391,
            "unit": "iter/sec",
            "range": "stddev: 0.03819437505530442",
            "extra": "mean: 3.6300470268000025 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 17.10628470445489,
            "unit": "iter/sec",
            "range": "stddev: 0.006146809251274113",
            "extra": "mean: 58.45804727776896 msec\nrounds: 18"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 15667398.65231088,
            "unit": "iter/sec",
            "range": "stddev: 7.209263230288946e-9",
            "extra": "mean: 63.82680508690087 nsec\nrounds: 156937"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 9743.76056447581,
            "unit": "iter/sec",
            "range": "stddev: 0.000015819482947033173",
            "extra": "mean: 102.62977968135218 usec\nrounds: 4203"
          }
        ]
      }
    ]
  }
}