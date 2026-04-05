/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { PaginationResponse } from "@/types";
import PaginationArrow from "@/assets/icons/PaginationArrow";

// Define the PaginationArrow component if you don't have it yet

function PaginationComponent({
  data,
  handlePageChange,
}: {
  data: PaginationResponse<unknown>;

  handlePageChange: (page: number) => void;
}) {
  const { limit, page, pageCount, totalItems, nextPage, previousPage } = data;
  const [selectedPage, setSelectedPage] = useState<number>(page);

  // Determine which page numbers to display
  const pagesToShow = 3; // Only show 3 pages at a time
  const [currentPages, setCurrentPages] = useState<number[]>([]);

  useEffect(() => {
    // Calculate the range of pages to show
    const startPage = Math.max(1, selectedPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(pageCount, startPage + pagesToShow - 1);
    const newPages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
    setCurrentPages(newPages);
  }, [selectedPage, pageCount]);

  // Handle page selection
  function handleSelectPage(page: number) {
    setSelectedPage(page);
  }

  // Handle arrow clicks
  const isPrev = selectedPage > 1;
  const isNext = selectedPage < pageCount;

  function handleArrowClick(direction: "left" | "right") {
    if (direction === "left" && isPrev) {
      setSelectedPage(selectedPage - 1);
    } else if (direction === "right" && isNext) {
      setSelectedPage(selectedPage + 1);
    }
  }
  useEffect(() => {
    handlePageChange(selectedPage);
  }, [handlePageChange, selectedPage]);

  return (
    <div className="p-6 flex items-center justify-between">
      <div>
        <p>
          Showing {limit * (selectedPage - 1) + 1}-
          {Math.min(limit * selectedPage, totalItems)} from {totalItems} items
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {/* Left Arrow */}
        <div onClick={() => handleArrowClick("left")}>
          <PaginationArrow direction="left" isActive={isPrev} />
        </div>

        {/* Page Numbers */}
        {currentPages.map((item) => (
          <button
            key={item}
            onClick={() => handleSelectPage(item)}
            className={classNames(
              "w-10 h-10 flex rounded-full items-center justify-center border text-sm",
              {
                "text-white bg-[#F68B36] border-[#F68B36]":
                  selectedPage === item,
                "text-[#363435] border-[#ADACAC] ": selectedPage !== item,
              }
            )}
            style={
              selectedPage === item
                ? {
                    boxShadow: "0px 4px 4px 0px #4B588740",
                  }
                : {}
            }
          >
            {item}
          </button>
        ))}

        {/* Right Arrow */}
        <div onClick={() => handleArrowClick("right")}>
          <PaginationArrow direction="right" isActive={isNext} />
        </div>
      </div>
    </div>
  );
}

export default PaginationComponent;
