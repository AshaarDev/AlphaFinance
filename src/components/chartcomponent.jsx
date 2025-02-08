import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./compcss/chart.css";

const ChartComponent = ({ chartData, onAnalyze, result }) => {
  return (
    <div className="chart-container">
      {/* Chart */}
      <div className="fixed-chart">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="Date"
              angle={-45}
              textAnchor="end"
              tick={{ fill: "#a0a0a0", fontSize: 10 }}
              height={90}
            />
            <YAxis
              domain={["auto", "auto"]}
              allowDataOverflow={true}
              tick={{ fill: "#a0a0a0" }}
              padding={{ top: 20, bottom: 20 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#2b2b3d", color: "#fff" }}
            />
            <Legend
              verticalAlign="top"
              iconSize={10}
              wrapperStyle={{
                color: "#ddd",
                fontSize: "14px",
                marginTop: "10px",
              }}
            />

            <Line
              type="monotone"
              dataKey="AdjClose"
              stroke="#00bcd4"
              strokeWidth={3}
              dot={false}
              name="Adjusted Closing Price"
            />

            <Line
              type="monotone"
              dataKey="Predicted"
              stroke="#ff4444"
              strokeWidth={3}
              dot={{ r: 6 }}
              name="Predicted Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Analysis Table */}
      <div className="analysis-table-container">
        <h3 className="analysis-title">Analysis Results</h3>
        <table className="analysis-table">
          <tbody>
            <tr>
              <td className="table-header">Predicted Price</td>
              <td>{result?.predicted_price || "N/A"}</td>
            </tr>
            <tr>
              <td className="table-header">Correlation with S&P 500</td>
              <td>{result?.correlation_with_sp500 || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChartComponent;
