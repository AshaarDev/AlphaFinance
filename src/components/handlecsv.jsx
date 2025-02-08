import React, { useState } from "react";
import Papa from "papaparse";
import "./compcss/choosefile.css";
import csvimage from "./images/csvpng.png";

const ChooseCSV = ({ setRowData, setColumnDefs, setParsedData }) => {
  const [parsedData, setInternalParsedData] = useState([]);
  const [dragging, setDragging] = useState(false);

  const formatCSVDataForAgGrid = (data) => {
    if (data.length > 0) {
      const columnDefs = Object.keys(data[0]).map((key) => ({
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
        sortable: true,
        filter: true,
      }));
      setColumnDefs(columnDefs);
      setRowData(data);
    }
  };

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setInternalParsedData(results.data);
        if (setParsedData) {
          setParsedData(results.data);
        }
        formatCSVDataForAgGrid(results.data);
      },
      error: (error) => {
        console.log("Error parsing file:", error);
      },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      handleFileUpload(file);
    } else {
      alert("Please upload a valid CSV file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      handleFileUpload(file);
    } else {
      alert("Please upload a valid CSV file");
    }
  };

  return (
    <div>
      <div className="main-csv-container">
        <div
          className={`handlecsv-container ${dragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img className="csvimage" src={csvimage} alt="" />
          <label className="custom-file-upload">
            <input type="file" accept=".csv" onChange={handleFileChange} />
            CHOOSE FILES
          </label>
          <p>or drop files here</p>
        </div>
      </div>
    </div>
  );
};

export default ChooseCSV;
