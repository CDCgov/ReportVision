import { ExtractStep } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ExtractDataHeader from "../components/ExtractDataHeader";
import React from "react";
import { ExtractStepper } from "../components/ExtractStepper";
import { Table } from "@trussworks/react-uswds";
import { Divider } from "../components/Divider";
import documentImage from "./SyphForm.png";

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
          <Table fullWidth striped>
            <thead>
              <tr>
                <th>Label</th>
                <th>Value</th>
                <th>Label CS</th>
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
          <img src={file_image} alt="Document" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default ReviewTemplate;
