window.BENCHMARK_DATA = {
  "lastUpdate": 1720457952297,
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
      },
      {
        "commit": {
          "author": {
            "email": "jonathan@skylight.digital",
            "name": "Jonathan Chang",
            "username": "jonchang"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ae4f6f09e70bad3c2bc89773d7d951ffbb88aa2e",
          "message": "Add image alignment and registration code (#69)",
          "timestamp": "2024-06-13T19:57:33Z",
          "tree_id": "68aa6238e83eafd765c076a1b70e96d3dbce154b",
          "url": "https://github.com/CDCgov/IDWA/commit/ae4f6f09e70bad3c2bc89773d7d951ffbb88aa2e"
        },
        "date": 1718308875700,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.24874869831653146,
            "unit": "iter/sec",
            "range": "stddev: 0.009071098828721515",
            "extra": "mean: 4.020121539399997 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.27776593869905575,
            "unit": "iter/sec",
            "range": "stddev: 0.027292232925753588",
            "extra": "mean: 3.6001534409999976 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 17.056935720719235,
            "unit": "iter/sec",
            "range": "stddev: 0.0054561371513447915",
            "extra": "mean: 58.627177611116274 msec\nrounds: 18"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 15615615.450544281,
            "unit": "iter/sec",
            "range": "stddev: 4.916626172998887e-9",
            "extra": "mean: 64.0384622153937 nsec\nrounds: 136352"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 9777.597789402545,
            "unit": "iter/sec",
            "range": "stddev: 0.00001876479506054569",
            "extra": "mean: 102.2746099337253 usec\nrounds: 4530"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c99e6cf6c9002c68381615a5e0d3f5a17e43a6cc",
          "message": "Bump urllib3 from 2.2.1 to 2.2.2 in /OCR (#123)\n\nBumps [urllib3](https://github.com/urllib3/urllib3) from 2.2.1 to 2.2.2.\n- [Release notes](https://github.com/urllib3/urllib3/releases)\n- [Changelog](https://github.com/urllib3/urllib3/blob/main/CHANGES.rst)\n- [Commits](https://github.com/urllib3/urllib3/compare/2.2.1...2.2.2)\n\n---\nupdated-dependencies:\n- dependency-name: urllib3\n  dependency-type: indirect\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2024-06-21T16:54:25Z",
          "tree_id": "915a9a032527f7625d77937bc9b714e0ded91651",
          "url": "https://github.com/CDCgov/IDWA/commit/c99e6cf6c9002c68381615a5e0d3f5a17e43a6cc"
        },
        "date": 1718989082094,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.2517975798379426,
            "unit": "iter/sec",
            "range": "stddev: 0.006622793255824939",
            "extra": "mean: 3.9714440490000014 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.27797259215103315,
            "unit": "iter/sec",
            "range": "stddev: 0.04095683758502647",
            "extra": "mean: 3.597476975199993 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 14.664693169169826,
            "unit": "iter/sec",
            "range": "stddev: 0.009769679877462934",
            "extra": "mean: 68.19099373332543 msec\nrounds: 15"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 15891292.674853755,
            "unit": "iter/sec",
            "range": "stddev: 1.0878049623071224e-8",
            "extra": "mean: 62.9275428035278 nsec\nrounds: 159975"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 10166.843617200208,
            "unit": "iter/sec",
            "range": "stddev: 0.00002035317962542199",
            "extra": "mean: 98.35894380318841 usec\nrounds: 4680"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "158501719+arinkulshi-skylight@users.noreply.github.com",
            "name": "Arin Kulshi",
            "username": "arinkulshi-skylight"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": false,
          "id": "f09b511b5d75c8da88702b89f703cdbdc3c8c65b",
          "message": "[IDWA-OCR-96]Create segmentation template and labels file using PDF metadata (#99)\n\n* initial\n\n* form_asset\n\n* edited script\n\n* initial\n\n* removed redundant files\n\n* edit to file path config\n\n* linting\n\n* file name change\n\n* added new packages removed previous image extract logic\n\n* edited package from pypdf2 to pypdf\n\n* added pdf file for context\n\n* edited imports on test\n\n* edited comments\n\n* linting\n\n* added new functions\n\n* edits to formatting\n\n* added new approach to segment fields\n\n* added tests\n\n* edited tests\n\n* linting\n\n* edited string formatting\n\n* linting\n\n* Update pdf_field_extractor_main.py\n\nedited import dir logic\n\n* added new end to end test\n\n* added new end to end test to verify colors\n\n* edited end to end test\n\n* edited end to end test to only include color check\n\n* move color matches to a list and tested against a list\n\n* linting\n\n* poetry file update\n\n---------\n\nCo-authored-by: Arindam Kulshi <akulshi04@gmail.com>",
          "timestamp": "2024-06-24T15:47:36Z",
          "tree_id": "a772273027ec7010472f19b352c92ba2d2d7644a",
          "url": "https://github.com/CDCgov/IDWA/commit/f09b511b5d75c8da88702b89f703cdbdc3c8c65b"
        },
        "date": 1719244292625,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.2539707485898856,
            "unit": "iter/sec",
            "range": "stddev: 0.024880970643491384",
            "extra": "mean: 3.9374613239999916 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.28226143919064567,
            "unit": "iter/sec",
            "range": "stddev: 0.036075495063570655",
            "extra": "mean: 3.542814785000007 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 15.246749284692987,
            "unit": "iter/sec",
            "range": "stddev: 0.010395492701120753",
            "extra": "mean: 65.58775128570866 msec\nrounds: 14"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 15621857.455102451,
            "unit": "iter/sec",
            "range": "stddev: 5.435920582196729e-9",
            "extra": "mean: 64.01287445320949 nsec\nrounds: 155473"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 9967.707744565269,
            "unit": "iter/sec",
            "range": "stddev: 0.000018287295628707976",
            "extra": "mean: 100.32396872242104 usec\nrounds: 4572"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "158501719+arinkulshi-skylight@users.noreply.github.com",
            "name": "Arin Kulshi",
            "username": "arinkulshi-skylight"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": false,
          "id": "60288d744b352d679536d4d32d0e7f801cd25c8c",
          "message": "[IDWA-OCR-95] ocr to phdc conversion logic for patient (#107)\n\n* added ocr to phdc conversion logic for patient\n\n* edited function calls\n\n* edited lock file\n\n* remove ocr as name\n\n* Regenerated poetry.lock after resolving merge conflicts\n\n---------\n\nCo-authored-by: Arindam Kulshi <akulshi04@gmail.com>",
          "timestamp": "2024-06-28T18:41:57Z",
          "tree_id": "cb5cb1032a2bb78a67141d3fa233e4fc3bca5774",
          "url": "https://github.com/CDCgov/IDWA/commit/60288d744b352d679536d4d32d0e7f801cd25c8c"
        },
        "date": 1719600321121,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.2539708686652669,
            "unit": "iter/sec",
            "range": "stddev: 0.0162205660243738",
            "extra": "mean: 3.937459462399988 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.2855235017004225,
            "unit": "iter/sec",
            "range": "stddev: 0.02730124921324038",
            "extra": "mean: 3.5023386657999938 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 16.029212714414225,
            "unit": "iter/sec",
            "range": "stddev: 0.006452000110089815",
            "extra": "mean: 62.38609579999851 msec\nrounds: 15"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 15041991.189358937,
            "unit": "iter/sec",
            "range": "stddev: 4.892157421535553e-9",
            "extra": "mean: 66.48056014736007 nsec\nrounds: 154727"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 9989.278150227377,
            "unit": "iter/sec",
            "range": "stddev: 0.00001863655711385777",
            "extra": "mean: 100.10733357917736 usec\nrounds: 4065"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "zedd@skylight.digital",
            "name": "Zedd Shmais",
            "username": "zdeveloper"
          },
          "committer": {
            "email": "zedd@skylight.digital",
            "name": "Zedd Shmais",
            "username": "zdeveloper"
          },
          "distinct": true,
          "id": "d100b0607cc0a0f4cdb4bea2894db7e25e9870c8",
          "message": "remove output.json",
          "timestamp": "2024-07-01T16:04:53-05:00",
          "tree_id": "b780f5702a55a116c2a478c96bfc25ea748b63e6",
          "url": "https://github.com/CDCgov/IDWA/commit/d100b0607cc0a0f4cdb4bea2894db7e25e9870c8"
        },
        "date": 1719868096064,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[single word sentences-segments0]",
            "value": 0.13718051585027324,
            "unit": "iter/sec",
            "range": "stddev: 0.06654354795050832",
            "extra": "mean: 7.289664962999979 sec\nrounds: 2"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "zedd@skylight.digital",
            "name": "Zedd Shmais",
            "username": "zdeveloper"
          },
          "committer": {
            "email": "zedd@skylight.digital",
            "name": "Zedd Shmais",
            "username": "zdeveloper"
          },
          "distinct": true,
          "id": "98450e3df9c71ffa80597f962a8bbf3be0b1ea5f",
          "message": "minor updates",
          "timestamp": "2024-07-06T13:30:41-05:00",
          "tree_id": "8f32146b7bc00359663aa62f54241dce6bc6a4bd",
          "url": "https://github.com/CDCgov/IDWA/commit/98450e3df9c71ffa80597f962a8bbf3be0b1ea5f"
        },
        "date": 1720293111411,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[single word sentences-segments0]",
            "value": 0.02995087312468456,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 33.388008283999966 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[two word sentences-segments1]",
            "value": 0.02785783453155606,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 35.89654460999998 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[three word sentences-segments2]",
            "value": 0.020900944237242525,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 47.844728384000064 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[four word sentences-segments3]",
            "value": 0.01933986050315622,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 51.70668112299995 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[five word sentences-segments4]",
            "value": 0.016590195463560727,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 60.27656528800003 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[six word sentences-segments5]",
            "value": 0.014711757751287628,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 67.97284300799993 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[seven word sentences-segments6]",
            "value": 0.014295114098846316,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 69.95397120200005 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[eight word sentences-segments7]",
            "value": 0.013042792989010057,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 76.6706947539999 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[nine word sentences-segments8]",
            "value": 0.01368024396405884,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 73.09811160000004 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[ten word sentences-segments9]",
            "value": 0.013173542588974345,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 75.909725364 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[printed uppercase letter space-segments10]",
            "value": 0.012703491297744025,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 78.71851733999983 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[printed lowercase letter space-segments11]",
            "value": 0.012905236632983435,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 77.48792435500036 sec\nrounds: 1"
          },
          {
            "name": "tests/benchmark_test.py::TestBenchmark::test_ocr_english_sentences[printed number space-segments12]",
            "value": 0.033686544719337734,
            "unit": "iter/sec",
            "range": "stddev: 0",
            "extra": "mean: 29.685442906999924 sec\nrounds: 1"
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
          "id": "227ce957b8bd928bad5ed2e080bd72a74992da7c",
          "message": "view file",
          "timestamp": "2024-07-08T10:55:18-06:00",
          "tree_id": "af84e4aea00f4defe184f4968961371d6abbf905",
          "url": "https://github.com/CDCgov/IDWA/commit/227ce957b8bd928bad5ed2e080bd72a74992da7c"
        },
        "date": 1720457951790,
        "tool": "pytest",
        "benches": [
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_printed_benchmark",
            "value": 0.2507795838970891,
            "unit": "iter/sec",
            "range": "stddev: 0.02142558570417204",
            "extra": "mean: 3.9875654327999994 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestOCRBenchmark::test_ocr_handwritten_benchmark",
            "value": 0.2762636753527825,
            "unit": "iter/sec",
            "range": "stddev: 0.034724662187905826",
            "extra": "mean: 3.6197303127999816 sec\nrounds: 5"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_benchmark",
            "value": 14.806695935225756,
            "unit": "iter/sec",
            "range": "stddev: 0.006510075715058763",
            "extra": "mean: 67.53701192856657 msec\nrounds: 14"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_segment_shapes_benchmark",
            "value": 15941865.671222059,
            "unit": "iter/sec",
            "range": "stddev: 4.260447542842581e-9",
            "extra": "mean: 62.727915328326795 nsec\nrounds: 156226"
          },
          {
            "name": "tests/bench_test.py::TestImageSegmenterBenchmark::test_no_matching_pixels_benchmark",
            "value": 9747.387650023291,
            "unit": "iter/sec",
            "range": "stddev: 0.000020377568375948488",
            "extra": "mean: 102.59159027061067 usec\nrounds: 4625"
          }
        ]
      }
    ]
  }
}