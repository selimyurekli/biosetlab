import React, { useState, useEffect } from "react";
import axios from "axios";

const DatasetPreview = ({ datasetId }) => {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8000/api/project/preview-dataset",
          { datasetId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPreviewData(response.data);
      } catch (error) {
        console.error("Error fetching dataset preview:", error);
      }
    };

    fetchPreviewData();
  }, [datasetId]);

  if (!previewData) {
    return <div>Loading dataset preview...</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-2xl font-semibold mb-2 mt-10">Preview</h3>
      <div className="overflow-x-auto">
        <h4 className="text-lg font-semibold mb-1 mt-5">Summary</h4>
        { previewData.jsonSummary.length !== 0 ? 
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Column Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mean
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Std
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Median
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewData.jsonSummary.map((summary) => (
                <tr key={summary.column}>
                  <td className="px-6 py-4 whitespace-nowrap">{summary.column}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{summary.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{summary.mean}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{summary.std}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{summary.min}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{summary.median}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{summary.max}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{summary.variance}</td>
                </tr>
              ))}
            </tbody>
          </table> 
          :
          <p className="mt-2">There is no summary provided for that dataset.</p>
        }
      </div>
      <div className="overflow-x-auto mt-8">
        <h4 className="text-lg font-semibold mb-1 mt-5">Content of the file</h4>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {previewData.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.headValues.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                {row.map((value, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-nowrap">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetPreview;
