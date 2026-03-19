import React, { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

// Your live backend URL
const API_URL = "https://one-shxr.onrender.com";

export default function App() {
  const [data, setData] = useState(null); // store backend data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  // Fetch data from backend on component mount
  useEffect(() => {
    fetch(`${API_URL}/api/your-endpoint`) // <-- Replace with your actual backend route
      .then((res) => {
        if (!res.ok) throw new Error("Network response not OK");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch data from backend");
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center">
      {/* Particle background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "#000000" },
          particles: {
            number: { value: 80 },
            size: { value: 3 },
            move: { enable: true, speed: 2 },
            links: { enable: true, color: "#ffffff" },
          },
        }}
      />

      {/* App Title */}
      <h1 className="text-4xl z-10 mb-4">FiiLTHY AI 🚀</h1>

      {/* Loading state */}
      {loading && <p className="z-10">Loading data...</p>}

      {/* Error state */}
      {error && <p className="z-10 text-red-500">{error}</p>}

      {/* Display backend data */}
      {data && (
        <pre className="z-10 bg-gray-900 p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
