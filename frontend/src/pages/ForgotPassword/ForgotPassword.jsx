import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ViteLogo from "../../../public/vite.svg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetCodeChange = (e) => {
    setResetCode(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/forgot-password",
        {
          email,
        }
      );
      if (response.status === 200) {
        toast.success("Reset code sent to your email address");
        setStep(2);
      } else {
        toast.error("Failed to send reset code");
      }
    } catch (error) {
      toast.error("Failed to send reset code");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/reset-password",
        {
          email,
          resetCode,
          newPassword,
        }
      );
      if (response.status === 200) {
        toast.success("Password updated successfully");
        navigate("/sign-in");
        setStep(3);
      } else {
        toast.error(
          "Failed to update password, check your password reset code."
        );
      }
    } catch (error) {
      toast.error(
        "Failed to update password, check your password reset code."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-md sm:max-w-md flex flex-col items-center justify-center">
        <img src={ViteLogo} className="h-32 w-32 mb-5" alt="Vite Logo" />
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {step === 1
            ? "Forgot Password"
            : step === 2
            ? "Reset Password"
            : "Password Reset Successful"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendCode}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 pl-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  style={{ height: "2.5rem" }} // Adjust the height here
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send Reset Code
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    disabled
                    className="mt-1 pl-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 bg-gray-200"
                    style={{ height: "2.5rem" }} // Adjust the height here
                    value={email}
                    onChange={handleEmailChange}
                  />
              </div>
              <div>
                <label
                  htmlFor="resetCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reset Code
                </label>
                <input
                  id="resetCode"
                  name="resetCode"
                  type="text"
                  required
                  className="mt-1 pl-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  style={{ height: "2.5rem" }} // Adjust the height here
                  value={resetCode}
                  onChange={handleResetCodeChange}
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="mt-1 pl-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md pr-10"
                    style={{ height: "2.5rem" }} // Adjust the height here
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-lg text-gray-400" />
                    ) : (
                      <FaEye className="text-lg text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="mt-1 pl-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md pr-10"
                    style={{ height: "2.5rem" }} // Adjust the height here
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={handleShowConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-lg text-gray-400" />
                    ) : (
                      <FaEye className="text-lg text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset Password
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center">
              <p className="text-xl text-gray-600">
                Password reset successful!{" "}
              </p>
              <p className="text-xl text-gray-600">
                Return to{" "}
                <Link
                  to="/sign-in"
                  className="font-medium text-indigo-500 hover:text-indigo-500"
                >
                  Sign in
                </Link>{" "}
                Page
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
