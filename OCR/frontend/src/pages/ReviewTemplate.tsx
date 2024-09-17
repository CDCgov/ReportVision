import { ExtractStep } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ExtractDataHeader from "../components/ExtractDataHeader";
import React from "react";
import { ExtractStepper } from "../components/ExtractStepper";
import { Table, Icon } from "@trussworks/react-uswds";
import { Divider } from "../components/Divider";
import documentImage from "./SyphForm.png"; //Please enter your file of choice here

interface Result {
  text: string;
  confidence: number;
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
        confidence: 98.75,
      },
      Patient_ID: {
        text: "12090546",
        confidence: 95.42,
      },
      Age: {
        text: "5",
        confidence: 97.1,
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

  //fallback if no valid template is available can edit if needed
  if (!submissionData) {
    return <div>No submission Data</div>;
  }

  const { file_image, results } = submissionData;

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
              <Icon.Star
                aria-hidden={true}
                className="text-primary margin-right-1"
              />
              <span className="font-sans-md font-weight-semibold">
                Overall confidence score (CS):
                <span className="text-green margin-left-05">96%</span>
              </span>
              <Icon.Help aria-hidden={true} className="margin-left-1" />
            </div>
            <p className="font-sans">
              Review and edit errors before you submit.
            </p>
            <div className="display-flex flex-align-center text-error">
              <span className="font-sans-sm margin-right-1">Errors: 1</span>
              <Icon.Warning className="text-error" />
            </div>
          </div>

          <Table fullWidth striped>
            <thead>
              <tr>
                <th>Label</th>
                <th>Value</th>
                <th>Label Confidence</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value.text}</td>
                  <td>{value.confidence}%</td>
                </tr>
              ))}
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
