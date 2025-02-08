import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./googleauth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSuccess = (response) => {
    setIsLoading(true);
    setError(null);

    const googleToken = response.credential;
    login(googleToken)
      .then(() => navigate("/"))
      .catch((err) => {
        console.error("Error during login:", err);
        setError("Login failed. Please try again.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleError = () => {
    setError("Login failed. Please try again.");
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
