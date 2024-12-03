import { ExtractStep } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import ExtractDataHeader from "../components/ExtractDataHeader";
import React from "react";
import { ExtractStepper } from "../components/ExtractStepper";
import { Divider } from "../components/Divider";

const SubmissionTemplate: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = () => {
    navigate("/");
  };

  const handleClose = () => {
    navigate("/");
  };

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
        <ExtractStepper currentStep={ExtractStep.Submit} />
      </div>
    </div>
  );
};

export default SubmissionTemplate;
