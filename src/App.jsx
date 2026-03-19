// src/App.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import BackendTest from "./components/BackendTest";

export default function App() {
  const tabs = ["Builder", "Casino", "System", "Backend"];
  const [activeTab, setActiveTab] = useState("Builder");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch Supabase data for Backend tab
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("test_table").select("*");
      if (error) setError(error.message);
      else setData(data);
    }
    if (activeTab === "Backend") fetchData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-neon-green font-orbitron p-6">
      <h1 className="text-4xl mb-6 text-center neon-green">🚀 Quantum UI</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md border border-neon-green transition ${
              activeTab === tab
                ? "bg-neon-green text-black"
                : "hover:bg-green-900"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-green-900 p-6 rounded-md min-h-[300px]">
        {activeTab === "Builder" && <p>💡 Builder UI coming soon...</p>}
        {activeTab === "Casino" && <p>🎰 Casino module coming soon...</p>}
        {activeTab === "System" && <p>🛠️ System info will be here...</p>}
        {activeTab === "Backend" && (
          <div>
            <h2 className="text-2xl mb-4">Backend Test</h2>
            {error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
