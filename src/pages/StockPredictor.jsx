import { useState, useEffect } from "react";
import "../App.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import GridComponent from "../components/callablegrid";
import ChooseCSV from "../components/handlecsv";
import NewsBar from "../components/newsbar.jsx";
import { Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DraggableModal from "../components/subcomponents/draggablemodal.jsx";
import axios from "axios";
import ChartComponent from "../components/chartcomponent.jsx";
import { saveAs } from "file-saver";
import { StandaloneETFDownloader } from "../components/downloadetf.jsx";

function StockPredictor() {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [host, setHost] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");
  const [message, setMessage] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedCSVData, setParsedCSVData] = useState([]);
  const [aadrData, setAadrData] = useState(null);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockList, setStockList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [isETFModalOpen, setIsETFModalOpen] = useState(false);

  const openETFModal = () => setIsETFModalOpen(true);
  const closeETFModal = () => setIsETFModalOpen(false);

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
        setMessage("Tables fetched successfully!");
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
        }), // Include the table name
      });

      const data = await response.json();

      if (response.ok) {
        setTableData(data);
        setMessage(`Data fetched for table: ${selectedTable}`);
      } else {
        setMessage(`Failed to fetch data: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error fetching data from the table.");
    }
  };

  const sendDataToBackend = async () => {
    if (!parsedCSVData.length) {
      alert("No data available to send.");
      return;
    }

    try {
      const transformedData = parsedCSVData.map((row) => ({
        Date: row.date || row.Date,
        Open: row.open || row.Open,
        High: row.high || row.High,
        Low: row.low || row.Low,
        Close: row.close || row.Close,
        "Adj Close": row.adjClose || row["Adj Close"] || row.AdjClose,
        Volume: row.volume || row.Volume,
      }));

      const response = await axios.post("http://127.0.0.1:8080/api/analyze", {
        data: transformedData,
      });

      const { result } = response.data;
      setResult(result);

      const historicalData = result.historical_data.slice(-20).map((row) => ({
        Date: row.Date,
        AdjClose: row["Adj Close"] || row.AdjClose,
        Predicted: null,
      }));

      if (result.predicted_price) {
        historicalData.push({
          Date: "Next Day",
          AdjClose: null,
          Predicted: result.predicted_price,
        });
      }

      setChartData(historicalData);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const fetchStockList = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/stocks");
      setStockList(response.data);
    } catch (error) {
      console.error("Error fetching stock list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStockModalOpen) {
      fetchStockList();
    }
  }, [isStockModalOpen]);

  const filteredStockList = stockList.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadFullListAsCSV = () => {
    if (stockList.length === 0) {
      alert("No stock or ETF data available to download.");
      return;
    }

    const csvHeader = "Ticker,Name\n";

    const csvRows = stockList
      .map((stock) => `${stock.ticker},${stock.name}`)
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "stock_etf_list.csv";
    link.click();
  };

  const closeStockModal = () => {
    setIsStockModalOpen(false);
  };

  const openStockModal = () => {
    setIsStockModalOpen(true);
  };

  console.log("Stock List:", stockList);

  return (
    <div className="App">
      <NewsBar />
      <DraggableModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Upload CSV"
      >
        <ChooseCSV
          className="test"
          setRowData={setRowData}
          setColumnDefs={setColumnDefs}
          setParsedData={setParsedCSVData}
        />
      </DraggableModal>
      <div className="flex-container">
        {/* Grid Section */}
        <div className="grid-wrapper">
          <button onClick={openETFModal} className="componentbutton">
            Download Stock
          </button>

          <DraggableModal
            isOpen={isETFModalOpen}
            onClose={closeETFModal}
            title="Download ETF Data"
          >
            <StandaloneETFDownloader />
          </DraggableModal>

          {isETFModalOpen && (
            <e isOpen={isETFModalOpen} onClose={closeETFModal} />
          )}

          <button className="componentbutton" onClick={openModal}>
            Choose File
          </button>

          <button className="componentbutton" onClick={openModal}>
            Save
          </button>

          <GridComponent rowData={rowData} columnDefs={columnDefs} />
        </div>

        {/* Chart Section */}
        <div className="chart-wrapper">
          <button className="componentbutton" onClick={sendDataToBackend}>
            Analyze
          </button>

          <ChartComponent
            chartData={chartData}
            result={result}
            onAnalyze={sendDataToBackend}
          />
        </div>
      </div>
    </div>
  );
}

export default StockPredictor;
