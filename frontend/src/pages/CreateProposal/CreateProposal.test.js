// CreateProposal.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import CreateProposal from "./CreateProposal";
import Navbar from "../../components/header/Navbar";

// Mock the Navbar component to avoid rendering issues during tests
jest.mock("../../components/header/Navbar", () => () => <div>Mocked Navbar</div>);

// Mock axios
jest.mock("axios");

describe("CreateProposal Component", () => {
  const mockProjectId = "123";
  
  beforeEach(() => {
    axios.post.mockResolvedValueOnce({
      data: {
        project: {
          _id: mockProjectId,
          name: "Test Project",
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders CreateProposal component and form fields", async () => {
    render(
      <MemoryRouter initialEntries={[`/proposal/create/${mockProjectId}`]}>
        <Routes>
          <Route path="/proposal/create/:projectId" element={<CreateProposal />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Mocked Navbar/i)).toBeInTheDocument();
    expect(await screen.findByText(/Create Proposal for: Test Project/i)).toBeInTheDocument();

    // Check if the form fields are present
    expect(screen.getByPlaceholderText(/Enter proposal text/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter potential research benefits/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Provide user email and press enter/i)).toBeInTheDocument();

    // Simulate filling out the form
    fireEvent.change(screen.getByPlaceholderText(/Enter proposal text/i), {
      target: { value: "Test Proposal Text" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter potential research benefits/i), {
      target: { value: "Test Research Benefits" },
    });

    // Check if the values are correctly updated
    expect(screen.getByPlaceholderText(/Enter proposal text/i)).toHaveValue("Test Proposal Text");
    expect(screen.getByPlaceholderText(/Enter potential research benefits/i)).toHaveValue("Test Research Benefits");
  });
});
