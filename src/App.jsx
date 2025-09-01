import React from "react";

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white flex flex-col">
      
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          🌐 Aura.AI
        </h1>
        <p className="text-xl md:text-2xl font-light text-zinc-300 mb-8">
          The Real-Time City Vibe Tracker
        </p>
        <p className="max-w-2xl text-lg text-zinc-400 mb-12">
          Decode the emotional heartbeat of cities worldwide. 
          Get real-time mood insights powered by AI, social media, 
          news, and weather signals.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-lg font-semibold shadow-lg transition">
            Explore Vibes
          </button>
          <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-2xl text-lg font-semibold shadow-lg transition">
            Dashboard
          </button>
          <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-2xl text-lg font-semibold shadow-lg transition">
            Get Alerts
          </button>
        </div>
      </header>

      {/* Live Vibe Preview Widget */}
      <section className="flex flex-col items-center justify-center py-12 px-6">
        <h2 className="text-2xl font-semibold mb-4">🌍 Live City Vibe Preview</h2>
        <div className="w-[90%] md:w-[600px] h-64 bg-zinc-800 rounded-2xl shadow-lg flex items-center justify-center text-zinc-400">
          <span>Interactive Map / Heatmap Placeholder</span>
        </div>
      </section>

    </div>
  );
}

export default App;
