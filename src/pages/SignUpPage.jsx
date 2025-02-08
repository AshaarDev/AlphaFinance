import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./pagecss/signup.css";

function SignUpPage() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleSuccess = (credentialResponse) => {
    fetch("http://localhost:5001/api/auth/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credentialResponse.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser({ name: data.user.name, picture: data.user.picture });
          navigate("/app");
        }
      })
      .catch((err) => console.error("Error during login:", err));
  };

  const handleError = () => {
    console.error("Google Login Failed");
  };

  const handleLogout = () => {
    googleLogout();
    fetch("http://localhost:5001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        setUser({ name: "Guest", picture: "https://via.placeholder.com/40" });
        navigate("/");
      })
      .catch((err) => console.error("Error during logout:", err));
  };

  return (
    <div className="signup-container">
      <h1 className="typing-text">
        Welcome{" "}
        {user.name === "Guest"
          ? "to the Financial Analysis App"
          : `, ${user.name}`}
      </h1>
      {user.name === "Guest" ? (
        <>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            className="login-button"
          />
          <Link to="/home" className="go-to-app-link">
            Or continue to App as Guest
          </Link>
        </>
      ) : (
        <>
          <button onClick={handleLogout} className="logout-button">
            Sign Out of Google
          </button>
          <Link to="/app" className="go-to-app-link">
            Continue to App
          </Link>
        </>
      )}
    </div>
  );
}

export default SignUpPage;
