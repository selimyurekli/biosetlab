import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import ViteLogo from "../../../public/vite.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const navigate = useNavigate(); // useNavigate hook for redirection

  // console.log(localStorage.getItem("token"));

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Email validation only when the input is touched
    setIsEmailTouched(true);
    if (newEmail === "") {
      setEmailError("");
    } else {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
      setEmailError(isValidEmail ? "" : "Invalid email format");
    }
  };

  const handleEmailBlur = () => {
    setIsEmailTouched(true);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailError(isValidEmail || email === "" ? "" : "Invalid email format");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailError) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/user/login",
          {
            email,
            password,
          }
        );
        // Check if response contains token
        if (response.data.token) {
          // Login successful
          localStorage.setItem("token", response.data.token); // Store token in local storage
          setIsLogged(true);
          toast.success("Login successful!"); // Display success toast
        } else {
          // Login failed due to invalid credentials
          toast.error(
            "Invalid credentials or verification is not completed. Please try again."
          ); // Display error toast
        }
      } catch (error) {
        // Login failed due to network error or server issue
        toast.error(
          "Invalid credentials or verification is not completed. Please try again."
        ); // Display error toast
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/explore"); // Redirect to explore page
        window.location.reload(); // Reload the page
      }
    }, 1500); // Adjust the duration as needed

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, [isLogged, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-md sm:max-w-md flex flex-col items-center justify-center">
        <img src={ViteLogo} className="h-32 w-32 mb-5" alt="Vite Logo" />
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                className={`mt-1 pl-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  emailError ? "border-red-500" : ""
                }`}
                style={{ height: "2.5rem" }} // Adjust the height here
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
              />
              {isEmailTouched && emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="mt-1 pl-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md pr-10"
                style={{ height: "2.5rem" }} // Adjust the height here
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                style={{ top: "35%" }} // Vertically centering
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg"/>}
              </button>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Not a member? Sign up */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Not a member?{" "}
              <Link
                to="/sign-up"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
