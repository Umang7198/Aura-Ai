import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// -------------------
// Fallback Data
// -------------------
const fallbackData = {
  success: true,
  query: "IPL Final",
  results: [
    {
      city: "Mumbai",
      date: "2024-05-29",
      summary: "Mumbai was ecstatic 🎉 after the IPL final win.",
      sentiment_score: 0.8,
    },
    {
      city: "Delhi",
      date: "2023-10-15",
      summary: "Delhi was tense during elections, mixed emotions across the city 🗳️.",
      sentiment_score: -0.1,
    },
    {
      city: "Tokyo",
      date: "2021-07-23",
      summary: "Tokyo was buzzing with positivity during the Olympics opening 🎇.",
      sentiment_score: 0.9,
    },
    {
      city: "London",
      date: "2022-09-08",
      summary: "London was in mourning after a historic event 🖤.",
      sentiment_score: -0.6,
    },
  ],
};

// Utility: color score
const getBarColor = (score) => {
  if (score > 0.5) return "#22c55e"; // green
  if (score < -0.2) return "#ef4444"; // red
  return "#f97316"; // orange
};

function Events() {
  const [query, setQuery] = useState("IPL Final");
  const [archive, setArchive] = useState(null);

  const handleSearch = () => {
    axios
      .get(`http://localhost:8000/api/v1/vibes/archive/search?q=${query}`)
      .then((res) => {
        if (res.data.success) {
          setArchive(res.data);
        } else {
          setArchive(fallbackData);
        }
      })
      .catch(() => setArchive(fallbackData));
  };

  // initial load with fallback
  useEffect(() => {
    setArchive(fallbackData);
  }, []);

  if (!archive) return <div className="p-6 text-white">Loading archive...</div>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col gap-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-2">📜 Mood Archive</h1>
        <p className="text-lg text-zinc-400">
          Search past moods & emotional events
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center gap-4">
        <input
          type="text"
          placeholder="🔍 Search events (e.g., IPL Final, Elections, Olympics)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 w-80"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-md"
        >
          Search
        </button>
      </div>

      {/* Results List */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">📍 Results for "{archive.query}"</h2>
        <ul className="space-y-4">
          {archive.results.map((event, idx) => (
            <li
              key={idx}
              className="border-b border-zinc-700 pb-3 flex flex-col gap-1"
            >
              <p className="font-semibold text-lg">
                {event.city} — {new Date(event.date).toDateString()}
              </p>
              <p className="text-zinc-300">{event.summary}</p>
              <p className="text-sm text-zinc-400">
                Sentiment Score:{" "}
                <span
                  className="font-bold"
                  style={{ color: getBarColor(event.sentiment_score) }}
                >
                  {event.sentiment_score}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Sentiment Intensity Chart */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">📊 Emotional Intensity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={archive.results}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="city" stroke="#ccc" />
            <YAxis domain={[-1, 1]} stroke="#ccc" />
            <Tooltip />
            <Bar
              dataKey="sentiment_score"
              fill="#60a5fa"
              name="Sentiment Score"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Events;
