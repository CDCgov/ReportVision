import { useNavigate } from "react-router-dom";
import ExtractDataHeader from "../components/ExtractDataHeader";
import { Divider } from "../components/Divider";
import { ExtractStep } from "../utils/constants";
import { ExtractUploadFile } from "../components/ExtractUploadFile";
import { ExtractStepper } from "../components/ExtractStepper";
import { useEffect, useState } from "react";
import VerticalStepper from "../components/VerticalStepper";
import { useFiles } from "../contexts/FilesContext";

import "./ExtractUpload.scss";

const ExtractUpload = () => {
  const navigate = useNavigate();
  const { files, clearFiles } = useFiles();
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);

  const handleUploadComplete = (isComplete: boolean) => {
    setIsUploadComplete(isComplete);
  };
  
  useEffect(() => {
    if (files.length > 0) {
      setCurrentIndex(1);
    }

    return () => {
      setCurrentIndex(0);
    }
  }, [files.length])

  return (
    <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
      <ExtractDataHeader
        onBack={() => {navigate("/"); clearFiles();}}
        onExit={() => {navigate("/"); clearFiles();}}
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
        <div className="display-flex flex-row flex-justify-center width-full height-full">
        <div className="display-flex flex-column flex-align-center height-full bg-primary-lighter vertical-stepper-container">
            <VerticalStepper steps={[
                { label: 'Upload' },
                { label: 'Select templates'},
              ]}
              currentStep={currentIndex}
            />
          </div>
          <div className="display-flex flex-column flex-justify-center height-full width-full">
            <ExtractUploadFile onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractUpload;
