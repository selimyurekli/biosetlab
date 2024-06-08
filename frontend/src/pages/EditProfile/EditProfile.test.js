import React from "react";
import { render, screen } from "@testing-library/react";
import EditProfile from "./EditProfile";
import { MemoryRouter } from "react-router-dom";

describe("EditProfile", () => {
  test("renders edit profile page correctly", () => {
    render(
        <MemoryRouter>
            <EditProfile />
        </MemoryRouter>
    );

    // Check if elements are rendered
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Surname")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Institution")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
  });
});
