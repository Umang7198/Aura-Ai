import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

// -------------------
// Fallback data
// -------------------
const fallbackData = {
  success: true,
  timestamp: "2025-08-21T10:00:00Z",
  data: [
    {
      city: "Delhi",
      country: "India",
      coordinates: { lat: 28.6139, lon: 77.209 },
      sentiment_score: 0.72,
      emotion: "positive",
      intensity: "high",
    },
    {
      city: "London",
      country: "UK",
      coordinates: { lat: 51.5074, lon: -0.1278 },
      sentiment_score: -0.35,
      emotion: "negative",
      intensity: "medium",
    },
    {
      city: "New York",
      country: "USA",
      coordinates: { lat: 40.7128, lon: -74.006 },
      sentiment_score: 0.1,
      emotion: "mixed",
      intensity: "low",
    },
    {
      city: "Tokyo",
      country: "Japan",
      coordinates: { lat: 35.6895, lon: 139.6917 },
      sentiment_score: 0.55,
      emotion: "positive",
      intensity: "medium",
    },
  ],
};

// -------------------
// Utility: color by emotion
// -------------------
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

function Vibe() {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  // Fetch API with fallback
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/vibes/map")
      .then((res) => {
        if (res.data.success) {
          setCities(res.data.data);
        } else {
          setCities(fallbackData.data);
        }
      })
      .catch(() => {
        setCities(fallbackData.data);
      });
  }, []);

  // -------------------
  // Filtering logic
  // -------------------
  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      search === "" ||
      city.city.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase());

    const matchesEmotion =
      emotionFilter === "all" || city.emotion === emotionFilter;

    const matchesRegion =
      regionFilter === "all" ||
      (regionFilter === "Asia" &&
        ["India", "Japan", "China"].includes(city.country)) ||
      (regionFilter === "Europe" &&
        ["UK", "Germany", "France"].includes(city.country)) ||
      (regionFilter === "North America" &&
        ["USA", "Canada"].includes(city.country));

    return matchesSearch && matchesEmotion && matchesRegion;
  });

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Filters Section */}
      <div className="p-4 bg-zinc-900 text-white flex flex-wrap gap-4 items-center justify-between shadow-md z-10">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search city or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Emotion Filter */}
        <select
          value={emotionFilter}
          onChange={(e) => setEmotionFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Emotions</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
          <option value="mixed">Mixed</option>
        </select>

        {/* Region Filter */}
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Regions</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="North America">North America</option>
        </select>

        {/* Time Range Filter */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Map Section */}
      <div className="flex-1">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* Base Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Filtered City Markers */}
          {filteredCities.map((city, index) => (
            <CircleMarker
              key={index}
              center={[city.coordinates.lat, city.coordinates.lon]}
              pathOptions={{
                color: getColor(city.emotion),
                fillColor: getColor(city.emotion),
                fillOpacity: 0.6,
              }}
              radius={10}
            >
              <Popup>
                <div>
                  <h2 className="font-bold text-lg">
                    {city.city}, {city.country}
                  </h2>
                  <p>
                    Emotion:{" "}
                    <span className="font-semibold">{city.emotion}</span>
                  </p>
                  <p>Sentiment Score: {city.sentiment_score}</p>
                  <p>Intensity: {city.intensity}</p>
                  <p className="text-sm text-zinc-400">
                    Data Range: {timeRange}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Vibe;
