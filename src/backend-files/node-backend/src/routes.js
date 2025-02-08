import { Router } from "express";
import mysql from "mysql2/promise";
import axios from "axios";
import dotenv from "dotenv";
import pool from "./conn.js";

dotenv.config();

const routes = Router();

routes.get('/stocks', async (req, res) => {
  try {
    const response = await axios.get(
      'https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved',
      {
        params: {
          formatted: true,
          lang: 'en-US',
          region: 'US',
          scrIds: 'most_actives', // Screener for active stocks
          start: 0,
          count: 50,
        },
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      }
    );

    const stocks = response.data.finance.result[0]?.quotes.map((quote) => ({
      ticker: quote.symbol,
      name: quote.shortName || quote.longName,
    }));

    if (!stocks || stocks.length === 0) {
      throw new Error('No stocks found in the response.');
    }

    res.status(200).json(stocks);
  } catch (err) {
    console.error('Error fetching stocks:', err.message, err.response?.data);
    res.status(500).json({ message: 'Error fetching stocks', error: err.message });
  }
});

routes.get('/etf/:ticker', async (req, res) => {
  const { ticker } = req.params;

  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`,
      {
        params: {
          range: '1y', // 1 year of historical data
          interval: '1d', // Daily intervals
        },
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      }
    );

    const chartData = response.data.chart.result?.[0];
    if (!chartData) {
      throw new Error('No data available for this ETF.');
    }

    const { timestamp, indicators } = chartData;
    const quotes = indicators.quote[0];
    const adjClose = indicators.adjclose?.[0]?.adjclose || [];

    const historicalData = timestamp.map((time, index) => ({
      date: new Date(time * 1000).toISOString().split('T')[0],
      open: quotes.open[index],
      high: quotes.high[index],
      low: quotes.low[index],
      close: quotes.close[index],
      adjClose: adjClose[index] || null, // Handle missing adjusted close
      volume: quotes.volume[index],
    }));

    res.status(200).json(historicalData);
  } catch (err) {
    console.error(`Error fetching data for ${ticker}:`, err.message);
    res.status(500).json({ message: `Failed to fetch data for ${ticker}`, error: err.message });
  }
});

routes.get('/popular-etfs', (req, res) => {
  const popularETFs = [
    { symbol: "SPY", name: "SPDR S&P 500 ETF Trust" },
    { symbol: "QQQ", name: "Invesco QQQ Trust" },
    { symbol: "IWM", name: "iShares Russell 2000 ETF" },
    { symbol: "VTI", name: "Vanguard Total Stock Market ETF" },
    { symbol: "EFA", name: "iShares MSCI EAFE ETF" },
  ];

  res.status(200).json(popularETFs);
});

export default routes;
