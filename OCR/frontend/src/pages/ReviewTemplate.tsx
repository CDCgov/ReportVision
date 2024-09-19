import { ExtractStep } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ExtractDataHeader from "../components/ExtractDataHeader";
import React from "react";
import { ExtractStepper } from "../components/ExtractStepper";
import { Table, Icon, Tooltip } from "@trussworks/react-uswds";
import { Divider } from "../components/Divider";
import documentImage from "./SyphForm.png"; //Please enter your file of choice here
import "./ReviewTemplate.scss";
import aiIconUrl from "../assets/ai_icon.svg";

interface Result {
  text: string;
  confidence: number;
  edited?: boolean;
}

interface SubmissionData {
  template_name: string;
  file_image: string;
  results: {
    [key: string]: Result;
  };
}

const ReviewTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(
    null
  );

  const fakeData = {
    template_name: "Syph Template",
    file_image: documentImage,
    results: {
      Name: {
        text: "TESTPATIENT,13",
        confidence: 97,
      },
      Patient_ID: {
        text: "12090546",
        confidence: 98,
      },
      DrawLocation: {
        text: "BH_1Diamondd_LAB",
        confidence: 56,
      },
    },
  };

  useEffect(() => {
    const data = localStorage.getItem("submission");
    if (data) {
      setSubmissionData(JSON.parse(data));
    } else {
      // use fakedata if no data
      setSubmissionData(fakeData);
    }
  }, []);

  const handleBack = () => {
    navigate("/extract/upload");
  };

  const handleSubmit = () => {
    navigate("/extract/submit");
  };

  const handleClose = () => {
    navigate("/");
  };

  const calculateOverallConfidence = () => {
    if (!submissionData) return 0;
    const results = Object.values(submissionData.results);
    const totalConfidence = results.reduce((sum, result) => {
      return sum + (result.edited ? 100 : result.confidence);
    }, 0);
    return (totalConfidence / results.length).toFixed(2);
  };

  //fallback if no valid template is available can edit if needed
  if (!submissionData) {
    return <div>No submission Data</div>;
  }

  const { file_image, results } = submissionData;
  const confidenceVal = 75;

  const errorCount = Object.values(results).filter(
    (r) => r.confidence <= confidenceVal
  ).length;
  const hasErrors = errorCount > 0;
  const overallConfidence = calculateOverallConfidence();

  return (
    <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
      <ExtractDataHeader
        onSubmit={handleSubmit}
        onExit={handleClose}
        onBack={handleBack}
        isUploadComplete={true}
      />
      <Divider margin="0px" />
      <div className="display-flex flex-justify-center padding-top-4">
        <ExtractStepper currentStep={ExtractStep.Review} />
      </div>

      <div className="display-flex flex-justify-between padding-top-4">
        <div className="width-50">
          <div className="margin-top-2 margin-bottom-1">
            <div className="display-flex flex-align-center">
              <h3>Extracted Data</h3>
            </div>
            <div className="display-flex flex-align-center">
              <img src={aiIconUrl} alt="AI Icon" aria-hidden={true} />
              <span className="font-sans-md font-weight-semibold">
                <b> Overall confidence score (CS): </b>
                <span
                  className={`text-black margin-left-05 ${
                    Number(overallConfidence) < Number(confidenceVal)
                      ? "text-error"
                      : "text-success"
                  }`}
                >
                  {overallConfidence}%
                </span>
              </span>
              <Tooltip
                label="Overall Confidence Score is the average of all Individual Confidence Scores."
                style={{
                  padding: "4px",
                }}
              >
                <Icon.Help aria-hidden={true} />
              </Tooltip>
            </div>
            <p className="font-sans">
              Review and edit errors before you submit.
            </p>
            <div className="display-flex flex-align-center text-error">
              {hasErrors && (
                <>
                  <span className="font-sans-sm margin-right-1">
                    Errors: {errorCount}
                  </span>
                  <Icon.Warning className="text-error" />
                </>
              )}
            </div>
          </div>

          <Table fullWidth striped>
            <thead>
              <tr>
                <th>Label</th>
                <th>Value</th>
                <th></th>
                <th>Label Confidence</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results).map(([key, value]) => {
                const isError = value.confidence <= confidenceVal;
                return (
                  <tr key={key}>
                    <td>{key}</td>
                    <td className={`${isError ? "usa-input--error" : ""}`}>
                      {value.text}
                    </td>
                    <td>
                      {isError && <Icon.Warning className="text-error" />}
                    </td>
                    <td className={`${isError ? "usa-input--error" : ""}`}>
                      {`${value.confidence}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="width-50">
          <div
            style={{
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            <img
              src={documentImage}
              alt={file_image}
              style={{
                width: "90",
                transform: "scale(0.95)",
                transformOrigin: "top left",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTemplate;
