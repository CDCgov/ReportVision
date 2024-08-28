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

  const navigate = useNavigate();

  const handleTemplateChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTemplate(event.target.value);
  };

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target?.files?.length > 0) {
      const fileList = event.target.files;
      const filesObj: IFilesObj = { files: [] };
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        filesObj["files"].push(file);
      }
      localStorage.setItem("files", JSON.stringify(filesObj));
      addFile(event.target?.files[0]);
      navigate("/new-template/annotate");
    }
  }

  return (
    <div>
      <Header className="padding-y-2">
        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-6 display-flex">
              <Button
                unstyled
                type="button"
                onClick={() => navigate("/")}
                className="padding-right-1"
              >
                <Icon.Close size={3} color="black" />
              </Button>
              <h1 className="margin-0">Extract Data</h1>
            </div>
            <div className="grid-col-6 display-flex flex-justify-end flex-align-center">
              <Button
                type="button"
                onClick={() => navigate("/")}
                className="margin-right-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => handleChange}
                disabled={!template}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Header>

      <div className="grid-container">
        <div className="grid-row">
          <div className="grid-col-12 display-flex flex-justify-center margin-y-4">
            <StepIndicator headingLevel="h5">
              <StepIndicatorStep label="Choose and upload" status="current" />
              <StepIndicatorStep label="Extract data" status="incomplete" />
              <StepIndicatorStep label="Review and edit" status="incomplete" />
              <StepIndicatorStep label="Submit data" status="incomplete" />
            </StepIndicator>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col-11 display-flex flex-column ">
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

          <div className="grid-col-10 display-flex flex-justify-center">
            <div
              data-testid="dashed-container"
              className="display-flex  flex-align-center"
              style={{
                width: "70%",
                height: "40%",
                border: "1px dashed  #005ea2",
              }}
            >
              <Icon.UploadFile
                data-testid="upload-icon"
                style={{ marginTop: "16px" }}
                size={5}
                color="#005ea2"
              />
              <div
                className="display-flex flex-column margin-top-205 flex-justify flex-align-center"
                style={{ width: "60%" }}
              >
                <h3 style={{ fontWeight: "bold" }}>Drag and drop file here</h3>
                <p>or</p>
                <FileInput
                  onChange={handleChange}
                  id={`file-input-${id}`}
                  className="padding-bottom-2"
                  style={{ border: "1px dashed #005ea2" }}
                  name="file-input-single"
                  chooseText="Browse Files"
                  dragText="  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractUpload;
