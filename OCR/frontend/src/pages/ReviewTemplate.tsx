import { Divider } from "../components/Divider";
import { ExtractStep } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ExtractDataHeader from "../components/ExtractDataHeader";
import React from "react";
import { ExtractStepper } from "../components/ExtractStepper";

const ReviewTemplate: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/ocr-result")
      .then((response) => response.json())
      .then(() => {});
  }, []);

  const handleBack = () => {
    navigate("/extract/upload");
  };

  const handleSubmit = () => {
    navigate("/extract/submit");
  };

  return (
    <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
      <ExtractDataHeader
        onBack={handleBack}
        onSubmit={handleSubmit}
        isUploadComplete={true}
      />
      <Divider margin="0px" />
      <div className="display-flex flex-justify-center padding-top-4">
        <ExtractStepper currentStep={ExtractStep.Review} />
      </div>
      <Divider margin="0px" />
    </div>
  );
};

export default ReviewTemplate;
