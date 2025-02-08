import React, { useState, useEffect } from "react";
import { Download, Search } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import Papa from "papaparse";
import "./compcss/etfdownloader.css";

function transformETFData(rawData) {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    throw new Error("Invalid data structure from API");
  }

  return rawData.map((entry) => ({
    date: entry.date,
    open: entry.open,
    high: entry.high,
    low: entry.low,
    close: entry.close,
    adjClose: entry.adjClose || null,
    volume: entry.volume,
  }));
}

function downloadCSV(data, symbol) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${symbol}_historical_data.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function StandaloneETFDownloader() {
  const [etfs, setETFs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchETFs = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/stocks");
        setETFs(response.data || []);
      } catch (err) {
        setError("Failed to load ETF data. Please try again later.");
      }
    };
    fetchETFs();
  }, []);

  const filteredETFs = etfs.filter((etf) => {
    const symbol = etf.ticker || "";
    const name = etf.name || "";
    return (
      symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDownload = async (etf) => {
    try {
      setError(null);
      setDownloading(etf.ticker);
      const response = await axios.get(
        `http://localhost:5001/api/etf/${etf.ticker}`
      );
      const transformedData = transformETFData(response.data);
      downloadCSV(transformedData, etf.ticker);
    } catch (err) {
      setError(err.message || "Failed to download ETF data");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="etf-downloader-container">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search ETFs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Search className="search-icon w-5 h-5" />
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      <div className="etf-list">
        {filteredETFs.map((etf) => (
          <div key={etf.ticker} className="etf-item">
            <div>
              <h3 className="etf-item-title">{etf.ticker}</h3>
              <p className="etf-item-description">{etf.name}</p>
            </div>
            <button
              onClick={() => handleDownload(etf)}
              disabled={downloading === etf.ticker}
              className="download-button"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading === etf.ticker ? "Downloading..." : "Download"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
