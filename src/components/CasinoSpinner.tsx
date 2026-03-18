import React, { useState } from "react";

export default function CasinoSpinner() {
  const [result, setResult] = useState("");

  const spin = () => {
    const outcomes = ["🎲 Dice Roll", "🃏 Joker Card", "💎 Gem", "⚡ Lightning"];
    setResult(outcomes[Math.floor(Math.random() * outcomes.length)]);
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-green-900 text-black font-bold rounded hover:bg-green-700"
        onClick={spin}
      >
        SPIN
      </button>
      {result && <p className="mt-4 font-mono-tech text-green-400">{result}</p>}
    </div>
  );
}
