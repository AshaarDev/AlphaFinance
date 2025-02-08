// NewsBar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./compcss/newsbar.css";

const NewsBar = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = "f25272fc730942f080de53a503e2c806";

  const fallbackNews = [
    { title: "Stock Market Hits Record High", url: "#" },
    { title: "Global Economy Shows Signs of Recovery", url: "#" },
    { title: "Tech Companies Lead the Market Surge", url: "#" },
    { title: "Investors Eye Federal Reserve's Next Move", url: "#" },
    { title: "Gold Prices on the Rise Amid Uncertainty", url: "#" },
  ];

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=business&apiKey=${API_KEY}`
      );
      setNews(response.data.articles);
      setError("");
    } catch (err) {
      setNews(fallbackNews);
      setError("Error fetching news. Using fallback.");
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="newsBar">
      {error && <p className="error">{error}</p>}
      <div className="newsContainer">
        {[...news, ...news].map((article, index) => (
          // Duplicating news items for seamless animation
          <div key={index} className="newsItem">
            <a
              className="news"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsBar;
