import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/header/Navbar";
import DatasetPreview from "../../components/DatasetPreview/DatasetPreview";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  const [collaboratorsList, setCollaboratorsList] = useState([]);  
  const [collaboratorDetails, setCollaboratorDetails] = useState([]);

  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [uploaderDetails, setUploaderDetails] = useState({}); 


  function findInstitutionNameById(id) {
    const institution = institutionOptions.find(inst => inst._id === id);
    return institution ? institution.name : null;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        if (!token) {
          navigate("/sign-in");
          return;
        }

        const userResponse = await axios.get(
          "http://localhost:8000/api/user/detail",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = userResponse.data.user;
        setUser(userData);

        const tagResponse = await axios.get("http://localhost:8000/api/tag/get");
        if (tagResponse.status === 200) {
          setTagList(tagResponse.data);
        }

        const projectResponse = await axios.post(
          "http://localhost:8000/api/project/detail",
          { projectId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const projectData = projectResponse.data.project;

        setCollaboratorsList(projectData.collaboratorIds);

        const ownerResponse = await axios.get(
          `http://localhost:8000/api/user/name-from-id?userId=${projectData.ownerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (ownerResponse.status === 200) {
          projectData.ownerName = ownerResponse.data.userNameInfo.name;
          projectData.ownerSurname = ownerResponse.data.userNameInfo.surname;
          projectData.ownerInstitutionId = ownerResponse.data.userNameInfo.institutionId;
        }

        setProject(projectData);

        // Fetching collaborator details
        const collaboratorDetailsPromises = projectData.collaboratorIds.map(
          async (collaboratorId) => {
            const collaboratorResponse = await axios.get(
              `http://localhost:8000/api/user/name-from-id?userId=${collaboratorId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (collaboratorResponse.status === 200) {
              const collaboratorData = collaboratorResponse.data.userNameInfo;
              setCollaboratorDetails((prevCollaboratorDetails) => ({
                ...prevCollaboratorDetails,
                [collaboratorId]: collaboratorData,
              }));
            }
          }
        );
        await Promise.all(collaboratorDetailsPromises);

        // Fetch uploader details for each dataset
        const uploaderDetailsPromises = projectData.datasetIds.map(async (dataset) => {
          const uploaderResponse = await axios.get(
            `http://localhost:8000/api/user/name-from-id?userId=${dataset.uploadedBy}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (uploaderResponse.status === 200) {
            const uploaderData = uploaderResponse.data.userNameInfo;
            setUploaderDetails((prevUploaderDetails) => ({
              ...prevUploaderDetails,
              [dataset._id]: uploaderData,
            }));
          }
        });
        await Promise.all(uploaderDetailsPromises);

        if (userData && userData._id && projectData.userIds.includes(userData._id)) {
          setHasAccess(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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

    fetchInstitutions();
    fetchData();
  }, [projectId, navigate]);

  const handleCreateProposal = () => {
    navigate(`/proposal/create/${projectId}`);
  };

  const handleDownloadDataset = async (datasetUrl, datasetName, datasetExtension) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios({
        url: datasetUrl,
        method: 'GET',
        responseType: 'blob', // Important
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${datasetName}.${datasetExtension}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading dataset:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace(/ /g, ' '); // Replace space between date components with desired format
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Project: {project.name}
        </h1>
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border-2 mb-44">
          <div className="px-6 py-4">
            <p className="text-2xl font-bold mb-4">Project Information</p>
            <div className="mb-4">
              <span className="text-gray-700 font-bold">Title:</span>{" "}
              <p className="text-gray-700 font-normal">{project.name}</p>
            </div>
            <div className="mb-4">
              <span className="text-gray-700 font-bold">Summary:</span>{" "}
              <p className="text-gray-700 font-normal">{project.description}</p>
            </div>
            {/* <div className="mb-4">
              <span className="text-gray-700 font-bold">Abstract:</span>{" "}
              <p className="text-gray-700 font-normal">{project.abstract}</p>
            </div> */}
            <div className="mb-4">
              <p className="text-gray-700 font-bold mb-1">Owner:</p>{" "}
              <span className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                {project.ownerName} {project.ownerSurname} {`(${findInstitutionNameById(project.ownerInstitutionId)})`}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-gray-700 font-bold">
                Collaborators:
              </span>{" "}
              {collaboratorsList.length === 0 ? (
                <div>No collaborators are currently working on this project.</div>
              ) : (
                
                <span className="flex flex-wrap mt-2">
                  {collaboratorsList.map((collaboratorId) => {
                    const collaboratorDetail = collaboratorDetails[collaboratorId];
                    return (
                      <span
                        key={collaboratorId}
                        className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                      >
                        {collaboratorDetail ? (
                          `${collaboratorDetail.name} ${collaboratorDetail.surname} (${findInstitutionNameById(collaboratorDetail.institutionId)})`
                        ) : (
                          "Loading..."
                        )}
                      </span>
                    );
                  })}
                </span>
              )}
            </div>

            <div className="mb-4">
              <span className="text-gray-700 font-bold">Last Update Date:</span>{" "}
              <p className="text-gray-700 font-normal">{formatDate(project.updated_at)}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700">
                <span className="font-bold">Tags:</span>{" "}
                <span className="flex flex-wrap mt-2">
                  {project.tagIds.map((tagId) => {
                    const tag = tagList.find((tag) => tag._id === tagId);
                    return (
                      <span
                        key={tagId}
                        className="bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                      >
                        {tag ? tag.name : `Tag ${tagId}`}
                      </span>
                    );
                  })}
                </span>
              </p>
            </div>
            <div className="py-4 border-t border-gray-200">
              {hasAccess ? (
                <p className="text-green-600 font-bold mt-3">
                  You have access to download datasets.
                </p>
              ) : (
                <button
                  onClick={handleCreateProposal}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create proposal to get access to download datasets.
                </button>
              )}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <h1 className="text-2xl font-bold mb-4">Datasets</h1>
            {project.datasetIds.length === 0 ? (
              <p className="text-gray-700">
                No dataset has been added to this project yet.
              </p>
            ) : (
              project.datasetIds.map((dataset) => (
                <div
                  key={dataset._id}
                  className="border border-gray-300 shadow-md p-4 mb-10 rounded-md"
                >
                  <div>
                  <h3 className="text-2xl font-semibold mb-1">
                      
                      <span className="text-2xl font-semibold"> {dataset.name}</span>
                    </h3>
                    <h3 className="text-md mb-2 font-semibold">
                      Description:
                      <span className="text-md font-normal text-gray-600"> {dataset.description}</span>
                    </h3>

                    {uploaderDetails[dataset._id] && (
                      <h3 className="text-md mb-2 font-semibold">
                        Uploaded By:
                        <span className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold mx-2 mb-2">
                          {uploaderDetails[dataset._id].name} {uploaderDetails[dataset._id].surname} {`(${findInstitutionNameById(uploaderDetails[dataset._id].institutionId)})`}
                        </span>
                      </h3>
                    )}

                    <h3 className="text-md mb-2 font-semibold">
                      Last Update Date:
                      <span className="text-md font-normal text-gray-600"> {formatDate(dataset.created_at)}</span>
                    </h3>
                    <h3 className="text-md mb-2 font-semibold">
                      File Type:
                      <span className="text-md font-normal text-gray-600"> .{dataset.extension}</span>
                    </h3>
                  </div>
                  <DatasetPreview datasetId={dataset._id} />
                  <div className="mt-2">
                    {hasAccess && (
                      <button
                        onClick={() => handleDownloadDataset("http://localhost:3838/" + dataset.anonym_url, dataset.name, dataset.extension)}
                        className="text-sm bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mt-2 mb-4"
                      >
                        Download Dataset
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailPage;
