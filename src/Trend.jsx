import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// -------------------
// Fallback Data
// -------------------
const fallbackData = {
  success: true,
  city: "Delhi",
  historical: [
    { date: "2025-08-14", score: 0.5, weather: "Sunny" },
    { date: "2025-08-15", score: 0.7, weather: "Cloudy" },
    { date: "2025-08-16", score: 0.4, weather: "Rainy" },
    { date: "2025-08-17", score: 0.6, weather: "Sunny" },
    { date: "2025-08-18", score: 0.3, weather: "Stormy" },
    { date: "2025-08-19", score: 0.55, weather: "Cloudy" },
    { date: "2025-08-20", score: 0.75, weather: "Sunny" },
  ],
  forecast: [
    { date: "2025-08-21", predicted_score: 0.65, emotion: "positive" },
    { date: "2025-08-22", predicted_score: 0.6, emotion: "positive" },
    { date: "2025-08-23", predicted_score: 0.45, emotion: "mixed" },
  ],
};

// Utility: color based on emotion
const getColor = (emotion) => {
  switch (emotion) {
    case "positive":
      return "green";
    case "negative":
      return "red";
    case "mixed":
      return "orange";
    default:
      return "gray";
  }
};

function Trend() {
  const { city_name } = useParams(); // /trend/Delhi
  const [trendData, setTrendData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/vibes/trends/${city_name || "Delhi"}?range=7d`)
      .then((res) => {
        if (res.data.success) {
          setTrendData(res.data);
        } else {
          setTrendData(fallbackData);
        }
      })
      .catch(() => {
        setTrendData(fallbackData);
      });
  }, [city_name]);

  if (!trendData) return <div className="p-6 text-white">Loading trends...</div>;

  const { city, historical, forecast } = trendData;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col gap-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-2">📊 Mood Trends & Forecast</h1>
        <p className="text-lg text-zinc-400">City: {city}</p>
      </div>

      {/* Historical Trend Line Chart */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">📈 Historical Sentiment Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historical}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis domain={[-1, 1]} stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#4ade80"
              strokeWidth={3}
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weather Correlation (Bar Chart) */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">🌦 Weather Correlation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={historical}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis domain={[-1, 1]} stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#60a5fa" name="Sentiment Score" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-zinc-400 mt-4">
          Note: Bars show mood scores; check tooltip for weather conditions.
        </p>
      </div>

      {/* Forecast Section */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">🔮 Forecasted Mood Shifts</h2>
        <ul className="space-y-3">
          {forecast.map((f, idx) => (
            <li
              key={idx}
              className="flex justify-between border-b border-zinc-700 pb-2"
            >
              <span>{f.date}</span>
              <span className={`font-semibold ${getColor(f.emotion)}`}>
                {f.emotion} ({f.predicted_score})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Trend;
