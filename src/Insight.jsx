import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { saveAs } from "file-saver";

// -------------------
// Fallback Data
// -------------------
const fallbackData = {
  success: true,
  city: "Delhi",
  engagement_insights: {
    best_time_to_post: "Evening",
    dominant_emotion: "positive",
    recommendation: "Engage with uplifting content today.",
  },
  charts: {
    emotion_distribution: {
      positive: 60,
      negative: 25,
      neutral: 15,
    },
  },
};

// Pie chart colors
const COLORS = ["#22c55e", "#ef4444", "#a3a3a3"];

function Insight() {
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/vibes/dashboard?city=Delhi")
      .then((res) => {
        if (res.data.success) {
          setInsight(res.data);
        } else {
          setInsight(fallbackData);
        }
      })
      .catch(() => {
        setInsight(fallbackData);
      });
  }, []);

  if (!insight) return <div className="p-6 text-white">Loading insights...</div>;

  const { city, engagement_insights, charts } = insight;

  // Prepare pie chart data
  const pieData = [
    { name: "Positive", value: charts.emotion_distribution.positive },
    { name: "Negative", value: charts.emotion_distribution.negative },
    { name: "Neutral", value: charts.emotion_distribution.neutral },
  ];

  // Export CSV
  const exportCSV = () => {
    const csvContent =
      "City,Best Time,Dominant Emotion,Recommendation,Positive,Negative,Neutral\n" +
      `${city},${engagement_insights.best_time_to_post},${engagement_insights.dominant_emotion},${engagement_insights.recommendation},${charts.emotion_distribution.positive},${charts.emotion_distribution.negative},${charts.emotion_distribution.neutral}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${city}_insights.csv`);
  };

  // Export PDF (basic text export for now)
  const exportPDF = () => {
    const pdfContent = `
      City: ${city}
      Best Time to Post: ${engagement_insights.best_time_to_post}
      Dominant Emotion: ${engagement_insights.dominant_emotion}
      Recommendation: ${engagement_insights.recommendation}
      Emotion Distribution: Positive ${charts.emotion_distribution.positive}%, Negative ${charts.emotion_distribution.negative}%, Neutral ${charts.emotion_distribution.neutral}%
    `;
    const blob = new Blob([pdfContent], { type: "application/pdf" });
    saveAs(blob, `${city}_insights.pdf`);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-2">📊 Audience Insight Dashboard</h1>
        <p className="text-lg text-zinc-400">City: {city}</p>
      </div>

      {/* Engagement Insights */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">💡 Engagement Insights</h2>
        <p>
          <span className="font-semibold">Best Time to Post:</span>{" "}
          {engagement_insights.best_time_to_post}
        </p>
        <p>
          <span className="font-semibold">Dominant Emotion:</span>{" "}
          {engagement_insights.dominant_emotion}
        </p>
        <p className="mt-2 text-zinc-300">
          {engagement_insights.recommendation}
        </p>
      </div>

      {/* Emotion Distribution Chart */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">📍 Emotion Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-center gap-6">
        <button
          onClick={exportCSV}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-md"
        >
          📥 Export CSV
        </button>
        <button
          onClick={exportPDF}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg font-semibold shadow-md"
        >
          📄 Export PDF
        </button>
      </div>
    </div>
  );
}

export default Insight;
