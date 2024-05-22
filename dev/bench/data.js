window.BENCHMARK_DATA = {
  "lastUpdate": 1716393949534,
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
          "id": "b63bb6f28a489f50b3a78f2865a3381674a583f5",
          "message": "lint",
          "timestamp": "2024-05-02T09:09:00-06:00",
          "tree_id": "cd587bdf5ff5dc29c4a65e960b5c4b9789a677c2",
          "url": "https://github.com/CDCgov/IDWA/commit/b63bb6f28a489f50b3a78f2865a3381674a583f5"
        },
        "date": 1714662780765,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.24842573842990798,
            "unit": "iter/sec",
            "range": "stddev: 0.030099563770199837",
            "extra": "mean: 4.0253478013999935 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.2757161730337935,
            "unit": "iter/sec",
            "range": "stddev: 0.043896782502312486",
            "extra": "mean: 3.626918178199992 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 14.097832936101293,
            "unit": "iter/sec",
            "range": "stddev: 0.0077722978961457375",
            "extra": "mean: 70.9328876666733 msec\nrounds: 9"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 15059571.812293539,
            "unit": "iter/sec",
            "range": "stddev: 9.044530253240205e-9",
            "extra": "mean: 66.40295039359047 nsec\nrounds: 149858"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 9700.282292374883,
            "unit": "iter/sec",
            "range": "stddev: 0.00001532209643040574",
            "extra": "mean: 103.08978335466296 usec\nrounds: 4482"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "50093944+derekadombek@users.noreply.github.com",
            "name": "Derek A Dombek",
            "username": "derekadombek"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "01fcdfbe2498bc51656de08c790081e10288bdb8",
          "message": "[IDWA-OCR-97] Benchmark tests and action (#100)\n\n* try benchmarks in gha\n\n* try benchmarks in gha\n\n* add ./\n\n* add >\n\n* add rel path to with option\n\n* gh-pages branch and secret\n\n* gh-pages branch and secret\n\n* change path\n\n* change path\n\n* change path\n\n* add auto-push\n\n* make change for another test commit for graph\n\n* point to local init fun and not global\n\n* end of line\n\n* lint\n\n* on push main\n\n* update readme\n\n* change names to workflows\n\n* point only to unit tests in workflow\n\n---------\n\nCo-authored-by: Derek Dombek <derek.a.dombek.com>",
          "timestamp": "2024-05-22T16:01:13Z",
          "tree_id": "c3a25e18fa6443a85db23c0b95780968a3814cb6",
          "url": "https://github.com/CDCgov/IDWA/commit/01fcdfbe2498bc51656de08c790081e10288bdb8"
        },
        "date": 1716393949079,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.2514289325253437,
            "unit": "iter/sec",
            "range": "stddev: 0.01612608853114493",
            "extra": "mean: 3.977267015200016 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.27741032360781437,
            "unit": "iter/sec",
            "range": "stddev: 0.028654053696145498",
            "extra": "mean: 3.604768514 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 17.293074939584823,
            "unit": "iter/sec",
            "range": "stddev: 0.005155172489623059",
            "extra": "mean: 57.826615769237414 msec\nrounds: 13"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 16114100.684491169,
            "unit": "iter/sec",
            "range": "stddev: 5.140288131938997e-9",
            "extra": "mean: 62.057450153691335 nsec\nrounds: 162049"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 9882.790741339477,
            "unit": "iter/sec",
            "range": "stddev: 0.00001428464937007343",
            "extra": "mean: 101.1859935288343 usec\nrounds: 4482"
          }
        ]
      }
    ]
  }
}