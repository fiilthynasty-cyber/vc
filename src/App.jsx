import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

function App() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "#000" },
          particles: {
            number: { value: 50 },
            size: { value: 3 },
            move: { enable: true, speed: 2 }
          }
        }}
      />

      <h1 className="text-4xl font-bold z-10">
        🚀 FiiLTHY AI APP
      </h1>
    </div>
  );
}

export default App;
