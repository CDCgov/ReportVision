import { Button } from "@trussworks/react-uswds";
import { ChangeEvent, useEffect, useId } from "react";
import { FileInput } from "./FileInput";
import { useFiles } from "../contexts/FilesContext";
import { useNavigate } from "react-router-dom";

import "./UploadFile.scss";

interface IFilesObj {
  files: File[];
}

export const Uploadfile = () => {
  const id = useId();
  const { addFile, files, clearFiles } = useFiles();
  const navigate = useNavigate();

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
    }
  }

  const onBack = () => {
    navigate("/new-template");
    clearFiles();
  };

  const onSubmit = () => {
    navigate("/new-template/annotate");
  };

  useEffect(() => {
    return () => clearFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="display-flex flex-column flex-align-center flex-justify-start height-full width-full padding-2 bg-primary-lighter">
      <div className="upload-file-header-content-container">
        <h1 className="upload-file-header">Upload new file to annotate</h1>
        <p>
          You can upload new lab files (PDF s or images) to annotate and save as
          a template. Annotation is the process of marking and labeling specific
          areas of an image to identify key elements or features.
        </p>
        <p className="upload-file-instructions">Select one file</p>
        <div
          data-testid="dashed-container"
          className={`width-full height-full bg-white dashed-container ${files.length === 0 ? "dashed-container-preupload" : "dashed-container-upload"}`}
        >
          <div className="display-flex flex-column flex-align-center width-full height-full">
            <FileInput
              onChange={handleChange}
              id={`file-input-${id}`}
              className="padding-bottom-2"
              name="file-input-single"
              chooseText=" choose from folder"
              dragText="Drag files here or"
            />
          </div>
        </div>
        <div className="display-flex flex-jusitfy-start flex-align-center">
          <Button
            className="upload-back-button"
            onClick={onBack}
            type="reset"
            outline
          >
            Cancel Import
          </Button>
          <Button
            className="upload-annotate-button"
            onClick={onSubmit}
            type="submit"
            disabled={files.length === 0}
          >
            Annotate
          </Button>
        </div>
      </div>
    </div>
  );
};
