import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FileInput,
  Header,
  Icon,
  StepIndicator,
  StepIndicatorStep,
} from "@trussworks/react-uswds";
import { useFiles } from "../contexts/FilesContext";
import { ChangeEvent, useId } from "react";

interface IFilesObj {
  files: File[];
}

const ExtractUpload = () => {
  const [template, setTemplate] = useState<string>("");
  const id = useId();
  const { addFile } = useFiles();
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);

  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const simulateFileUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploadComplete(true);
        addFile(file);
      }
    }, 200);
  };

  const handleSubmit = () => {
    navigate("/extract/process");
  };

  const handleTemplateChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTemplate(event.target.value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setUploadedFile(file);
      const filesObj: IFilesObj = { files: [file] };
      localStorage.setItem("files", JSON.stringify(filesObj));
      setUploadProgress(0);
      simulateFileUpload(file);
    }
  };

  return (
    <>
      <Header className="usa-header usa-header--basic padding-y-2">
        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-6 display-flex">
              <Button
                unstyled
                type="button"
                onClick={() => navigate("/")}
                className="usa-button usa-button--unstyled padding-right-1"
              >
                <Icon.Close size={3} />
              </Button>
              <h1 className="usa-header_title margin-1">Extract Data</h1>
            </div>
            <div className="grid-col-6 display-flex flex-justify-end flex-align-center">
              <Button
                type="button"
                onClick={() => navigate("/")}
                className="usa-button usa-button--outline margin-right-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isUploadComplete}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Header>

      <div className="grid-container">
        <div className="grid-row grid-gap">
          <div className="grid-col-12 display-flex flex-justify-center">
            <StepIndicator headingLevel="h5">
              <StepIndicatorStep label="Choose and upload" status="current" />
              <StepIndicatorStep label="Extract data" status="incomplete" />
              <StepIndicatorStep label="Review and edit" status="incomplete" />
              <StepIndicatorStep label="Submit data" status="incomplete" />
            </StepIndicator>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col-11 display-flex flex-column">
            <h2>Choose template and upload new form</h2>
          </div>
          <div className="grid-col-9 display-flex flex-justify-center">
            <label htmlFor="template-select" className="usa-label">
              Choose segmentation template
            </label>
          </div>

          <div className="grid-col-10 display-flex flex-justify-center">
            <select
              id="template-select"
              value={template}
              onChange={handleTemplateChange}
              className="usa-select"
              style={{ width: "100%", maxWidth: "300px" }}
            >
              <option value="">Select Template</option>
              <option value="COVID Quest V1">COVID Quest V1</option>
            </select>
          </div>

          <div className="grid-col-11 display-flex flex-justify-center margin-y-4">
            <div style={{ width: "70%", textAlign: "left" }}>
              <h2 style={{ margin: 0 }}>
                Upload new image or PDF to extract data from
              </h2>
            </div>
          </div>
        </div>

        <div className="grid-col-11 display-flex flex-justify-center">
          <div
            data-testid="dashed-container"
            className="usa-file-input padding-3 border-dashed border-base-light radius-md"
            style={{
              width: "70%",
              border: "1px dashed #005ea2",
            }}
          >
            {!uploadedFile ? (
              <>
                <Icon.UploadFile
                  data-testid="upload-icon"
                  style={{ marginTop: "10px" }}
                  size={5}
                  color="#005ea2"
                  className="text-primary"
                />
                <h3
                  className="margin-top-0 margin-bottom-1"
                  style={{ fontWeight: "bold" }}
                >
                  Drag and drop file here
                </h3>
                <p className="margin-top-0 margin-bottom-1">or</p>
                <FileInput
                  onChange={handleChange}
                  id={`file-input-${id}`}
                  className="padding-bottom-2"
                  name="file-input-single"
                  chooseText="Browse Files"
                  dragText="  "
                />
              </>
            ) : (
              <div className="width-full">
                <div className="display-flex flex-align-center margin-bottom-2">
                  <Icon.ArrowUpward
                    size={3}
                    className="margin-right-1 text-primary"
                  />
                  <span className="font-sans-sm">{uploadedFile.name}</span>
                  <span className="margin-left-1 text-base">
                    ({Math.round(uploadedFile.size / 1024)} KB)
                  </span>
                </div>
                <div className="usa-progress" style={{ height: "10px" }}>
                  <div
                    className="usa-progress__bar"
                    style={{
                      width: `${uploadProgress}%`,
                      backgroundColor: "#0050d8",
                    }}
                    role="progressbar"
                    aria-valuenow={uploadProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                <div className="text-right margin-top-1">{uploadProgress}%</div>
                {isUploadComplete && (
                  <div className="text-center margin-top-2 text-success">
                    Upload complete!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExtractUpload;
