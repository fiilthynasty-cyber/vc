import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const tabs = ["Builder", "Casino", "System", "Backend"];
  const [activeTab, setActiveTab] = useState("Builder");
  const [backendData, setBackendData] = useState([]);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");

  // Fetch backend data
  const fetchBackend = async () => {
    const { data, error } = await supabase.from("test_table").select("*");
    if (error) setError(error.message);
    else setBackendData(data);
  };

  useEffect(() => {
    if (activeTab === "Backend") fetchBackend();
  }, [activeTab]);

  // Add new record (Builder tab)
  const addRecord = async () => {
    if (!newName) return;
    const { error } = await supabase.from("test_table").insert([{ name: newName }]);
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Record added!");
      setNewName("");
      if (activeTab === "Backend") fetchBackend();
    }
  };

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
            <input
              type="text"
              placeholder="Enter name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="p-2 rounded border border-green-400 mb-4 w-full text-black"
            />
            <button
              onClick={addRecord}
              className="px-4 py-2 bg-green-400 text-black rounded hover:bg-green-600"
            >
              Add Record
            </button>
          </div>
        )}

        {activeTab === "Casino" && (
          <div className="bg-green-900 p-6 rounded-xl shadow-lg shadow-green-400/30 hover:scale-105 transition-transform">
            <h2 className="text-2xl mb-4">🎰 Casino Module</h2>
            <button
              onClick={() => alert("You spun the quantum slot! 🎰")}
              className="px-4 py-2 bg-green-400 text-black rounded hover:bg-green-600"
            >
              Spin!
            </button>
          </div>
        )}

        {activeTab === "System" && (
          <div className="bg-green-900 p-6 rounded-xl shadow-lg shadow-green-400/30 hover:scale-105 transition-transform">
            <h2 className="text-2xl mb-4">🛠 System Info</h2>
            <p>Server is live and running 🚀</p>
            <p>Backend records: {backendData.length}</p>
          </div>
        )}

        {activeTab === "Backend" && (
          <div className="bg-green-900 p-6 rounded-xl shadow-lg shadow-green-400/30 hover:scale-105 transition-transform">
            <h2 className="text-2xl mb-4">🖥 Backend Data</h2>
            {error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <pre className="text-sm overflow-x-auto">{JSON.stringify(backendData, null, 2)}</pre>
            )}
            <button
              onClick={fetchBackend}
              className="mt-4 px-4 py-2 bg-green-400 text-black rounded hover:bg-green-600"
            >
              Refresh Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
