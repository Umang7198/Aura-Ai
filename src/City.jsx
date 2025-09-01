import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For dynamic city routes
import axios from "axios";

// -------------------
// Fallback data
// -------------------
const fallbackData = {
  success: true,
  city: "Delhi",
  country: "India",
  current_vibe: {
    sentiment_score: 0.72,
    emotion: "positive",
    summary:
      "Delhi is buzzing with positivity today 🌞 fueled by cricket wins and great weather.",
  },
  weather: {
    temperature: "32°C",
    condition: "Sunny",
  },
  top_sources: {
    tweets: [
      { user: "@raj", text: "Delhi vibes are amazing today!" },
      { user: "@aura", text: "The city is glowing with festive energy 🎉" },
    ],
    news: [
      {
        headline: "Delhi celebrates cricket victory",
        url: "https://newsapi.org/example",
      },
      {
        headline: "Festivals bring cheerful energy to Delhi streets",
        url: "https://newsapi.org/example2",
      },
    ],
  },
};

// -------------------
// Utility: color by emotion
// -------------------
const getEmotionColor = (emotion) => {
  switch (emotion) {
    case "positive":
      return "text-green-500";
    case "negative":
      return "text-red-500";
    case "mixed":
      return "text-orange-500";
    default:
      return "text-gray-400";
  }
};

function City() {
  const { city_name } = useParams(); // e.g. /city/Delhi
  const [cityData, setCityData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/vibes/city/${city_name || "Delhi"}`)
      .then((res) => {
        if (res.data.success) {
          setCityData(res.data);
        } else {
          setCityData(fallbackData);
        }
      })
      .catch(() => {
        setCityData(fallbackData);
      });
  }, [city_name]);

  if (!cityData) return <div className="p-6 text-white">Loading...</div>;

  const { city, country, current_vibe, weather, top_sources } = cityData;

  // Share button handler
  const handleShare = async () => {
    const shareText = `${city}, ${country} Vibes 🌐\n${current_vibe.summary}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Aura.AI - ${city} Vibes`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col gap-8">
      {/* City Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-2">
          {city}, {country}
        </h1>
        <p className={`text-lg font-semibold ${getEmotionColor(current_vibe.emotion)}`}>
          {current_vibe.emotion.toUpperCase()} • Score: {current_vibe.sentiment_score}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">✨ City Vibe Summary</h2>
        <p className="text-zinc-300 text-lg">{current_vibe.summary}</p>
      </div>

      {/* Weather */}
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg w-64">
          <h3 className="text-xl font-semibold mb-2">🌦 Weather</h3>
          <p>{weather.temperature} • {weather.condition}</p>
        </div>
      </div>

      {/* Tweets & News */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Tweets */}
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">🐦 Live Tweets</h3>
          <ul className="space-y-3">
            {top_sources.tweets.map((tweet, idx) => (
              <li key={idx} className="border-b border-zinc-700 pb-2">
                <span className="text-indigo-400 font-semibold">{tweet.user}:</span>{" "}
                <span>{tweet.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* News */}
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">📰 News</h3>
          <ul className="space-y-3">
            {top_sources.news.map((article, idx) => (
              <li key={idx} className="border-b border-zinc-700 pb-2">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {article.headline}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Share Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleShare}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-lg font-semibold shadow-lg transition"
        >
          📤 Share City Vibes
        </button>
      </div>
    </div>
  );
}

export default City;
