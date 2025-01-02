import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import documentImage from "./SyphForm.png"; //Please enter your file of choice here
import { EditableText } from "../components/EditableText/EditableText.tsx";
import ErrorIcon from "../assets/error_icon.svg";

import "./ReviewTemplate.scss";
import ReviewTable from "../components/ReviewTable.tsx";
import ReviewBulk from "../components/ReviewBulk.tsx";
import { PDF, Submission } from "../../api/types/types.ts";
import { useFiles } from "../contexts/FilesContext.tsx";
import {
  fake_extraction_arr,
  fake_upload_images,
  fakeTemplates,
} from "../utils/constants.ts";
import { ERRORS, useError } from "../contexts/ErrorContext.tsx";

interface ResultsTable {
  index: number;
  name: string;
  value: any;
  confidence: number;
  isError: boolean;
  isEdited: boolean;
}

interface OverallTable {
  index: number;
  fileName: string;
  pageCount: number;
  errors: number;
  confidence: number;
}

interface Row {
  isEdited: boolean;
  index: number;
  isError: boolean;
  name: string;
}

const ReviewTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { clearTemplates } = useFiles();
  const { setError } = useError();
  const [submissionIndex, setSubmissionIndex] = useState<number>(0);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [submissionArray, setSubmissionArray] = useState<Submission[]>([]);
  const [pdfs, setPdfs] = useState<PDF[]>([]);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Map<string, string>[]>([]);

  const onDownload = () => {
    try {
      setError(null);
      if (submissionArray && submissionArray.length > 0) {
        // Prepare CSV data with column names
        const csvData = [
          ["file_name", "label", "value"], // Column names
          ...submissionArray.flatMap((submission) =>
            Object.entries(submission.results).map(([k, v]) => [
              submission.file_name,
              k,
              v.text,
            ]),
          ), // Data rows
        ]
          .map((row) => row.join(",")) // Join each row with commas
          .join("\n"); // Join rows with newlines

        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "submission_data.csv"; // Filename
        document.body.appendChild(a); // Append to body
        a.click(); // Trigger download
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url); // Revoke URL
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setError(ERRORS.CSV_ERROR);
    }
  };

  useEffect(() => {
    const arrData = localStorage.getItem("arr_submissions");
    const pdfData = localStorage.getItem("extracted_images_uploaded");
    if (pdfData) {
      setPdfs(JSON.parse(pdfData));
    } else {
      // use fakedata if no data
      setPdfs(fake_upload_images);
    }

    if (arrData) {
      setSubmissionArray(JSON.parse(arrData));
      setEditedValues(Array(JSON.parse(arrData).length).fill(new Map()));
    } else {
      // use fakedata if no data
      setSubmissionArray(fake_extraction_arr);
      setEditedValues(Array(fake_extraction_arr.length).fill(new Map()));
    }
  }, []);

  useEffect(() => {
    if (pdfs.length > 0) {
      setImages(
        pdfs.find(
          (pdf) => pdf.file === submissionArray[submissionIndex]?.file_name,
        )?.images || [],
      );
    } else {
      setImages([documentImage]);
    }
  }, [pdfs, submissionArray, submissionIndex]);

  const handleBack = () => {
    navigate("/extract/upload");
  };

  const handleSubmit = () => {
    navigate("/extract/submit");
  };

  const handleClose = () => {
    navigate("/");
  };

  useEffect(() => {
    const data = localStorage.getItem("templates");
    if (data) {
      setTemplates(JSON.parse(data));
    } else {
      setTemplates(fakeTemplates);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTemplates();
    };
  }, []);

  //fallback if no valid template is available can edit if needed
  if (!submissionArray || submissionArray.length === 0) {
    return <div>No submission Data</div>;
  }

  const template = templates.filter((t) => {
    return (
      (t?.name ?? "empty1") ===
      (submissionArray[index]?.template_name ?? "empty2")
    );
  })?.[0];
  const fieldShapes =
    template?.pages[index]?.fieldNames.reduce((acc, curr, idx) => {
      acc[curr.label] = template.pages[index].shapes[idx].points;
      return acc;
    }, {}) || {};

  const maskShape = fieldShapes[selectedField || "Patient - First Name"]
    ?.map(([x, y]) => `${x},${y}`)
    ?.join(" ");
  const { results } = submissionArray[submissionIndex];
  const confidenceVal = 75;
  const resultsTable: ResultsTable[] = Object.entries(results).map(
    ([k, v], idx) => {
      const overrideValue =
        editedValues.length === 0 ? "" : editedValues[submissionIndex][k];
      return {
        index: idx,
        name: k,
        value: overrideValue || v.text,
        confidence: overrideValue ? 100 : v.confidence,
        isError: overrideValue ? false : v.confidence <= confidenceVal,
        isEdited: !!overrideValue,
      };
    },
  );
  const overallTable: OverallTable[] = submissionArray.map(
    (submission, idx) => {
      return {
        index: idx,
        fileName: submission.file_name,
        pageCount:
          pdfs.find((pdf) => pdf.file === submission.file_name)?.images
            .length || 0,
        errors: Object.values(submission.results).reduce(
          (sum, field) => sum + (field.confidence < 80 ? 1 : 0),
          0,
        ),
        confidence: (
          Object.values(submission.results).reduce(
            (sum, field) => sum + field.confidence,
            0,
          ) / Object.values(submission.results).length
        ).toFixed(2),
      };
    },
  );
  const calculateOverallConfidence = () => {
    if (submissionArray.length === 0) return 0;
    const results = resultsTable;
    const totalConfidence = results.reduce((sum, result) => {
      return sum + result.confidence;
    }, 0);
    return (totalConfidence / results.length).toFixed(2);
  };

  const errorCount = resultsTable.filter((r) => r.isError).length;
  const hasErrors = overallTable[submissionIndex].errors > 0;
  const overallConfidence = calculateOverallConfidence();

  const labelConfidenceFormatter = (d, _idx, row) => {
    return row.isEdited
      ? "Edited"
      : redTextOnErrorFormatter(`${d.toFixed(0)}%`, row.index, row);
  };

  const redTextOnErrorFormatter = (
    d: string | number,
    _idx: number,
    row: Row,
  ) => {
    return row.isError ? <span className="error-text">{d}</span> : d;
  };

  const editCellFormatter = (d: unknown | string, _idx: number, row: Row) => {
    return (
      <EditableText
        dataTestId={`${row.isError ? "edit-fix-error" : null}`}
        text={d as string}
        onEdit={() => setSelectedField(row.name)}
        onCancel={() => setSelectedField(null)}
        onSave={(value) => {
          setEditedValues((prev) => {
            const newValues = [...prev];
            newValues[submissionIndex] = {
              ...newValues[submissionIndex],
              [row.name]: value,
            };
            return newValues;
          });
          setSubmissionArray((prevData) => {
            if (prevData) {
              return prevData.map((submission, idx) => {
                if (idx === submissionIndex) {
                  return {
                    ...submission,
                    results: {
                      ...submission.results,
                      [row.name]: {
                        text: value,
                        confidence: 100,
                      },
                    },
                  };
                }
                return submission;
              });
            }
            return prevData;
          });
        }}
        textFormatter={(s) =>
          row.isError ? (
            <span className="error-text">
              <img
                className="error-tex margin-right-05"
                src={ErrorIcon}
                alt="error-icon"
              ></img>
              {s}
            </span>
          ) : (
            s
          )
        }
      />
    );
  };

  const ReviewComponent = () => {
    if (overallTable.length === 1) {
      return (
        <ReviewTable
          isSingle={overallTable.length === 1}
          hasErrors={hasErrors}
          overallConfidence={overallConfidence}
          confidenceVal={confidenceVal}
          errorCount={errorCount}
          resultsTable={resultsTable}
          maskShape={maskShape}
          images={images}
          index={index}
          setIndex={setIndex}
          labelConfidenceFormatter={labelConfidenceFormatter}
          editCellFormatter={editCellFormatter}
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          handleBack={handleBack}
          setImages={setImages}
          setIsReviewing={setIsReviewing}
          onDownload={onDownload}
        />
      );
    } else {
      return (
        <ReviewBulk
          resultsTable={overallTable}
          setSubmissionIndex={setSubmissionIndex}
          setIsReviewing={setIsReviewing}
          onDownload={onDownload}
        />
      );
    }
  };
  return (
    <>
      {!isReviewing ? (
        ReviewComponent()
      ) : (
        <ReviewTable
          isSingle={overallTable.length === 1}
          hasErrors={hasErrors}
          overallConfidence={overallConfidence}
          confidenceVal={confidenceVal}
          errorCount={errorCount}
          resultsTable={resultsTable}
          maskShape={maskShape}
          images={images}
          index={index}
          setIndex={setIndex}
          labelConfidenceFormatter={labelConfidenceFormatter}
          editCellFormatter={editCellFormatter}
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          handleBack={handleBack}
          setImages={setImages}
          setIsReviewing={setIsReviewing}
        />
      )}
    </>
  );
};

export default ReviewTemplate;
