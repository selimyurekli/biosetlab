// UserProfile.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import UserProfile from "./UserProfile";

jest.mock("axios");

describe("UserProfile", () => {
  beforeEach(() => {
    localStorage.setItem("token", "mockToken");
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders user profile data when fetched successfully", async () => {
    const mockUser = {
      name: "John",
      surname: "Doe",
      email: "john@example.com",
      role: "admin",
      institutionId: "mockInstitutionId",
      address: "123 Mock St",
    };

    const mockInstitution = {
      _id: "mockInstitutionId",
      name: "Mock Institution",
    };

    axios.get
      .mockResolvedValueOnce({ status: 200, data: [mockInstitution] })
      .mockResolvedValueOnce({ status: 200, data: { user: mockUser } });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    // Wait for user profile data to be fetched
    await waitFor(() => {
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Mock Institution")).toBeInTheDocument();
    expect(screen.getByText("123 Mock St")).toBeInTheDocument();
  });

//   test("redirects to sign-in page if token is not present", async () => {
//     localStorage.removeItem("token");

//     axios.get
//       .mockResolvedValueOnce({ status: 200, data: [mockInstitution] })
//       .mockResolvedValueOnce({ status: 200, data: { user: mockUser } });


//     render(
//       <MemoryRouter initialEntries={["/user-profile"]}>
//         <UserProfile />
//       </MemoryRouter>
//     );

//     // Wait for redirection
//     await waitFor(() => {
//       expect(screen.getByText("Sign In")).toBeInTheDocument();
//     });
//   });

  test("navigates to edit profile page when edit button is clicked", async () => {
    const mockUser = {
      name: "John",
      surname: "Doe",
      email: "john@example.com",
      role: "admin",
      institutionId: "mockInstitutionId",
      address: "123 Mock St",
    };

    const mockInstitution = {
      _id: "mockInstitutionId",
      name: "Mock Institution",
    };

    axios.get
      .mockResolvedValueOnce({ status: 200, data: [mockInstitution] })
      .mockResolvedValueOnce({ status: 200, data: { user: mockUser } });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    // Wait for user profile data to be fetched
    await waitFor(() => {
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    const editButton = screen.getByText("Edit Profile");
    expect(editButton).toBeInTheDocument();

    userEvent.click(editButton);

    // Ensure navigation to edit profile page
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });
});
