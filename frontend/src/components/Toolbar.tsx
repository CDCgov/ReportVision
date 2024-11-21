import React, { useState } from 'react';
import PageNumber from './PageNumber';

import './Toolbar.scss';

interface ToolbarProps {
  initialPage?: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ initialPage = 1, totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onPageChange && onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onPageChange && onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="toolbar" data-testid="toolbar">
      <PageNumber
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};

export default Toolbar;