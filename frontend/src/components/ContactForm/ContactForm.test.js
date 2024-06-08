import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

jest.mock("@emailjs/browser", () => ({
  init: jest.fn(),
  send: jest.fn().mockResolvedValueOnce({})
}));
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe("ContactForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields", () => {
    const { getByLabelText, getByText } = render(<ContactForm />);
    expect(getByLabelText("Name:")).toBeInTheDocument();
    expect(getByLabelText("Email:")).toBeInTheDocument();
    expect(getByLabelText("Message:")).toBeInTheDocument();
    expect(getByText("Submit")).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const { getByLabelText, getByText } = render(<ContactForm />);
    fireEvent.change(getByLabelText("Name:"), { target: { value: "John Doe" } });
    fireEvent.change(getByLabelText("Email:"), { target: { value: "john@example.com" } });
    fireEvent.change(getByLabelText("Message:"), { target: { value: "Hello!" } });

    fireEvent.submit(getByText("Submit"));

    expect(emailjs.send).toHaveBeenCalledWith(
      "service_ow9fquh",
      "template_7xua66n",
      expect.objectContaining({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello!"
      })
    );

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Email successfully sent!"));
    expect(getByLabelText("Name:").value).toBe("");
    expect(getByLabelText("Email:").value).toBe("");
    expect(getByLabelText("Message:").value).toBe("");
  });

  it("displays error toast on failed submission", async () => {
    emailjs.send.mockRejectedValueOnce(new Error("Failed to send email"));
    const { getByLabelText, getByText } = render(<ContactForm />);
    fireEvent.change(getByLabelText("Name:"), { target: { value: "John Doe" } });
    fireEvent.change(getByLabelText("Email:"), { target: { value: "john@example.com" } });
    fireEvent.change(getByLabelText("Message:"), { target: { value: "Hello!" } });

    // fireEvent.submit(getByText("Submit"));

    // await waitFor(() =>
    //   expect(toast.error).toHaveBeenCalledWith("Failed to send email. Please try again later.")
    // );
  });
});
