import React, { useState } from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

const API_URL = "https://one-shxr.onrender.com"; // your backend URL

export default function App() {
  const [prompt, setPrompt] = useState(""); // store generated prompt
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(null); // error state

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  // Function to fetch a new prompt
  const generatePrompt = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/generate-prompt`);
      if (!res.ok) throw new Error("Failed to fetch prompt");
      const data = await res.json();
      setPrompt(data.prompt);
    } catch (err) {
      console.error(err);
      setError("Could not generate prompt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center p-4">
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

      {/* Title */}
      <h1 className="text-4xl z-10 mb-4">FiiLTHY AI 🚀</h1>

      {/* Generate Button */}
      <button
        onClick={generatePrompt}
        className="z-10 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
      >
        {loading ? "Generating..." : "Generate Prompt"}
      </button>

      {/* Error */}
      {error && <p className="z-10 text-red-500 mt-2">{error}</p>}

      {/* Generated Prompt */}
      {prompt && (
        <div className="z-10 mt-4 bg-gray-900 p-4 rounded max-w-xl text-center">
          {prompt}
        </div>
      )}
    </div>
  );
}
