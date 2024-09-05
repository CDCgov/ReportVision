import { useNavigate } from "react-router-dom";
import ExtractDataHeader from "../componets/ExtractDataHeader";
import { Divider } from "../componets/Divider";
import { ExtractStep } from "../utils/constants";
import { ExtractUploadFile } from "../componets/ExtractUploadFile";
import { ExtractStepper } from "../componets/ExtractStepper";
import { useState } from "react";

const ExtractUpload = () => {
  const navigate = useNavigate();
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);

  const handleUploadComplete = (isComplete: boolean) => {
    setIsUploadComplete(isComplete);
  };

  return (
    <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
      <ExtractDataHeader
        onBack={() => navigate("/")}
        onSubmit={() => navigate("/extract/process")}
        isUploadComplete={isUploadComplete}
      />
      <Divider margin="0px" />
      <div className="display-flex flex-justify-center padding-top-4">
        <ExtractStepper currentStep={ExtractStep.Upload} />
      </div>
      <Divider margin="0px" />
      <div className="display-flex flex-column flex-justify-center width-full height-full">
        <Divider margin="0px" />
        <ExtractUploadFile onUploadComplete={handleUploadComplete} />
      </div>
    </div>
  );
};

export default ExtractUpload;
