import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  test("renders correctly with given props", () => {
    const { getByText } = render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    
    expect(getByText("Prev")).toBeInTheDocument();
    expect(getByText("Next")).toBeInTheDocument();
    expect(getByText("1")).toBeInTheDocument();
    expect(getByText("2")).toBeInTheDocument();
    expect(getByText("3")).toBeInTheDocument();
    expect(getByText("4")).toBeInTheDocument();
    expect(getByText("5")).toBeInTheDocument();
  });

  test("handles click events correctly", () => {
    const mockHandlePageChange = jest.fn();
    const { getByText } = render(<Pagination currentPage={3} totalPages={5} onPageChange={mockHandlePageChange} />);
    
    fireEvent.click(getByText("2"));
    expect(mockHandlePageChange).toHaveBeenCalledWith(2);

    fireEvent.click(getByText("Next"));
    expect(mockHandlePageChange).toHaveBeenCalledWith(4);

    fireEvent.click(getByText("Prev"));
    expect(mockHandlePageChange).toHaveBeenCalledWith(2);
  });

  test("disables Prev button on first page", () => {
    const { getByText } = render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    const prevButton = getByText("Prev");

    expect(prevButton).toBeDisabled();
  });

  test("disables Next button on last page", () => {
    const { getByText } = render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
    const nextButton = getByText("Next");

    expect(nextButton).toBeDisabled();
  });

  test("disables ellipsis buttons", () => {
    const { queryByText } = render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
    const ellipsisLeft = queryByText("...");
    const ellipsisRight = queryByText("...");

    expect(ellipsisLeft).toBeNull();
    expect(ellipsisRight).toBeNull();
  });

  test("shows ellipsis buttons when pages are more than maxPagesToShow", () => {
    const { getByText } = render(<Pagination currentPage={3} totalPages={10} onPageChange={() => {}} />);
    const ellipsisLeft = getByText("...");
    const ellipsisRight = getByText("...");

    expect(ellipsisLeft).toBeInTheDocument();
    expect(ellipsisRight).toBeInTheDocument();
  });

  test("renders correctly when totalPages is less than maxPagesToShow", () => {
    const { getByText, queryByText } = render(<Pagination currentPage={3} totalPages={3} onPageChange={() => {}} />);
    const ellipsisLeft = queryByText("...");
    const ellipsisRight = queryByText("...");

    expect(getByText("1")).toBeInTheDocument();
    expect(getByText("2")).toBeInTheDocument();
    expect(getByText("3")).toBeInTheDocument();
    expect(ellipsisLeft).toBeNull();
    expect(ellipsisRight).toBeNull();
  });
});
