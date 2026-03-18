import React from "react";

export default function FeatureList() {
  return (
    <div className="w-full max-w-xl bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Features Ready:</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>React + Vite</li>
        <li>Tailwind CSS v3.5.3</li>
        <li>Supabase Backend Integration</li>
        <li>Deploy-ready for Render</li>
      </ul>
    </div>
  );
}
