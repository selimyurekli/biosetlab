import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ConfirmationModal from "./ConfirmationModal";

describe("ConfirmationModal", () => {
  it("renders with default props", () => {
    const { getByText } = render(<ConfirmationModal message="Are you sure?" />);
    expect(getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders with message description", () => {
    const { getByText } = render(
      <ConfirmationModal message="Are you sure?" messageDescription="This action cannot be undone." />
    );
    expect(getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("calls onCancel when clicking outside the modal", () => {
    const onCancel = jest.fn();
    const { getByTestId } = render(
      <div data-testid="outside">
        <ConfirmationModal message="Are you sure?" onCancel={onCancel} />
      </div>
    );
    fireEvent.mouseDown(getByTestId("outside"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onConfirm when clicking confirm button", () => {
    const onConfirm = jest.fn();
    const { getByText } = render(<ConfirmationModal message="Are you sure?" onConfirm={onConfirm} />);
    fireEvent.click(getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when clicking cancel button", () => {
    const onCancel = jest.fn();
    const { getByText } = render(<ConfirmationModal message="Are you sure?" onCancel={onCancel} />);
    fireEvent.click(getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });
});
