import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// -------------------
// Fallback Data
// -------------------
const fallbackData = {
  success: true,
  user: {
    id: "12345",
    name: "Sahil Raj",
    preferred_cities: ["Delhi", "London"],
    notifications_enabled: true,
  },
};

function User() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [preferredCities, setPreferredCities] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const [newCity, setNewCity] = useState("");
  const navigate = useNavigate();

  // Fetch API or fallback
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/user/profile")
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          setName(res.data.user.name);
          setPreferredCities(res.data.user.preferred_cities);
          setNotificationsEnabled(res.data.user.notifications_enabled);
        } else {
          setUser(fallbackData.user);
          setName(fallbackData.user.name);
          setPreferredCities(fallbackData.user.preferred_cities);
          setNotificationsEnabled(fallbackData.user.notifications_enabled);
        }
      })
      .catch(() => {
        setUser(fallbackData.user);
        setName(fallbackData.user.name);
        setPreferredCities(fallbackData.user.preferred_cities);
        setNotificationsEnabled(fallbackData.user.notifications_enabled);
      });
  }, []);

  if (!user) return <div className="p-6 text-white">Loading profile...</div>;

  // Handle Save
  const handleSave = () => {
    const updatedProfile = {
      id: user.id,
      name,
      preferred_cities: preferredCities,
      notifications_enabled: notificationsEnabled,
    };

    console.log("Saving Profile:", updatedProfile);

    // Here you’d normally call PUT/PATCH API
    // axios.put("http://localhost:8000/api/v1/user/profile", updatedProfile)

    // Redirect after save
    navigate("/");
  };

  // Add a city to preferred list
  const addCity = () => {
    if (newCity.trim() !== "" && !preferredCities.includes(newCity)) {
      setPreferredCities([...preferredCities, newCity]);
      setNewCity("");
    }
  };

  // Remove a city
  const removeCity = (city) => {
    setPreferredCities(preferredCities.filter((c) => c !== city));
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center">👤 User Profile & Settings</h1>

      {/* Personal Info */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">Personal Info</h2>
        <label className="block mb-3">
          <span className="font-semibold">Name:</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 w-full"
          />
        </label>
      </div>

      {/* Preferred Cities */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">🌍 Preferred Cities</h2>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Add a city"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 flex-1"
          />
          <button
            onClick={addCity}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold"
          >
            Add
          </button>
        </div>
        <ul className="flex flex-wrap gap-3">
          {preferredCities.map((city, idx) => (
            <li
              key={idx}
              className="px-4 py-2 bg-zinc-700 rounded-lg flex items-center gap-2"
            >
              {city}
              <button
                onClick={() => removeCity(city)}
                className="text-red-400 hover:text-red-500"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Notification Preferences */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            className="w-5 h-5"
          />
          Enable Notifications
        </label>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-md"
        >
          💾 Save & Redirect
        </button>
      </div>
    </div>
  );
}

export default User;
