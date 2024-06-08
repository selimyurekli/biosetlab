import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/header/Navbar";
import Select from "react-select";

import DatasetPreview from "../../components/DatasetPreview/DatasetPreview";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";
import { TiDelete, TiDeleteOutline } from "react-icons/ti";

const EditProjectForm = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [userList, setUserList] = useState([]);
  const [collaboratorsList, setCollaboratorsList] = useState([]);
  
  const [userDetails, setUserDetails] = useState({});
  const [collaboratorDetails, setCollaboratorDetails] = useState([]);
  
  const [user, setUser] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [datasetIdToRemove, setDatasetIdToRemove] = useState(null);
  const [datasetNameToRemove, setDatasetNameToRemove] = useState(null);
  const [showProjectDeleteConfirmationModal, setShowProjectDeleteConfirmationModal] = useState(false);

  const [editedProjectName, setEditedProjectName] = useState("");
  const [editedProjectDescription, setEditedProjectDescription] = useState("");
  const [editedProjectAbstract, setEditedProjectAbstract] = useState("");
  const [editedProjectTagIds, setEditedProjectTagIds] = useState([]);

  const [userEmails, setUserEmails] = useState([]);
  const [collaboratorEmails, setCollaboratorEmails] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");

  const [uploaderDetails, setUploaderDetails] = useState({}); 

  function findInstitutionNameById(id) {
    const institution = institutionOptions.find(inst => inst._id === id);
    return institution ? institution.name : null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/sign-in");
        } else {
          const response = await axios.post(
            "http://localhost:8000/api/project/detail",
            { projectId },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;
          setProject(data.project);
          setEditedProjectName(data.project.name);
          setEditedProjectDescription(data.project.description);
          setEditedProjectAbstract(data.project.abstract);
          setEditedProjectTagIds(data.project.tagIds);

          const tagResponse = await axios.get(
            "http://localhost:8000/api/tag/get"
          );
          if (tagResponse.status === 200) {
            const formattedTags = tagResponse.data.map((tag) => ({
              value: tag._id,
              name: tag.name,
            }));
            setTagList(formattedTags);
          }

          setUserList(data.project.userIds);
          setCollaboratorsList(data.project.collaboratorIds);

          const ownerResponse = await axios.get(
            `http://localhost:8000/api/user/name-from-id?userId=${data.project.ownerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (ownerResponse.status === 200) {
            const ownerData = ownerResponse.data.userNameInfo;
            setProject((prevProject) => ({
              ...prevProject,
              ownerName: ownerData.name,
              ownerSurname: ownerData.surname,
              ownerInstitutionId: ownerData.institutionId
            }));
          }

          // Fetching user details
          const userDetailsPromises = data.project.userIds.map(
            async (userId) => {
              const userResponse = await axios.get(
                `http://localhost:8000/api/user/name-from-id?userId=${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (userResponse.status === 200) {
                const userData = userResponse.data.userNameInfo;
                setUserDetails((prevUserDetails) => ({
                  ...prevUserDetails,
                  [userId]: userData,
                }));
                setUserEmails((prevUserEmails) => {
                  const newEmails = [...prevUserEmails];
                  if (!newEmails.includes(userData.email)) {
                    newEmails.push(userData.email);
                  }
                  return newEmails;
                });
              }
            }
          );
          await Promise.all(userDetailsPromises);

          // Fetching collaborator details
          const collaboratorDetailsPromises = data.project.collaboratorIds.map(
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
                setCollaboratorEmails((prevCollaboratorEmails) => {
                  const newEmails = [...prevCollaboratorEmails];
                  if (!newEmails.includes(collaboratorData.email)) {
                    newEmails.push(collaboratorData.email);
                  }
                  return newEmails;
                });
              }
            }
          );
          await Promise.all(collaboratorDetailsPromises);

          // Fetch uploader details for each dataset
          const uploaderDetailsPromises = data.project.datasetIds.map(async (dataset) => {
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

        }
      } catch (error) {
        console.error("Error fetching project data:", error);
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

  const handleAddDataset = () => {
    navigate(`/dataset/create/${projectId}`);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  const handleDownloadDataset = async (
    datasetUrl,
    datasetName,
    datasetExtension
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios({
        url: datasetUrl,
        method: "GET",
        responseType: "blob", // Important
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${datasetName}.${datasetExtension}`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading dataset:", error);
    }
  };

  const handleRemoveDataset = async (datasetId, datasetName) => {
    setDatasetIdToRemove(datasetId);
    setDatasetNameToRemove(datasetName);
    setShowConfirmationModal(true);
  };

  const confirmRemoveDataset = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/project/remove-dataset",
        { datasetId: datasetIdToRemove },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Dataset removed successfully.");
        // If dataset removed successfully, update the project state
        setProject((prevProject) => ({
          ...prevProject,
          datasetIds: prevProject.datasetIds.filter(
            (dataset) => dataset._id !== datasetIdToRemove
          ),
        }));
      }
    } catch (error) {
      toast.error("Dataset could not be removed.");
      console.error("Error removing dataset:", error);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  const cancelRemoveDataset = () => {
    setShowConfirmationModal(false);
  };

  const handleRemoveProject = () => {
    setShowProjectDeleteConfirmationModal(true);
  };

  const confirmRemoveProject = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Remove all datasets associated with the project
      const removeDatasetsPromises = project.datasetIds.map(async (dataset) => {
        await axios.post(
          "http://localhost:8000/api/project/remove-dataset",
          { datasetId: dataset._id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });
      
      await Promise.all(removeDatasetsPromises);
  
      // Now delete the project
      const response = await axios.post(
        "http://localhost:8000/api/project/delete",
        { projectId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Project deleted successfully.");
        navigate("/my-projects");
      }
    } catch (error) {
      toast.error("Error deleting project.");
      console.error("Error removing project:", error);
    } finally {
      setShowProjectDeleteConfirmationModal(false);
    }
  };

  const cancelRemoveProject = () => {
    setShowProjectDeleteConfirmationModal(false);
  };

  const handleEditProject = async () => {
    // console.log("project: ", project);
    // console.log("userlist: ", userList);
    // console.log("collaboratorlist: ", collaboratorsList);
    // console.log("userDetails: ", userDetails);
    // console.log("collaboratorDetails: ", collaboratorDetails);

    // console.log("userEmails: ", userEmails);
    // console.log("collaboratorEmails: ", collaboratorEmails);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/project/edit",
        {
          projectId,
          name: editedProjectName,
          description: editedProjectDescription,
          abstract: editedProjectAbstract,
          tagIds: editedProjectTagIds,
          userEmails: userEmails,
          collaboratorEmails: collaboratorEmails,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Project details updated successfully.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data.error);
        toast.error("All or some of the email addresses of the users are not registered in the system.");
      } else {
        console.log(error);
        toast.error("Project details could not be updated.");
      }
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

  const addUserEmail = () => {
    if (newUserEmail !== "") {
      setUserEmails([...userEmails, newUserEmail]);
      setNewUserEmail("");
    }  
  };

  const addCollaboratorEmail = () => {
    setCollaboratorEmails([...collaboratorEmails, newCollaboratorEmail]);
    setNewCollaboratorEmail("");
  };

  const removeUserEmail = (email) => {
    setUserEmails(userEmails.filter((userEmail) => userEmail !== email));
  };

  const removeCollaboratorEmail = (email) => {
    setCollaboratorEmails(collaboratorEmails.filter((collaboratorEmail) => collaboratorEmail !== email));
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Edit Project: {project.name}
        </h1>
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border-2 mb-44">
          <div className="px-6 py-4">
            <p className="text-2xl font-bold mb-4">Project Information</p>
            <div className="mb-4">
              <span className="text-gray-700 font-bold">Title:</span>{" "}
              <input
                type="text"
                value={editedProjectName}
                onChange={(e) => setEditedProjectName(e.target.value)}
                className="text-gray-700 font-normal border rounded-lg border-gray-300 focus:outline-none p-2 w-full mt-1"
              />
            </div>
            <div className="mb-4">
              <span className="text-gray-700 font-bold">Summary:</span>{" "}
              <textarea
                value={editedProjectDescription}
                onChange={(e) => setEditedProjectDescription(e.target.value)}
                className="text-gray-700 font-normal border rounded-lg border-gray-300 focus:outline-none p-2 w-full h-64 mt-1"
              />
            </div>
            {/* <div className="mb-4">
              <span className="text-gray-700 font-bold">Abstract:</span>{" "}
              <textarea
                value={editedProjectAbstract}
                onChange={(e) => setEditedProjectAbstract(e.target.value)}
                className="text-gray-700 font-normal rounded-lg border border-gray-300 focus:outline-none p-2 w-full h-20 mt-1"
              />
            </div> */}
            <div className="mb-4">
              <p className="text-gray-700 font-bold mb-1">Owner:</p>{" "}
              <span className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                {project.ownerName} {project.ownerSurname} {`(${findInstitutionNameById(project.ownerInstitutionId)})`}
              </span>
            </div>
            
            {/* <div className="mb-4">
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
            </div> */}

            <div className="mb-4">
              <span className="text-gray-700 font-bold">Is Public:</span>{" "}
              <p className="text-gray-700 font-normal mt-1">
                {project.isPublic ? "Yes" : "No"}
              </p>
            </div>
            <div className="mb-4">
              <span className="text-gray-700 font-bold">Last Update Date:</span>{" "}
              <p className="text-gray-700 font-normal mt-1">
                {formatDate(project.updated_at)}
              </p>
            </div>
            <div className="mb-4 text-lg">
              <span className="text-gray-700 font-bold">Tags:</span>{" "}
              <div className=" mt-1">
                <Select
                  options={tagList.map(tag => ({ value: tag.value, label: tag.name }))}
                  isMulti
                  value={editedProjectTagIds.map(tagId => {
                    const tag = tagList.find(tag => tag.value === tagId);
                    return { value: tagId, label: tag ? tag.name : '' };
                  })}
                  onChange={(selectedTags) => setEditedProjectTagIds(selectedTags.map(tag => tag.value))}
                />
              </div>
            </div>

            {/* Collaborator Emails */}
            <div className="form-group mb-4">
              <label htmlFor="collaboratorEmails" className="block text-md font-bold text-gray-700 mb-1">Collaborators</label>
              <div className="flex mb-2">
                <input
                  type="email"
                  className="form-control flex-grow px-2 py-1 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Add collaborator email"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                />
                <button
                  className="btn bg-blue-500 text-white px-3 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="button"
                  onClick={addCollaboratorEmail}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap -m-1">
                {collaboratorEmails.map((email, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded shadow-sm px-3 py-1 m-1">
                    <span className="text-sm text-gray-700 mr-2">{email}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      onClick={() => removeCollaboratorEmail(email)}
                    >
                      <TiDeleteOutline className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* User Emails */}
            <div className="form-group mb-4">
              <label htmlFor="userEmails" className="block text-md font-bold text-gray-700 mb-1">Shared with Users</label>
              <div className="flex mb-2">
                <input
                  type="email"
                  className="form-control flex-grow px-2 py-1 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Add user email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
                <button
                  className="btn bg-blue-500 text-white px-3 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="button"
                  onClick={addUserEmail}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap -m-1">
                {userEmails.map((email, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded shadow-sm px-3 py-1 m-1">
                    <span className="text-sm text-gray-700 mr-2">{email}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      onClick={() => removeUserEmail(email)}
                    >
                      <TiDeleteOutline className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="mb-4">
              <span className="text-gray-700 font-bold">
                Shared with Users:
              </span>{" "}
              {userList.length === 0 ? (
                <div>No users are currently working on this project.</div>
              ) : (
                <span className="flex flex-wrap mt-2">
                  {userList.map((userId) => {
                    const userDetail = userDetails[userId];
                    return (
                      <span
                        key={userId}
                        className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                      >
                        {userDetail ? (
                          `${userDetail.name} ${userDetail.surname} (${findInstitutionNameById(userDetail.institutionId)})`
                        ) : (
                          "Loading..."
                        )}
                      </span>
                    );
                  })}
                </span>
              )}
            </div> */}
            
          </div>

          <div className="flex justify-end flex-wrap gap-x-2 gap-y-2 mx-5 mb-5">
            <button
              onClick={handleEditProject}
              className="text-lg bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Save Changes
            </button>
            <button
              onClick={handleAddDataset}
              className="text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              + Add New Dataset
            </button>
            <button
              onClick={handleRemoveProject}
              className="text-lg bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 flex items-center"
            >
              <TiDeleteOutline className="text-xl mr-2" />
              <span>Delete Project</span>
            </button>
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
                      <span className="text-2xl font-normal"> {dataset.name}</span>
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
                  <div className="flex justify-between items-center mt-10">
                    <button
                      onClick={() => handleRemoveDataset(dataset._id, dataset.name)}
                      className="text-sm bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
                    >
                      Remove Dataset
                    </button>
                    <button
                      onClick={() =>
                        handleDownloadDataset(
                          "http://localhost:3838/" +
                            dataset.anonym_url,
                          dataset.name,
                          dataset.extension
                        )
                      }
                      className="text-sm bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                    >
                      Download Dataset
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

      </div>

      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to remove this dataset?"
          messageDescription={`Dataset Name: ${datasetNameToRemove}`}
          onConfirm={confirmRemoveDataset}
          onCancel={cancelRemoveDataset}
        />
      )}

      {showProjectDeleteConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this project?"
          messageDescription={`Project Name: ${project.name}`}
          onConfirm={confirmRemoveProject}
          onCancel={cancelRemoveProject}
        />
      )}
    </>
  );
};

export default EditProjectForm;
