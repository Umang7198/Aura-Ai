import React, { useEffect, useState } from "react";
import axios from "axios";

// -------------------
// Fallback Data
// -------------------
const fallbackData = {
  success: true,
  location: "Mumbai, India",
  mood: {
    sentiment_score: -0.1,
    emotion: "mixed",
    summary:
      "Mumbai is feeling a bit moody with rain showers and traffic frustration 🌧️.",
  },
  trending: [
    { city: "Delhi", emotion: "positive" },
    { city: "Bangalore", emotion: "neutral" },
    { city: "London", emotion: "negative" },
  ],
  best_vibes: [
    { city: "Tokyo", emotion: "positive" },
    { city: "Sydney", emotion: "positive" },
    { city: "San Francisco", emotion: "positive" },
  ],
};

// Utility for emotion color
const getEmotionColor = (emotion) => {
  switch (emotion) {
    case "positive":
      return "text-green-500";
    case "negative":
      return "text-red-500";
    case "mixed":
      return "text-orange-500";
    case "neutral":
      return "text-gray-400";
    default:
      return "text-gray-300";
  }
};

function Mood() {
  const [feed, setFeed] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    // Try getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          axios
            .get(
              `http://localhost:8000/api/v1/vibes/feed?lat=${latitude}&lon=${longitude}`
            )
            .then((res) => {
              if (res.data.success) {
                setFeed(res.data);
              } else {
                setFeed(fallbackData);
              }
            })
            .catch(() => setFeed(fallbackData));
        },
        () => {
          // If user blocks location → fallback
          setFeed(fallbackData);
        }
      );
    } else {
      setFeed(fallbackData);
    }
  }, []);

  if (!feed) return <div className="p-6 text-white">Loading mood feed...</div>;

  const handleSubscribe = (city) => {
    if (!subscriptions.includes(city)) {
      setSubscriptions([...subscriptions, city]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col gap-8">
      {/* Current Location Mood */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📍 {feed.location}</h1>
        <p className={`text-lg font-semibold ${getEmotionColor(feed.mood.emotion)}`}>
          {feed.mood.emotion.toUpperCase()} • Score: {feed.mood.sentiment_score}
        </p>
        <p className="text-zinc-300 mt-4 text-lg">{feed.mood.summary}</p>
      </div>

      {/* Trending Headlines */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">🔥 Trending Mood Headlines</h2>
        <ul className="space-y-3">
          {feed.trending.map((trend, idx) => (
            <li
              key={idx}
              className="flex justify-between border-b border-zinc-700 pb-2"
            >
              <span>{trend.city}</span>
              <span className={`font-semibold ${getEmotionColor(trend.emotion)}`}>
                {trend.emotion}
              </span>
              <button
                onClick={() => handleSubscribe(trend.city)}
                className="ml-4 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
              >
                Subscribe
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Best Vibe Cities */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">🌍 Best Vibe Cities Right Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feed.best_vibes.map((city, idx) => (
            <div
              key={idx}
              className="bg-zinc-700 p-4 rounded-xl text-center shadow-md"
            >
              <h3 className="text-xl font-semibold">{city.city}</h3>
              <p className={`mt-2 ${getEmotionColor(city.emotion)}`}>
                {city.emotion}
              </p>
              <button
                onClick={() => handleSubscribe(city.city)}
                className="mt-3 px-3 py-1 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-4">🔔 Your Subscriptions</h2>
          <ul className="flex flex-wrap gap-3">
            {subscriptions.map((city, idx) => (
              <li
                key={idx}
                className="px-4 py-2 bg-indigo-700 rounded-lg shadow-md"
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Mood;
