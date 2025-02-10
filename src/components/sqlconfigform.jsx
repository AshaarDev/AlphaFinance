import React, { useState } from "react";
import GridComponent from "./callablegrid";
import "../App.css";
import "./compcss/sqlconn.css";
import DraggableModal from "../components/subcomponents/draggablemodal.jsx";

const DatabaseConn = () => {
  const [host, setHost] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");
  const [message, setMessage] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, user, password, database }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Successfully connected to the database!");
        await handleFetchTables(); // Fetch tables immediately
      } else {
        setMessage(`Failed to connect: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error connecting to the database.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTables = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, user, password, database }),
      });

      const data = await response.json();

      if (response.ok) {
        setTables(data.tables);
        setMessage("Database Connection Successful!!");
      } else {
        setMessage(`Failed to fetch tables: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error fetching tables.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTable = async () => {
    if (!selectedTable) {
      setMessage("Please select a table first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/table-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host,
          user,
          password,
          database,
          tableName: selectedTable,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTableData(data);

        // Generate column definitions
        const columnDefs = Object.keys(data[0]).map((key) => ({
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          field: key,
          sortable: true,
          filter: true,
        }));
        setColumnDefs(columnDefs);

        setMessage(`Data fetched for table: ${selectedTable}`);
      } else {
        setMessage(`Failed to fetch data: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error fetching data from the table.");
    }
  };

  return (
    <div className="databaseconn-container">
      <button className="componentbutton" onClick={openModal}>
        Connect
      </button>

      <div className="sqlinfo-container">
        <DraggableModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Form Modal"
        >
          <input
            className="input-sql"
            type="text"
            placeholder="Host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
          <input
            type="text"
            placeholder="User"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="input-sql"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-sql"
          />
          <input
            type="text"
            placeholder="Database"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            className="input-sql"
          />
          <button
            className="componentbutton"
            onClick={handleConnect}
            disabled={loading}
          >
            Connect
          </button>
          <p className="db-message">{message}</p>
        </DraggableModal>
      </div>

      {loading && <p>Loading...</p>}
      {/* {message && <p>{message}</p>} */}

      {tables.length > 0 && (
        <div className="choosetable-container"> 
          <select
            className="choosetable"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="">Choose Table</option>
            {tables.map((table, index) => (
              <option key={index} value={table}>
                {table}
              </option>
            ))}
          </select>
          <button
            className="componentbutton"
            onClick={handleSelectTable}
            disabled={loading}
          >
            Select Table
          </button>
        </div>
      )}

      {tableData.length > 0 && (
        <div>
          <GridComponent rowData={tableData} columnDefs={columnDefs} />
        </div>
      )}
    </div>
  );
};

export default DatabaseConn;
