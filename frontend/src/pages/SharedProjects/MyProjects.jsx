import React, { useState, useEffect } from "react";
import Navbar from "../../components/header/Navbar";
import ProjectList from "../../components/ProjectList/ProjectList";
import axios from "axios"; // Import axios

const MyProjects = () => {
  const [sharedProjects, setSharedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log(sharedProjects);

  useEffect(() => {
    fetchSharedProjects();
  }, []);

  const fetchSharedProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/owned-projects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setSharedProjects(response.data.projects);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching shared projects:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-10 py-8 max-w-7xl">
        <h1 className="text-3xl font-semibold text-center mb-8">
          (Co-)Owned Projects
        </h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : sharedProjects.length > 0 ? (
          <>
            <h2 className="mb-3 font-bold text-gray-600">{sharedProjects.length} {sharedProjects.length === 1 ? "project was": "projects were"} found.</h2>
            <ProjectList projects={sharedProjects} mode="edit" />
          </>
        ) : (
          <p className="text-center text-gray-600 mt-8">
            You have not shared any projects yet.
          </p>
        )}
      </div>
    </>
  );
};

export default MyProjects;
