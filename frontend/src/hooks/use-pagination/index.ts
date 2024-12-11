import { useState, useMemo } from "react";


const usePagination = <T>(items: T[] = [], itemsPerPage = 10, initialPage = 1) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
  
    // Calculate total number of pages
    const totalPages = useMemo(() => 
      Math.ceil(items.length / itemsPerPage),
      [items.length, itemsPerPage]
    );
  
    // Ensure current page stays within bounds
    useMemo(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages || 1);
      }
    }, [currentPage, totalPages]);
  
    // Get current page items
    const currentItems = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return items.slice(startIndex, endIndex);
    }, [items, currentPage, itemsPerPage]);
  
    // Navigation functions
    const goToPage = (pageNumber: number) => {
      const page = Math.max(1, Math.min(pageNumber, totalPages));
      setCurrentPage(page);
    };
  
    const nextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    };
  
    const previousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    };
  
    const firstPage = () => {
      setCurrentPage(1);
    };
  
    const lastPage = () => {
      setCurrentPage(totalPages);
    };
  
    // Generate page numbers for pagination display
    const getPageNumbers = (maxVisible = 5) => {
      const pages = [];
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
      // Adjust start page if end page is maxed out
      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
  
      return pages;
    };
  
    return {
      currentPage,
      currentItems,
      totalPages,
      itemsPerPage,
      goToPage,
      nextPage,
      previousPage,
      firstPage,
      lastPage,
      getPageNumbers,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  };

export default usePagination;