import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/header/Navbar";
import axios from "axios";

import { BsInfoCircle } from "react-icons/bs";

const CreateDataset = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [autoSelectedColumns, setAutoSelectedColumns] = useState([]);
  
  const [user, setUser] = useState(null);


  const [dataset, setDataset] = useState({
    projectId: projectId,
    name: "",
    description: "",
    file: null,
    extension: "",
    columnNames: [],
    columnActions: [],
    datasetContent: [],
    previewData: [], // New state to store preview data
  });

  useEffect(() => {
    // Call handleColumnActionChange for each automatically selected column
    autoSelectedColumns.forEach((columnName, index) => {
      handleColumnActionChange({ target: { value: "hash" } }, dataset.columnNames.indexOf(columnName));
    });
  }, [autoSelectedColumns]); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProjectDetail = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching project detail:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // If token does not exist, redirect to sign-in page
          // navigate("/sign-in");
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

    fetchProjectDetail();
    fetchUserData();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataset({ ...dataset, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension === "json" || fileExtension === "csv") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        let columnNames = [];
        let columnActions = [];
        let previewData = [];
        if (fileExtension === "json") {
          const jsonArray = JSON.parse(content);
          if (jsonArray.length > 0) {
            columnNames = Object.keys(jsonArray[0]);
            previewData = jsonArray.slice(0, 2);
          }
        } else if (fileExtension === "csv") {
          // Parse CSV data
          const csvArray = content.split("\n");
          if (csvArray.length > 0) {
            columnNames = csvArray[0].split(",");
            // Convert CSV to JSON
            previewData = csvArray.slice(1, 3).map((row) => {
              const values = row.split(",");
              return columnNames.reduce((obj, columnName, index) => {
                obj[columnName] = values[index];
                return obj;
              }, {});
            });
          }
        }
        columnActions = new Array(columnNames.length).fill("none");
        const criticalInfoKeywords = {
          en: {
            identity: ["identity", "id", "identity_number", "ssn", "social_security", "driver_license", "passport", "social_security_number"],
            name: ["name", "firstname", "lastname", "full_name"],
            phone: ["phone", "mobile", "telephone", "cellphone", "contact", "gsm"],
            email: ["email", "e-mail"],
            address: ["address", "adress", "street", "city", "town"], //"province", "state", "country"
            // dob: ["dob", "date_of_birth", "birth_date", "birthdate"],
            // age: ["age"],
            // gender: ["gender", "sex"],
            nationality: ["nationality", "citizenship"],
            passport: ["passport", "passport_number", "passport_no"],
            drivingLicense: ["driving_license", "drivinglicence", "driving_license_number", "license_number"]
          },
          tr: {
            identity: ["tc", "kimlik", "id", "tc_kimlik", "tc_no", "kimlik_no", "tc_kimlik_no", "tc_kimlik_numarası", "nüfus_cüzdanı", "nufus_cuzdani"],
            name: ["isim", "ad", "soyad", "ad_soyad", "adsoyad", "tam_isim"],
            phone: ["telefon", "cep", "gsm", "telefon_no", "telefon_numarası", "cep_telefonu", "cep_telefon_numarası"],
            email: ["e-posta", "e_posta", "email"],
            address: ["adres", "adress", "sokak", "cadde", "mahalle", "ilçe"], //, "şehir", "il", "ülke"
            // dob: ["doğum_tarihi", "dogum_tarihi", "doğum", "dogum"],
            // age: ["yaş"],
            // gender: ["cinsiyet"],
            nationality: ["vatandaşlık", "uyruk", "milliyet"],
            passport: ["pasaport", "pasaport_numarası"],
            drivingLicense: ["ehliyet", "ehliyet_numarası", "sürücü_belgesi"]
          }
        };
        for (let i = 0; i < columnNames.length; i++) {
          const columnName = columnNames[i].toLowerCase().trim();
          let found = false;
          for (const language in criticalInfoKeywords) {
            for (const [action, keywords] of Object.entries(criticalInfoKeywords[language])) {
              if (keywords.some(keyword => columnName === keyword || columnName.startsWith(keyword + "_"))) {
                columnActions[i] = "hash";
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }
        setDataset({
          ...dataset,
          file,
          extension: fileExtension, 
          columnNames: columnNames,
          columnActions: columnActions,
          previewData: previewData,
          datasetContent: previewData
        });
        const automaticallySelectedColumns = columnNames.filter((name, index) => columnActions[index] === "hash");
        if (automaticallySelectedColumns.length > 0) {
          setAutoSelectedColumns(automaticallySelectedColumns);
          setModalOpen(true);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a JSON or CSV file.");
    }
  };

  const handleColumnActionChange = (e, columnIndex) => {
    const { value } = e.target;
  
    // Update the dataset state using the functional form of setDataset
    setDataset(prevDataset => {
      const updatedColumnActions = [...prevDataset.columnActions];
      updatedColumnActions[columnIndex] = value;
  
      // Make the API call with the updated state
      const token = localStorage.getItem("token");
      axios.post(
        "http://localhost:8000/api/project/live-preview",
        {
          data: prevDataset.datasetContent,
          columnNames: prevDataset.columnNames.join(','),
          columnActions: updatedColumnActions.join(',')
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Set the updated preview data in state
        setDataset(prevDataset => ({ ...prevDataset, previewData: response.data.anonymizedData }));
      })
      .catch((error) => {
        console.error("Error updating preview data:", error);
      });
  
      // Return the updated dataset state
      return { ...prevDataset, columnActions: updatedColumnActions };
    });
  };
  

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('file', dataset.file);
    formData.append('name', dataset.name);
    formData.append('projectId', dataset.projectId);
    formData.append('columnNames', dataset.columnNames.join(','));
    formData.append('columnActions', dataset.columnActions.join(','));
    formData.append('description', dataset.description);
    axios.post('http://localhost:8000/api/project/add-dataset', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      console.log("Dataset submitted:", response.data);
      // navigate users accordingly

      if (user && user._id === project.ownerId) {
        navigate(`/project/edit/${dataset.projectId}`);
      } else {
        navigate(`/project/collaborator/edit/${dataset.projectId}`);
      }

    })
    .catch((error) => {
      console.error("Error submitting dataset:", error);
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 h-screen">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          {project && `Create New Dataset for: ${project.name}`}
        </h1>
        <form className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border-2 p-6">
          <p className="text-2xl font-bold mb-4">Dataset Information</p>
          <div className="mb-4 font-bold">
            <label className="block mb-1">
              Title:
              <input
                type="text"
                name="name"
                value={dataset.name}
                onChange={handleChange}
                className="border border-gray-400 rounded-md p-2 w-full font-normal mt-1"
                placeholder="Enter dataset name"
              />
            </label>
          </div>
          <div className="mb-4 font-bold">
            <label className="block mb-1">
              Description:
              <textarea
                name="description"
                value={dataset.description}
                onChange={handleChange}
                className="border border-gray-400 rounded-md p-2 w-full font-normal mt-1"
                placeholder="Enter dataset description"
                rows="4"
              ></textarea>
            </label>
          </div>
          <div className="mb-4 font-bold">
            <label className="block mb-1">
              File:
              <input
                type="file"
                accept=".json, .csv"
                onChange={handleFileUpload}
                className="border border-gray-400 rounded-md p-2 w-full font-normal mt-1"
              />
            </label>
            {dataset.columnNames.length === 0 && (
              <div className="mb-8 px-2 py-2 bg-blue-50 rounded-lg shadow-md border border-blue-200">
                <div className="text-sm text-blue-900">
                  <p className="flex">
                    <BsInfoCircle className="mr-1 mt-1" /><strong className="mr-1">Note: </strong>You can only upload datasets in .json or .csv format.
                  </p>
                </div>
              </div>
            )}

            {/* {console.log(dataset.previewData)} */}

            {dataset.file && (
              <p className="font-bold mt-3">
                Uploaded File Type:{" "}
                <span className="font-normal">{dataset.extension}</span>
              </p>
            )}
          </div>
          <div>
            {/* <div className="mb-8 px-4 py-6 bg-blue-50 rounded-lg shadow-md border border-blue-200">
              <p className="text-lg font-bold mb-2 text-blue-800">Column Action Options:</p>
              <div className="text-sm text-gray-700 mb-4">
                <p><strong>Hash:</strong> Hashing converts data into a unique string of fixed length, making it irreversible. e.g., hashing the number 123456 might produce a hash like: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b</p>
                <p><strong>Mask:</strong> Masking replaces sensitive data with placeholder characters. For example, masking the number 123456 might convert it to: **********</p>
                <p><strong>Remove:</strong> Completely removes the column from the dataset.</p>
                <p><strong>Empty:</strong> Empties the values in the column, converting them to empty strings. For example, converting the number 123456 to an empty value results in: ""</p>
                <p><strong>Randomize:</strong> Randomizes the data in the column, preserving the same length and format. For example, randomizing the number 123456 might produce: seiskjedbrsqlyplrymsvoc</p>
              </div>
            </div> */}

            {dataset.columnNames.length > 0 && (
              <>
                <div className="mb-8 px-4 py-6 bg-blue-50 rounded-lg shadow-md border border-blue-200">
                  <p className="text-lg font-bold mb-2 text-blue-800 flex"> <BsInfoCircle className="mr-2 mt-1"/> Column Action Options</p>
                  <div className="text-sm text-gray-900 mb-4">
                    <p><strong>Mask:</strong> Masking replaces sensitive data with placeholder characters. e.g., 123456 {"—>"} **********</p>
                    <p><strong>Hash:</strong> Hashing converts data into a unique string of fixed length, making it irreversible. e.g., 123456 {"—>"} 6b86b273ff34fce19d6b804eff5a3f57471234xxx22f1d49c01e52ddb7875b4b</p>
                    <p><strong>Randomize:</strong> Randomizes the data in the column, preserving the same length and format. e.g., 123456 {"—>"} seisqweadbrsqlyplrymsvoc</p>
                    <p><strong>Remove:</strong> Completely removes the column from the dataset.</p>
                    <p><strong>Empty:</strong> Empties the values in the column, converting them to empty strings. e.g., 123456 {"—>"} ""</p>
                    <p className="mt-4 text-red-600"><strong>Note: </strong>Our system automatically detects the critical personal information that can identify users directly, and <strong>notifies dataset creators to choose one of the options.</strong></p>
                  </div>
                </div>
              </>
            )}

            {dataset.previewData.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-1">Preview Dataset</h2>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-sm">
                    <thead>
                      <tr>
                        {Object.keys(dataset.previewData[0]).map((columnName, index) => (
                          <th key={index} className="px-4 py-2">{columnName}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.previewData.map((rowData, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(rowData).map((cellData, cellIndex) => (
                            <td key={cellIndex} className="border px-4 py-2">{cellData}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-sm text-blue-900 mb-4">
                  <p className="flex">
                    <BsInfoCircle className="mr-1 mt-1" />For preview purposes, only the first two records of the dataset are displayed.
                  </p>
                </div>
              </div>
            )}

            {dataset.columnNames.length > 0 && (
              <>
                <h2 className="text-xl font-bold mb-2 mt-10">Column Actions</h2>
              </>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
              {dataset.columnNames.map((columnName, columnIndex) => (
                <div key={columnName} className="mb-4 text-sm">
                  <label className="block mb-1 ml-1 font-normal">
                    {columnName}
                  </label>
                  <select
                    value={dataset.columnActions[columnIndex] || "none"}
                    onChange={(e) => handleColumnActionChange(e, columnIndex)}
                    className="border border-gray-400 rounded-md p-1 w-full font-normal text-sm"
                    // disabled={autoSelectedColumns.includes(columnName) && (dataset.columnActions[columnIndex] === "none" || dataset.columnActions[columnIndex] === undefined)}
                  >
                    {/* <option value="none" disabled={autoSelectedColumns.includes(columnName)}>No Action</option> */}
                    <option value="none">No Action</option>
                    <option value="mask">Mask</option>
                    <option value="hash">Hash</option>
                    <option value="randomize">Randomize</option>
                    <option value="remove">Remove</option>
                    <option value="empty">Empty</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-700 text-white px-4 py-2 rounded-md my-4 font-bold"
          >
            + Add Dataset to the Project
          </button>
        </form>
      </div>
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  {/* <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg> */}
                  <BsInfoCircle className="text-3xl text-blue-500"/>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Automatically Selected Column Options</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">The following columns are automatically selected as <strong className="text-black">"hash"</strong> option because they may contain critical personal information:</p>
                    <ul className="mt-3 text-sm text-gray-500">
                      {autoSelectedColumns.map((column, index) => (
                        <li key={index}>{column}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button onClick={() => setModalOpen(false)} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                  Ok, I got it.
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateDataset;
