import React from "react";

export default function FeatureList() {
  const features = [
    "Modular Prompt Builder",
    "Random Casino Spinner",
    "System Health Monitor",
    "Backend Testing",
    "Supabase Integration",
    "Full AI Stack Ready",
  ];

  return (
    <div className="mt-6">
      <h3 className="font-orbitron text-xs neon-green mb-2">FEATURES</h3>
      <ul className="font-mono-tech text-gray-400 list-disc list-inside">
        {features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>
  );
}
