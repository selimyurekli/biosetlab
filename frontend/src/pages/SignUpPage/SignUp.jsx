import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ViteLogo from "../../../public/vite.svg";
import axios from "axios";

import roleOptions from "../../utils/roleOptions";

import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    institution: "",
    address: "",
  });

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordsMatchMessage, setPasswordsMatchMessage] = useState("");
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roleSelectRef = useRef(null);
  const institutionSelectRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch institution data from backend
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/institution/get");
      if (response.status === 200) {
        setInstitutionOptions(response.data);
      } else {
        throw new Error("Failed to fetch institutions");
      }
    } catch (error) {
      console.error("Error fetching institutions:", error);
      // Handle error or display a message to the user
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setInvalidEmail(!emailRegex.test(value));
    }

    if (name === "password") {
      const match = formData.confirmPassword === value;
      setPasswordsMatch(match);
      setPasswordsMatchMessage(
        match ? "Passwords match" : "Passwords do not match"
      );
    }

    if (name === "confirmPassword") {
      const match = formData.password === value;
      setPasswordsMatch(match);
      setPasswordsMatchMessage(
        match ? "Passwords match" : "Passwords do not match"
      );
    }
  };

  const handleKeyDown = (e, selectRef) => {
    const key = e.key.toLowerCase();
    const options = selectRef.current.options;
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.text.toLowerCase().startsWith(key)) {
        option.selected = true;
        selectRef.current.scrollTop = option.offsetTop;
        break;
      }
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setInvalidEmail(true);
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      setPasswordsMatchMessage("Passwords do not match");
      return;
    }
  
    try {
      const institutionId = institutionOptions.find(
        (option) => option.name === formData.institution
      )?._id;
  
      const response = await axios.post(
        "http://localhost:8000/api/user/signup",
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          surname: formData.surname,
          address: formData.address,
          institutionId: institutionId, // Sending institution ID
          role: formData.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      // if (!response.ok) {
      //   throw new Error(
      //     "User already exists. Please verify your account first."
      //   );
      // }
  
      toast.success(
        "Welcome! We've sent you an email with a verification link. Please verify your email to complete the signup process."
      );
  
      // Save email to local storage to use in verification
      localStorage.setItem("verifiedEmail", formData.email);
  
      // Navigate to verification page after successful signup
      navigate("/verify");
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle error or display a message to the user
      toast.error("User already exists. Please verify your account first.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-md sm:max-w-md flex flex-col items-center justify-center">
        <img src={ViteLogo} className="h-32 w-32 mb-5" alt="Vite Logo" />
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign up for a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  className="mt-1 pl-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="surname">
                  Surname
                </label>
                <input
                  id="surname"
                  type="text"
                  name="surname"
                  autoComplete="surname"
                  required
                  className="mt-1 pl-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  value={formData.surname}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                className={`mt-1 pl-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 ${
                  invalidEmail ? "border-red-500" : ""
                }`}
                value={formData.email}
                onChange={handleChange}
              />
              {invalidEmail && (
                <p className="mt-2 pl-3 text-sm text-red-500">
                  Invalid email format
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 pl-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  className={`mt-1 pl-3 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 pr-10 ${
                    !passwordsMatch ? "border-red-500" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={handleShowConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordsMatchMessage && (
                <p
                  className={`mt-2 pl-3 text-sm ${
                    passwordsMatch && formData.password
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {passwordsMatchMessage}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  ref={roleSelectRef}
                  name="role"
                  autoComplete="role"
                  required
                  className="mt-1 pl-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  value={formData.role}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, roleSelectRef)}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="institution">
                  Institution
                </label>
                <select
                  id="institution"
                  ref={institutionSelectRef}
                  name="institution"
                  autoComplete="institution"
                  required
                  className="mt-1 pl-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  value={formData.institution}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, institutionSelectRef)}
                >
                  <option value="">Select</option>
                  {institutionOptions.map((option) => (
                    <option key={option._id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="address">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                autoComplete="address"
                required
                className="mt-2 p-2 pl-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                style={{ minHeight: "6rem" }}
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* Already a member? Sign in */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already a member?{" "}
              <Link
                to="/sign-in"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
