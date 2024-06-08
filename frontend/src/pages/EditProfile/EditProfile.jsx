// EditProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/header/Navbar";
import { toast } from "react-toastify";

import roleOptions from "../../utils/roleOptions";

import { BsPersonCircle } from "react-icons/bs";

function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    role: "",
    email: "",
    institutionId: "",
    address: "",
  });
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const roleSelectRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    fetchInstitutions();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // If token does not exist, redirect to sign-in page
        navigate("/sign-in");
      } else {
        const response = await axios.get(
          "http://localhost:8000/api/user/detail",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data.user;
        setFormData({
          name: userData.name,
          surname: userData.surname,
          role: userData.role,
          email: userData.email,
          institutionId: userData.institutionId,
          address: userData.address,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // If token does not exist, redirect to sign-in page
        navigate("/sign-in");
      } else {
        await axios.post(
          "http://localhost:8000/api/user/edit",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("User profile updated successfully.");
        navigate("/user-profile");
      }
    } catch (error) {
      toast.success("User profile could not updated.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-md sm:max-w-md flex flex-col items-center justify-center">
          <BsPersonCircle className="text-8xl ml-2 mb-3" />
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Edit Profile
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <form onSubmit={handleSubmit}>
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 px-1 block w-full border-gray-300 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Surname
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="mt-1 px-1 block w-full border-gray-300 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="email"
                      className="px-1 block w-full border-gray-300 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 bg-gray-100"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 italic text-sm">Disabled</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    ref={roleSelectRef}
                    name="role"
                    autoComplete="role"
                    required
                    className="mt-1 px-1 block w-full border-gray-300 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Institution
                  </label>
                  <select
                    name="institutionId"
                    value={formData.institutionId}
                    onChange={handleChange}
                    className="mt-1  px-1 block w-full border-gray-300 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                    required
                  >
                    <option value="">Select Institution</option>
                    {institutionOptions.map((institution) => (
                      <option key={institution._id} value={institution._id}>
                        {institution.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  className="mt-1 px-1  block w-full border-gray-300 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-20"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
                {/* Button to submit form */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
