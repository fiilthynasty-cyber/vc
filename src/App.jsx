// src/App.jsx
import React from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "@tsparticles/engine";

function App() {
  // Initialize tsparticles engine
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  // Particle options
  const particlesOptions = {
    background: {
      color: { value: "#0f172a" }, // Tailwind slate-900
    },
    fpsLimit: 60,
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
      },
      number: {
        value: 50,
      },
      opacity: {
        value: 0.5,
      },
      size: {
        value: { min: 1, max: 4 },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Particles Background */}
      <Particles init={particlesInit} options={particlesOptions} />

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4">VC App</h1>
        <p className="text-lg mb-8">
          Welcome to your Vite + React + Tailwind + Particles setup!
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
