// CreateDataset.test.js

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import CreateDataset from "./CreateDataset";
import Navbar from "../../components/header/Navbar";

// Mock the Navbar component to avoid rendering issues during tests
jest.mock("../../components/header/Navbar", () => () => <div>Mocked Navbar</div>);

// Mock axios
jest.mock("axios");

const mockProject = {
  id: "1",
  name: "Test Project",
};

describe("CreateDataset Component", () => {
  beforeEach(() => {
    axios.post.mockResolvedValueOnce({
      data: {
        project: mockProject,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders CreateDataset component and displays project name", async () => {
    render(
      <MemoryRouter initialEntries={["/project/create-dataset/1"]}>
        <Routes>
          <Route path="/project/create-dataset/:projectId" element={<CreateDataset />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Mocked Navbar/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/Create New Dataset for: Test Project/i)).toBeInTheDocument());
  });
});
