import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to the Data Analysis App</h1>
      <Link to="/stock-predictor">
        <button>Go to Stock Predictor</button>
      </Link>
    </div>
  );
}

export default Home;
