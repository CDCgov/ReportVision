import React, { ChangeEvent, useEffect, useId, useState } from "react";
import { Button, Select } from "@trussworks/react-uswds";
import { useFiles } from "../contexts/FilesContext";
import { useNavigate } from "react-router-dom";
import image from "../assets/green_check.svg";
import errorIcon from "../assets/error_icon.svg";

import * as pdfjsLib from "pdfjs-dist";

import "./ExtractUploadFile.scss";
import { FileInput } from "./FileInput/file-input";
import { TemplateAPI } from "../types/templates.ts";
import { useQuery } from "@tanstack/react-query";
import ErrorBanner from "../error/ErrorBanner.tsx";
import { ERRORS, useError } from "../contexts/ErrorContext.tsx";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface ExtractedFiles {
  file: string;
  images: string[];
}

interface ExtractUploadFileProps {
  onUploadComplete: (isComplete: boolean) => void;
}

interface IFilesObj {
  files: File[];
}

interface Template {
  name: string;
  condition: string;
  facility: string;
  pages: {
    image: string;
    fieldNames: string[];
  }[];
}

export const ExtractUploadFile: React.FC<ExtractUploadFileProps> = ({
  onUploadComplete,
}) => {
  const id = useId();
  const {
    addFile,
    files,
    setSelectedTemplates,
    selectedTemplates,
    clearTemplates,
    clearFiles,
  } = useFiles();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const { error, setError } = useError();
  const [extractedImages, setExtractedImages] = useState<ExtractedFiles[]>([]);
  const _templates =
    useQuery({
      queryKey: ["templates"],
      queryFn: TemplateAPI.getTemplates,
    }).data || [];
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File[]>([]);

  const loadTemplatesTestData = () => {
    const sampleTemplates: Template[] = [
      {
        name: "Test Template COVID",
        pages: [
          {
            image: "base64encodedimage1",
            fieldNames: ["patient_name", "patient_dob"],
          },
        ],
        condition: "covid",
        facility: "texas"
      },
      {
        name: "Test Template Syph",
        pages: [
          {
            image: "base64encodedimage2",
            fieldNames: ["patient_name", "address"],
          },
        ],
        condition: "covid",
        facility: "texas"
      },
    ];
    setTemplates(sampleTemplates);
  };

  useEffect(() => {
    // Load templates from local storage, and if none are found, load test data
    const loadTemplatesFromLocalStorage = () => {
      const storedTemplates = localStorage.getItem("templates");
      if (_templates.length > 0) {
        setTemplates(_templates);
      } else if (storedTemplates) {
        const parsedTemplates = JSON.parse(storedTemplates);
        setTemplates(parsedTemplates);
      } else {
        loadTemplatesTestData();
      }
    };
    loadTemplatesFromLocalStorage();
  }, []);
  const simulateFileUpload = async (files: File[]) => {
    onUploadComplete(true);
    files.forEach((file) => addFile(file));
    try {
      const convertedFiles = await Promise.all(
        files.map(async (file) => {
          // the obj pdfjsLib is being really stubbon on github actions and failing to load the worker
          const convertPdfToImages = async (file: File) => {
            const localImages: string[] = [];
            const data = URL.createObjectURL(file);
            const pdf = await pdfjsLib.getDocument(data).promise;
            const canvas = document.createElement("canvas");
            for (let i = 0; i < pdf.numPages; i++) {
              const page = await pdf.getPage(i + 1);
              const viewport = page.getViewport({ scale: 1 });
              const context = canvas.getContext("2d")!;
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              await page.render({ canvasContext: context, viewport: viewport })
                .promise;
              localImages.push(canvas.toDataURL());
            }
            canvas.remove();
            URL.revokeObjectURL(data);
            return localImages;
          };
          const images = await convertPdfToImages(file);
          return {
            file: file.name,
            images: images.map((image) => image),
          };
        }),
      );
      localStorage.setItem(
        "extracted_images_uploaded",
        JSON.stringify(convertedFiles),
      );
      setExtractedImages(convertedFiles);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        setUploadedFile([]);
        clearFiles();
        setHasError(false);
      }
      setUploadedFile(files);
      const filesObj: IFilesObj = { files };
      localStorage.setItem("files", JSON.stringify(filesObj));
      simulateFileUpload(files);
      onUploadComplete(false);
      if (!isUploadComplete && uploadedFile.length > 0) {
        setIsUploadComplete(true);
      }
    }
  };

  const handleSelect = (
    templateName: string,
    fileName: string,
    index: number,
  ) => {
    const template = { templateName, fileName };
    setSelectedTemplates(template, index);
    const tempSelectedTemplates = [...selectedTemplates];
    if (selectedTemplates.length > 0) {
      if (index < tempSelectedTemplates.length) {
        tempSelectedTemplates[index] = template;
      } else if (index === tempSelectedTemplates.length) {
        tempSelectedTemplates.push(template);
      }

      const localErr = tempSelectedTemplates.some((template) => {
        const tempplate = templates.find(
          (tpl) => tpl.name === template.templateName,
        );
        const extractedImage = extractedImages.find(
          (img) => img.file === template.fileName,
        );
        return tempplate?.pages.length !== extractedImage?.images.length;
      });
      if (localErr) {
        setError(ERRORS.MISMATCH_ERROR);
      } else {
        setError(null);
      }
    }

    if (selectedTemplates.length === 0) {
      const checkTemplate = templates.find((tpl) => tpl.name === templateName);
      const extractedImage = extractedImages.find(
        (img) => img.file === fileName,
      );
      const localErr =
        checkTemplate?.pages.length !== extractedImage?.images.length;
      if (localErr) {
        setError(ERRORS.MISMATCH_ERROR);
      } else {
        setError(null);
      }
    }
  };

  const onCancel = () => {
    navigate("/");
    clearTemplates();
    clearFiles();
  };
  return (
    <div className="display-flex flex-column flex-align-start flex-justify-start height-full width-full padding-2 bg-primary-lighter">
      <div className="extract-upload-header">
        <h2>Upload new image or PDF to extract data from</h2>
        <p>
          You can import files individually or in bulk for data extraction as
          either as PDFs or images. PDFs will automatically be converted to
          images upon import.
        </p>
        <p className="helper-text">Select one or more files</p>
      </div>
      {error?.title && (
        <ErrorBanner 
          title={error.title}
          message={error.message} />
      )}
      <div
        data-testid="dashed-container"
        className={`display-flex flex-column margin-top-205 flex-justify-center flex-align-center bg-white dashed-container ${uploadedFile.length > 0 ? "dashed-container-uploaded" : ""}`}
      >
        {uploadedFile.length > 0 && (
          <div className="display-flex flex-column flex-justify-center flex-align-center select-container width-full">
            <div className="select-label-container">
              <label
                htmlFor="template-select"
                className="usa-label margin-left-2"
                style={{ alignSelf: "flex-start" }}
              >
                {uploadedFile.length} file(s) selected
              </label>
                <FileInput
                  hidePreview
                  accept=".pdf"
                  multiple
                  onChange={handleChange}
                  id={`file-input-multiple-${id}-2`}
                  className="padding-bottom-1"
                  name="file-input-multiple"
                  chooseText="Change file(s)"
                  dragText=" "
                />
            </div>
            <div
              className="display-flex flex-column width-full height-full margin-bottom-2 margin-top-1"
              style={{ justifyContent: "space-between" }}
            >
              {files.map((file, index) => {
                const extractedImage = extractedImages.find(
                  (img) => img.file === file.name,
                );
                const getPageCheck = () => {
                  if (
                    Array.isArray(selectedTemplates) &&
                    selectedTemplates.length > 0
                  ) {
                    const template = templates.find(
                      (tpl) =>
                        tpl.name === selectedTemplates[index]?.templateName,
                    );
                    return (
                      template?.pages.length === extractedImage?.images.length
                    );
                  }
                  return false;
                };
                const getImage = () => {
                  if (selectedTemplates.length > 0) {
                    const check = getPageCheck();
                    return check ? image : errorIcon;
                  }

                  return image;
                };

                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="display-flex width-full height-8"
                  >
                    <div className="display-flex width-full height-full flex-align-center">
                      {selectedTemplates.length > 0 && (
                        <img
                          height="24px"
                          width="24px"
                          src={getImage()}
                          alt="status-icon"
                          className="margin-left-2"
                        />
                      )}
                      {!getPageCheck() && selectedTemplates.length > 0 && (
                        <span className="error-text">Mismatch error</span>
                      )}

                      <span className="margin-left-1 text-ink">
                        {files.length > 0 ? file.name : "default name"}
                      </span>
                    </div>
                    <Select
                      id="template-select"
                      key={index}
                      className="template-select margin-right-2"
                      name="template"
                      value={
                        selectedTemplates[index]?.templateName ||
                        "Select template"
                      }
                      onChange={(e) =>
                        handleSelect(e.target.value, file.name, index)
                      }
                    >
                      {templates.length === 0 ? (
                        <option value="">No templates available</option>
                      ) : (
                        [
                          <option key="default-opt" value={"Select temlate"}>
                            Select template
                          </option>,
                          ...templates.map((tpl, index) => (
                            <option key={index} value={tpl.name}>
                              {tpl.name}
                            </option>
                          )),
                        ]
                      )}
                    </Select>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {uploadedFile.length === 0 && (
          <>
            <div
              className="display-flex flex-column flex-align-center flex-justify-center margin-bottom-1"
              style={{ width: "80%" }}
            >
              <FileInput
                accept=".pdf"
                multiple
                onChange={handleChange}
                id={`file-input-multiple-${id}-1`}
                className="padding-bottom-1 extract-file-input"
                name="file-input-multiple"
                chooseText=" "
                dragText="Drag file(s) here or choose from folder"
              />
            </div>
          </>
        )}
      </div>
      <div className="display-flex margin-top-3">
        <Button
          type="button"
          outline
          className="margin-right-1"
          onClick={onCancel}
        >
          Cancel Import
        </Button>
        <Button
          type="button"
          className="usa-button display-flex flex-align-center margin-left-auto margin-right-auto"
          disabled={
            uploadedFile.length === 0 ||
            selectedTemplates.length !== uploadedFile.length
          }
          onClick={() => navigate("/extract/process")}
        >
          Extract Data
        </Button>
      </div>
    </div>
  );
};

export default ExtractUploadFile;
