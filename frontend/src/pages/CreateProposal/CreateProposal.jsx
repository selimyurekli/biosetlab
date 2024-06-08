import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Navbar from "../../components/header/Navbar";
import axios from "axios";

const CreateProposal = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [proposal, setProposal] = useState({
    proposalText: "",
    potentialResearchBenefits: "",
    institutionId: "657886b1be12b487ee882f79", // Assuming this is static
    projectId: projectId,
    emails: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    const fetchProjectDetail = async () => {
      try {
          const response = await axios.post(
            "http://localhost:8000/api/project/detail",
            { projectId },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Include authorization token in headers
              },
            }
          );

          const data = response.data;
          setProject(data.project);
      } catch (error) {
        console.error("Error fetching project detail:", error);
      }
    };

    fetchProjectDetail();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
  };

  const handleEmailsChange = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
        e.preventDefault();     
        const newEmail = e.target.value.trim();
        setProposal({ ...proposal, emails: [...proposal.emails, newEmail] });
        e.target.value = "";
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setProposal({
      ...proposal,
      emails: proposal.emails.filter((email) => email !== emailToRemove),
    });
  };

  const handleSubmit = async () => {
    try {
      let data = JSON.stringify({
        proposalText: proposal.proposalText,
        potentialResearchBenefits: proposal.potentialResearchBenefits,
        institutionId: proposal.institutionId,
        projectId: projectId,
        applicantUserIds: proposal.emails,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/api/proposal/create",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: data,
      };

      const response = await axios.request(config);

      // console.log(response.data);

      // Redirect to appropriate page after successful submission
      navigate(`/project/detail/${projectId}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data.error);
      } else {
        console.log(error); // Log other errors
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-screen">
        <h1 className="text-3xl font-semibold mb-6 text-center mt-5">
          {project && `Create Proposal for: ${project.name}`}
        </h1>
        <form className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border-2 p-6 mb-40">
          <div className="mb-4 font-bold">
            <label className="block mb-1">
              Proposal Text:
              <textarea
                name="proposalText"
                value={proposal.proposalText}
                onChange={handleChange}
                className="border border-gray-400 rounded-md p-2 w-full font-normal mt-1 h-64"
                placeholder="Enter proposal text"
                rows="4"
              ></textarea>
            </label>
          </div>
          <div className="mb-4 font-bold">
            <label className="block mb-1">
              Potential Research Benefits:
              <textarea
                name="potentialResearchBenefits"
                value={proposal.potentialResearchBenefits}
                onChange={handleChange}
                className="border border-gray-400 rounded-md p-2 w-full font-normal mt-1 h-48"
                placeholder="Enter potential research benefits"
                rows="4"
              ></textarea>
            </label>
          </div>
          <div className="mb-4 font-bold">
            <label className="block mb-1">
              Proposal Collaborators:
              <input
                type="text"
                name="emails"
                onKeyDown={handleEmailsChange}
                className="border border-gray-400 rounded-md p-2 w-full font-normal mt-1"
                placeholder="Provide user email and press enter"
              />
            </label>
            <div className="flex flex-wrap mt-2">
              {proposal.emails.map((email, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-full py-1 px-3 mr-2 mb-2 flex items-center font-normal"
                >
                  <span className="mr-1">{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-red-600 font-bold focus:outline-none"
                  >
                    <AiOutlineCloseCircle className="ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-700 text-white px-4 py-2 rounded-md my-4"
          >
            Create Proposal
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProposal;
