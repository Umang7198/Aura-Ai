import React, { useEffect, useState } from "react";
import axios from "axios";

// -------------------
// Fallback Data
// -------------------
const fallbackData = {
  success: true,
  alerts: [
    {
      city: "Delhi",
      trigger: "negative spike",
      message: "Delhi mood dropped sharply due to traffic chaos 🚦",
      timestamp: "2025-08-21T09:00:00Z",
    },
    {
      city: "London",
      trigger: "positive surge",
      message: "London mood lifted due to a major festival 🎉",
      timestamp: "2025-08-20T18:00:00Z",
    },
  ],
};

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [city, setCity] = useState("");
  const [trigger, setTrigger] = useState("negative");
  const [subscriptions, setSubscriptions] = useState([]);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/vibes/alerts")
      .then((res) => {
        if (res.data.success) {
          setAlerts(res.data.alerts);
        } else {
          setAlerts(fallbackData.alerts);
        }
      })
      .catch(() => {
        setAlerts(fallbackData.alerts);
      });
  }, []);

  // Add a subscription
  const handleAddSubscription = () => {
    if (city.trim() !== "") {
      setSubscriptions([
        ...subscriptions,
        { city, trigger, id: Date.now().toString() },
      ]);
      setCity("");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center">🔔 Alerts & Notifications</h1>

      {/* Manage Subscriptions */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">➕ Add Alert Subscription</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city (e.g., Delhi)"
            className="px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 w-full md:w-auto"
          />
          <select
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className="px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600"
          >
            <option value="negative">Negative Spike</option>
            <option value="positive">Positive Surge</option>
            <option value="mixed">Mixed Mood</option>
          </select>
          <button
            onClick={handleAddSubscription}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-md"
          >
            Add
          </button>
        </div>

        {/* Show Active Subscriptions */}
        {subscriptions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">📌 Active Subscriptions</h3>
            <ul className="space-y-2">
              {subscriptions.map((sub) => (
                <li
                  key={sub.id}
                  className="bg-zinc-700 px-4 py-2 rounded-lg flex justify-between"
                >
                  <span>
                    {sub.city} — {sub.trigger}
                  </span>
                  <button
                    onClick={() =>
                      setSubscriptions(
                        subscriptions.filter((s) => s.id !== sub.id)
                      )
                    }
                    className="text-red-400 hover:text-red-500"
                  >
                    ❌ Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">⚙️ Notification Settings</h2>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={() => setNotifyEmail(!notifyEmail)}
              className="w-5 h-5"
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifyPush}
              onChange={() => setNotifyPush(!notifyPush)}
              className="w-5 h-5"
            />
            Push Notifications
          </label>
        </div>
      </div>

      {/* Alert History */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">📜 Alert History</h2>
        <ul className="space-y-4">
          {alerts.map((alert, idx) => (
            <li
              key={idx}
              className="border-b border-zinc-700 pb-3 flex flex-col gap-1"
            >
              <p className="font-semibold">
                {alert.city} — {alert.trigger}
              </p>
              <p className="text-zinc-300">{alert.message}</p>
              <span className="text-sm text-zinc-400">
                {new Date(alert.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Alerts;
