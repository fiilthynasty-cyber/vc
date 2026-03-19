import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Particles from "react-tsparticles";

export default function App() {
  const tabs = ["Builder", "Casino", "System", "Backend"];
  const [activeTab, setActiveTab] = useState("Builder");
  const [backendData, setBackendData] = useState([]);
  const [newName, setNewName] = useState("");
  const [casinoResult, setCasinoResult] = useState("");

  // Fetch backend data
  const fetchBackend = async () => {
    const { data, error } = await supabase.from("test_table").select("*");
    if (!error) setBackendData(data);
  };

  useEffect(() => {
    if (activeTab === "Backend") fetchBackend();

    const subscription = supabase
      .from("test_table")
      .on("INSERT", () => fetchBackend())
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [activeTab]);

  // Add record (Builder)
  const addRecord = async () => {
    if (!newName) return;
    await supabase.from("test_table").insert([{ name: newName }]);
    setNewName("");
  };

  // Spin Casino
  const spinCasino = () => {
    const emojis = ["🎰", "💎", "🍀", "🪙", "⚡", "🔥"];
    const result = Array.from({ length: 3 }, () =>
      emojis[Math.floor(Math.random() * emojis.length)]
    ).join(" ");
    setCasinoResult(result);
  };

  return (
    <div className="relative min-h-screen font-orbitron overflow-hidden">
      {/* Particles Background */}
      <Particles
        options={{
          background: { color: "#000000" },
          fpsLimit: 60,
          interactivity: { events: { onHover: { enable: true, mode: "repulse" } } },
          particles: {
            color: { value: "#00ff99" },
            links: { enable: true, color: "#00ff99", distance: 150 },
            move: { enable: true, speed: 1 },
            number: { value: 80 },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center text-green-400 p-6">
        <h1 className="text-6xl mb-10 text-center animate-flicker">
          ⚡ Quantum Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10 z-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg border transition-all duration-300
                ${
                  activeTab === tab
                    ? "bg-green-400 text-black border-green-400 shadow-neon"
                    : "border-green-400 hover:bg-green-700 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl z-10">
          {/* Builder */}
          {activeTab === "Builder" && (
            <div className="bg-green-900/50 p-6 rounded-xl shadow-neon hover:scale-105 transition-transform">
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

          {/* Casino */}
          {activeTab === "Casino" && (
            <div className="bg-green-900/50 p-6 rounded-xl shadow-neon hover:scale-105 transition-transform text-center">
              <h2 className="text-2xl mb-4">🎰 Quantum Casino</h2>
              <button
                onClick={spinCasino}
                className="px-6 py-2 bg-green-400 text-black rounded hover:bg-green-600 mb-4"
              >
                Spin!
              </button>
              <div className="text-4xl animate-flicker">{casinoResult}</div>
            </div>
          )}

          {/* System */}
          {activeTab === "System" && (
            <div className="bg-green-900/50 p-6 rounded-xl shadow-neon hover:scale-105 transition-transform">
              <h2 className="text-2xl mb-4">🛠 System Info</h2>
              <p>Server is live and running 🚀</p>
              <p>Backend records: {backendData.length}</p>
            </div>
          )}

          {/* Backend */}
          {activeTab === "Backend" && (
            <div className="bg-green-900/50 p-6 rounded-xl shadow-neon hover:scale-105 transition-transform">
              <h2 className="text-2xl mb-4">🖥 Backend Data</h2>
              {backendData.length === 0 ? (
                <p>No records yet.</p>
              ) : (
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(backendData, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Flicker Animation */}
      <style>{`
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 22%, 24%, 55% { opacity: 0.2; }
        }
        .animate-flicker {
          animation: flicker 1.5s infinite;
        }
        .shadow-neon {
          box-shadow: 0 0 10px #00ff99, 0 0 20px #00ff99, 0 0 30px #00ff99;
        }
      `}</style>
    </div>
  );
}
