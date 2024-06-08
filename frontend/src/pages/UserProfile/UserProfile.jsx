// UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { BsPersonCircle } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import Navbar from "../../components/header/Navbar";

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [institutionOptions, setInstitutionOptions] = useState([]);

  useEffect(() => {
    // fetching user data when page is loading
    fetchInstitutions().then(() => fetchUserData()); // Wait for fetchInstitutions to complete before fetching user data
  }, [navigate]);

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
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const getInstitutionName = (institutionId) => {
    const institution = institutionOptions.find(inst => inst._id === institutionId);
    return institution ? institution.name : "Unknown Institution";
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-md sm:max-w-md flex flex-col items-center justify-center">
          <BsPersonCircle className="text-8xl ml-2 mb-3" />
          <h2 className="text-center text-3xl font-bold text-gray-900">
            User Profile
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Surname
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.surname}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <p className="mt-1 text-sm text-gray-900">{capitalizeFirstLetter(user.role)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Institution
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {getInstitutionName(user.institutionId)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.address}</p>
              </div>
              {/* Button to edit profile */}
              <div className="flex justify-end">
                <button
                  onClick={handleEditProfile}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <AiOutlineEdit className="text-lg mr-2"/>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
