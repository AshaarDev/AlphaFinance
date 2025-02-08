import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import SignUpPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import StockPredictor from "./pages/StockPredictor";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./context/UserContext";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (isCollapsed) => {
    setIsSidebarCollapsed(isCollapsed);
    };

    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <UserProvider>
        <BrowserRouter>
          <div style={{ display: "flex" }}>
            <Sidebar onToggle={handleSidebarToggle} />
            <div
              className="app-content"
              style={{
                marginLeft: isSidebarCollapsed ? "80px" : "230px",
                transition: "margin-left 0.3s ease-in-out",
              }}
            >
              <Routes>
                <Route path="/" element={<SignUpPage />} />
                <Route path="/home" element={<Home  />} />
                <Route path="/app" element={<StockPredictor />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        </UserProvider>
      </GoogleOAuthProvider>
    );
}

export default App;
