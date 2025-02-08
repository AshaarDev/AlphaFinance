import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaChartLine } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import "./compcss/sidebar.css";

function Sidebar({ onToggle }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    setIsInitialized(true);
    if (onToggle) onToggle(true);
  }, [onToggle]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onToggle) onToggle(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onToggle) onToggle(true);
  };

  return (
    <div
      className={`sidebar ${isHovered ? "expanded" : "collapsed"} ${
        isInitialized ? "" : "initial"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-logo">
        <span className="sidebar-logo-text">{isHovered && "Finance App"}</span>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/" className="sidebar-menu-item">
            <FaHome className="sidebar-icon" />
            {isHovered && <span>Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/app" className="sidebar-menu-item">
            <FaChartLine className="sidebar-icon" />
            {isHovered && <span>Stock Predictor</span>}
          </Link>
        </li>
      </ul>
      <div className="sidebar-profile-section">
        {isHovered ? (
          <div className="sidebar-profile-info">
            <img
              src={user.picture || "https://via.placeholder.com/40"}
              alt="Profile"
              className="sidebar-profile-img"
            />
            <div className="sidebar-profile-text">
              <p>{user.name}</p>
              <span>{user.name === "Guest" ? "Guest User" : ""}</span>
            </div>
          </div>
        ) : (
          <img
            src={user.picture || "https://via.placeholder.com/40"}
            alt="Profile"
            className="sidebar-profile-img"
          />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
