/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon, Button } from "@trussworks/react-uswds";
import { ExtractStep } from "../utils/constants";
import { Divider } from "./Divider";
import { ExtractDataHeader } from "./ExtractDataHeader";
import { ExtractStepper } from "./ExtractStepper";
import { SortableTable } from "./SortableTable/SortableTable";
import aiIconUrl from "../assets/ai_icon.svg";
import ErrorIcon from "../assets/error_icon.svg";
import { useNavigate } from "react-router-dom";

import "./ReviewTable.scss";
import Toolbar from "./Toolbar";
import ErrorBanner from "../error/ErrorBanner";
import { useError } from "../contexts/ErrorContext";

interface ReviewTableProps {
  isSingle: boolean;
  index: number;
  images: string[];
  hasErrors: boolean;
  overallConfidence: string | number;
  confidenceVal: string | number;
  errorCount: number;
  resultsTable: ResultsTable[];
  labelConfidenceFormatter: any;
  editCellFormatter: any;
  maskShape: any;
  setImages: (images: string[]) => void;
  setIndex: (index: number) => void;
  handleSubmit: () => void;
  handleClose: () => void;
  handleBack: () => void;
  setIsReviewing: (isReviewing: boolean) => void;
  onDownload?: () => void;
}

interface ResultsTable {
  index: number;
  name: string;
  value: any;
  confidence: number;
  isError: boolean;
  isEdited: boolean;
}

const ReviewTable = ({
  isSingle,
  hasErrors,
  overallConfidence,
  confidenceVal,
  errorCount,
  resultsTable,
  labelConfidenceFormatter,
  editCellFormatter,
  maskShape,
  index,
  images,
  setIndex,
  handleSubmit,
  handleBack,
  handleClose,
  setIsReviewing,
  onDownload,
}: ReviewTableProps) => {
  const navigate = useNavigate();
  const { error } = useError();
  const handleImageChange = (index: number) => {
    setIndex(index);
  };

  return (
    <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
      <ExtractDataHeader
        hasSubmit={false}
        onSubmit={handleSubmit}
        onExit={handleClose}
        onBack={handleBack}
        isUploadComplete={!(errorCount > 0)}
      />
      <Divider margin="0px" />
      <div className="display-flex flex-justify-center padding-top-4 review-border border-bottom">
        <ExtractStepper currentStep={ExtractStep.Review} />
      </div>

      <div className="display-flex flex-justify-between information-display">
        <div className="width-50 height-full table-container-half">
          <div className="display-flex flex-column review-template-header-container">
            <h2>Extracted Data</h2>
            <span className="font-sans-md font-weight-semibold display-flex flex-align-center">
              <img src={aiIconUrl} alt="ai-icon" aria-hidden="true"></img>
              <b> Overall confidence score (CS): </b>
              <span
                className={`text-black margin-left-05 ${
                  Number(overallConfidence) < Number(confidenceVal)
                    ? "text-error"
                    : "text-success-confidence"
                }`}
              >
                {overallConfidence}%
              </span>
              <div className="custom-tooltip-container display-flex flex-align-center">
                <Icon.Help aria-hidden={true} />
                <span className="custom-tooltip-text">
                  Overall Confidence Score is the average of all Individual
                  Confidence Scores.
                </span>
              </div>
            </span>
            <p className="font-sans">
              Review and edit errors before you submit.
            </p>
            <div className="display-flex flex-align-center error-text">
              {hasErrors && (
                <>
                  <span className="font-sans-sm margin-right-1">
                    Errors: {errorCount}
                  </span>
                  <img src={ErrorIcon} alt="Error Icon" aria-hidden={true} />
                </>
              )}
            </div>
          </div>

          <div className="table-group-container display-flex flex-column">
            <div className="display-flex flex-align-center width-full review-template-header-outer">
              <div className="width-full display-flex flex-justify review-template-header flex-align-center">
                <h3>Data Validation</h3>
                {isSingle && (
                  <Button
                    className="csv display-flex flex-align-center"
                    disabled={errorCount > 0}
                    type="button"
                    onClick={onDownload}
                  >
                    <Icon.FileDownload className="csv-icon" />
                    Download CSV
                  </Button>
                )}
              </div>
            </div>
           {error?.title && <ErrorBanner title={error.title} message={error.message} />}
            <div className="table-container">
              <SortableTable
                columns={["name", "value", "confidence"]}
                data={resultsTable}
                sortableBy={["name", "confidence", "value"]}
                defaultSort={"confidence"}
                columnNames={{
                  name: "Label",
                  value: "Value",
                  isError: " ",
                  confidence: "Label CS",
                }}
                formatters={{
                  confidence: labelConfidenceFormatter,
                  value: editCellFormatter,
                }}
              />
            </div>
          </div>

          <div className="display-flex flex-align-center review-button-container">
            <Button
              className="extract-button-reset"
              onClick={() => navigate("/extract/upload")}
              type="reset"
              outline
            >
              Cancel
            </Button>
            <Button
              className="extract-button-submit"
              onClick={
                isSingle ? () => navigate("/") : () => setIsReviewing(false)
              }
              type="submit"
              disabled={errorCount > 0}
            >
              Done
            </Button>
          </div>
        </div>
        <div className="image-container">
          <Toolbar className="toolbar-borders" totalPages={images.length} onPageChange={(index) => handleImageChange(index - 1)} />
          <div className=" height-full width-full padding-2">
            <div className="width-full bg-white">
              {images.map((image, innerIndex) => (
                <svg
                  style={{ display: innerIndex !== index ? "none" : "initial" }}
                  viewBox="0 0 612 720"
                  key={innerIndex}
                >
                  <image
                    result="photo"
                    href={image}
                    preserveAspectRatio="xMidYMid slice"
                  ></image>
                  <polygon points={maskShape} stroke="blue" fill="none" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTable;
