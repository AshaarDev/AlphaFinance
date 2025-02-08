import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./googleauth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (response) => {
    const googleToken = response.credential;
    login(googleToken);
    navigate("/");
  };

  const handleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="login-container">
      <h1>Welcome to the App</h1>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default LoginPage;
