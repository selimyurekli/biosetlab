import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const getPages = () => {
    const pages = [];
    const maxPagesToShow = 5; // The maximum number of page buttons to display (not counting prev/next)

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Determine the start and end pages
      let startPage = Math.max(currentPage - 2, 1);
      let endPage = Math.min(currentPage + 2, totalPages);

      // Ensure we have a maximum range of maxPagesToShow
      if (endPage - startPage + 1 < maxPagesToShow) {
        if (startPage === 1) {
          endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
        } else if (endPage === totalPages) {
          startPage = Math.max(endPage - maxPagesToShow + 1, 1);
        }
      }

      // Add ellipsis and boundary pages
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }

      // Add range of pages around the current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis and boundary pages
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-l-md bg-gray-300 ${
          currentPage === 1 ? "text-gray-400" : "text-gray-800"
        }`}
      >
        Prev
      </button>
      {getPages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && handleClick(page)}
          className={`px-4 py-2 ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : typeof page === "number"
              ? "bg-gray-300 text-gray-800"
              : "bg-transparent text-gray-800"
          }`}
          disabled={typeof page === "string"}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-r-md bg-gray-300 ${
          currentPage === totalPages ? "text-gray-400" : "text-gray-800"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
