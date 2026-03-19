// src/App.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const tabs = ["Builder", "Casino", "System", "Backend"];
  const [activeTab, setActiveTab] = useState("Builder");
  const [backendData, setBackendData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch backend data only when Backend tab is active
  useEffect(() => {
    async function fetchBackend() {
      const { data, error } = await supabase.from("test_table").select("*");
      if (error) setError(error.message);
      else setBackendData(data);
    }
    if (activeTab === "Backend") fetchBackend();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-green-400 font-orbitron p-6">
      <h1 className="text-5xl text-center mb-10 animate-pulse">⚡ Quantum Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg border transition-all duration-300 ${
              activeTab === tab
                ? "bg-green-400 text-black border-green-400 shadow-lg shadow-green-400/50"
                : "border-green-400 hover:bg-green-700 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === "Builder" && (
          <div className="bg-green-900 p-6 rounded-xl shadow-lg shadow-green-400/30 hover:scale-105 transition-transform">
            <h2 className="text-2xl mb-4">💡 Builder Module</h2>
            <p>Create and manage AI prompts here. 🚀</p>
          </div>
        )}

        {activeTab === "Casino" && (
          <div className="bg-green-900 p-6 rounded-xl shadow-lg shadow-green-400/30 hover:scale-105 transition-transform">
            <h2 className="text-2xl mb-4">🎰 Casino Module</h2>
            <p>Test fun random games or AI-based simulations here.</p>
          </div>
        )}

        {activeTab === "System" && (
          <div className="bg-green-900 p-6 rounded-xl shadow-lg shadow-green-400/30 hover:scale-105 transition-transform">
            <h2 className="text-2xl mb-4">🛠 System Info</h2>
            <p>Server and app status info will appear here.</p>
          </div>
        )}

        {activeTab === "Backend" && (
          <div className="bg-green-900 p-6 rounded-xl shadow-lg shadow-green-400/30 hover:scale-105 transition-transform">
            <h2 className="text-2xl mb-4">🖥 Backend Data</h2>
            {error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(backendData, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
