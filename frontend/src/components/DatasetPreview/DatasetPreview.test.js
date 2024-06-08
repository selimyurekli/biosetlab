import React from "react";
import { render } from "@testing-library/react";
import DatasetPreview from "./DatasetPreview";

test("renders loading message initially", () => {
  const { getByText } = render(<DatasetPreview datasetId="testDatasetId" />);
  const loadingMessage = getByText("Loading dataset preview...");
  expect(loadingMessage).toBeInTheDocument();
});
