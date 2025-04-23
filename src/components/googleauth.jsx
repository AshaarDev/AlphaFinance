import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSuccess = async (response) => {
    setIsLoading(true);
    setError(null);

    const googleToken = response.credential;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/google-login`,
        { token: googleToken },
        { withCredentials: true } 
      );

      console.log("✅ Login response:", res.data);
      navigate("/app"); 
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setError("Google login failed. Please try again.");
    console.error("Google Login Failed");
  };

  return (
    <div className="login-container">
      <h1>Welcome to the App</h1>
      {isLoading && <p>Logging in...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default LoginPage;
