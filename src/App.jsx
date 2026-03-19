import React from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function App() {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
      
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "#000000" },
          particles: {
            number: { value: 80 },
            size: { value: 3 },
            move: { enable: true, speed: 2 },
            links: {
              enable: true,
              color: "#ffffff"
            }
          }
        }}
      />

      <h1 className="text-4xl z-10">FiiLTHY AI 🚀</h1>
    </div>
  );
}
