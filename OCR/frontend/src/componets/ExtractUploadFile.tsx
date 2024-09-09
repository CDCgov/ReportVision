import React, { ChangeEvent, useEffect, useId, useState } from "react";
import { Icon, FileInput, Select } from "@trussworks/react-uswds";
import { useFiles } from "../contexts/FilesContext";

interface ExtractUploadFileProps {
  onUploadComplete: (isComplete: boolean) => void;
}

interface IFilesObj {
  files: File[];
}

interface Template {
  name: string;
  description: string;
  pages: {
    image: string;
    fieldNames: string[];
  }[];
}

export const ExtractUploadFile: React.FC<ExtractUploadFileProps> = ({
  onUploadComplete,
}) => {
  const id = useId();
  const { addFile } = useFiles();
  const [template, setTemplate] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Load templates from local storage, and if none are found, load test data
  const loadTemplatesFromLocalStorage = () => {
    const storedTemplates = localStorage.getItem("templates");
    if (storedTemplates) {
      const parsedTemplates = JSON.parse(storedTemplates);
      setTemplates(parsedTemplates);
    } else {
      loadTemplatesFromLocalStorageTestData();
    }
  };

  const loadTemplatesFromLocalStorageTestData = () => {
    const sampleTemplates: Template[] = [
      {
        name: "Test Template COVID",
        description: "This is the first sample template.",
        pages: [
          {
            image: "base64encodedimage1",
            fieldNames: ["patient_name", "patient_dob"],
          },
        ],
      },
      {
        name: "Test Template Syph",
        description: "This is the second sample template.",
        pages: [
          {
            image: "base64encodedimage2",
            fieldNames: ["patient_name", "address"],
          },
        ],
      },
    ];

    setTemplates(sampleTemplates);
  };

  useEffect(() => {
    loadTemplatesFromLocalStorage();
  }, []);

  const simulateFileUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        onUploadComplete(true);
        addFile(file);
      }
    }, 200);
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
      onUploadComplete(false);
    }
  };

  return (
    <div className="display-flex flex-column flex-align-center flex-justify-start height-full width-full padding-2 bg-primary-lighter">
      <div style={{ width: "70%", textAlign: "left" }}>
        <h1 style={{ margin: 0 }}>Choose template and upload new form</h1>
      </div>

      <div
        className="display-flex flex-column flex-justify-center flex-align-center"
        style={{ width: "70%" }}
      >
        <label
          htmlFor="template-select"
          className="usa-label"
          style={{ alignSelf: "flex-start" }}
        >
          Choose segmentation template
        </label>
        <Select
          id="template-select"
          name="template"
          value={template}
          onChange={handleTemplateChange}
          style={{ alignSelf: "flex-start", width: "100%", maxWidth: "300px" }}
        >
          {templates.length === 0 ? (
            <option value="">No templates available</option>
          ) : (
            templates.map((tpl, index) => (
              <option key={index} value={tpl.name}>
                {tpl.name}
              </option>
            ))
          )}
        </Select>
      </div>

      <div style={{ width: "70%", textAlign: "left" }}>
        <h2 style={{ margin: 10 }}>
          Upload new image or PDF to extract data from
        </h2>
      </div>

      <div
        data-testid="dashed-container"
        className="display-flex flex-column margin-top-205 flex-justify flex-align-center bg-white"
        style={{ width: "70%", height: "50%", border: "1px dashed #005ea2" }}
      >
        {!uploadedFile ? (
          <>
            <Icon.UploadFile
              data-testid="upload-icon"
              style={{ marginTop: "16px" }}
              size={5}
              color="#005ea2"
            />
            <div
              className="display-flex flex-column flex-align-center margin-bottom-1"
              style={{ width: "60%" }}
            >
              <h3 style={{ fontWeight: "bold" }}>Drag and drop file here</h3>
              <p>or</p>
              <FileInput
                onChange={handleChange}
                id={`file-input-${id}`}
                className="padding-bottom-1"
                style={{ border: "1px dashed #005ea2" }}
                name="file-input-single"
                chooseText="Browse Files"
                dragText="  "
              />
            </div>
          </>
        ) : (
          <div>
            <div className="display-flex flex-align-center margin-bottom-1">
              <Icon.FilePresent
                size={3}
                className="margin-right-1 text-primary"
              />
              <span className="margin-left-1 text-ink">
                {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                - {uploadProgress}%
              </span>
            </div>

            {uploadProgress >= 100 && (
              <div className="text-center margin-top-2 text-green">
                Upload complete!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtractUploadFile;
