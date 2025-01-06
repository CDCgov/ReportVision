import React from "react";
import { Icon } from "@trussworks/react-uswds";

import "./PageNumber.scss";

interface PageNumberProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const PageNumber: React.FC<PageNumberProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="page-number" data-testid="page-number">
      <span className="page-number__text" data-testid="page-number-text">
        Page
      </span>
      <button
        disabled={totalPages === 1 || currentPage === 1}
        className="page-number__button"
        onClick={onPrevious}
        data-testid="page-number-previous"
      >
        <Icon.NavigateBefore size={8} />
      </button>
      <input
        type="text"
        value={currentPage}
        className="page-number__input"
        readOnly
        data-testid="page-number-input"
      />
      <span className="page-number__text" data-testid="page-number-total">
        of {totalPages}
      </span>
      <button
        disabled={totalPages === 1 || currentPage === totalPages}
        className="page-number__button"
        onClick={onNext}
        data-testid="page-number-next"
      >
        <Icon.NavigateNext size={7} />
      </button>
    </div>
  );
};

export default PageNumber;
