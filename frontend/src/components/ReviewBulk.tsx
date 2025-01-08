import { useNavigate } from "react-router-dom";
import { ExtractStep } from "../utils/constants";
import { Divider } from "./Divider";
import ExtractDataHeader from "./ExtractDataHeader";
import { ExtractStepper } from "./ExtractStepper";

import ErrorIcon from "../assets/error_icon.svg";
import { SortableTable } from "./SortableTable/SortableTable";

import "./ReviewBulk.scss";
import { Button, Icon } from "@trussworks/react-uswds";
import ErrorBanner from "../error/ErrorBanner";
import { useError } from "../contexts/ErrorContext";

interface ReviewBulkProps {
  resultsTable: ReviewBulk[];
  setSubmissionIndex: (index: number) => void;
  setIsReviewing: (isReviewing: boolean) => void;
  onDownload: () => void;
}

interface Row {
  index: number;
  name: string;
  confidence: number;
  errors: number;
  pageCount: number;
}

interface ReviewBulk extends Row {
  index: number;
}

const ReviewBulk = ({
  resultsTable,
  setSubmissionIndex,
  setIsReviewing,
  onDownload,
}: ReviewBulkProps) => {
  const navigate = useNavigate();
  const { error } = useError();

  const onClick = (index: number) => {
    setIsReviewing(true);
    setSubmissionIndex(index);
  };

  const rowFormatter = (d: string, _idx: number, row: Row) => {
    return <span onClick={() => onClick(row.index)}>{d}</span>;
  };

  const errorIconCellFormatter = (
    d: unknown | string,
    _idx: number,
    row: Row,
  ) => {
    return row.errors > 0 ? (
      <span onClick={() => onClick(row.index)} className="error-text">
        <img
          className="error-text margin-right-05"
          src={ErrorIcon}
          alt="error-icon"
        ></img>
        {d}
      </span>
    ) : (
      d
    );
  };

  const errorCellFormatter = (d: string, _idx: number, row: Row) => {
    return (
      <span
        onClick={() => onClick(row.index)}
        className={row.errors > 0 ? "error-text" : ""}
      >
        {d}
      </span>
    );
  };

  const handleCSVDownload = () => {
    try {
      onDownload();
      navigate("/");
    } catch (error) {
      console.error("Error downloading CSV", error);
    }

  }

  return (
    <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
      <ExtractDataHeader
        hasSubmit={false}
        onSubmit={() => {}}
        onExit={() => navigate("/")}
        onBack={() => navigate("/extract/upload")}
        isUploadComplete={false}
      />
      <Divider margin="0px" />
      <div className="display-flex flex-justify-center padding-top-4">
        <ExtractStepper currentStep={ExtractStep.Review} />
      </div>
      <div className="display-flex flex-column bg-primary-lighter width-full height-full flex-align-center">
        <div className="display-flex flex-column content-container">
          <h2>Bulk data extracted</h2>
          <p className="bulk-copy">
            Here is your batch export. Please <strong>review all</strong> forms
            and correct any items with a low confidence score (CS) before
            downloading.
          </p>
          <div className="table-container">
            <div className="width-full display-flex flex-justify review-template-header flex-align-center">
              <h3 className="bulk-header">Data Validation</h3>
              <Button
                className="csv display-flex flex-align-center"
                disabled={
                  resultsTable.reduce((sum, result) => result.errors + sum, 0) >
                  0
                }
                type="button"
                onClick={handleCSVDownload}
              >
                <Icon.FileDownload className="csv-icon" />
                Download CSV
              </Button>
            </div>
            {error?.title && <div><ErrorBanner title={error.title} message={error.message} /></div>}
            <div className="table-div">
              <SortableTable
                columns={["fileName", "pageCount", "errors", "confidence"]}
                data={resultsTable}
                sortableBy={["fileName", "pageCount", "errors", "confidence"]}
                defaultSort={"errors"}
                columnNames={{
                  fileName: "Name",
                  pageCount: "Page Count",
                  errors: "Errors",
                  confidence: "CS",
                }}
                formatters={{
                  errors: errorIconCellFormatter,
                  pageCount: errorCellFormatter,
                  confidence: errorCellFormatter,
                  fileName: rowFormatter,
                }}
              />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBulk;
