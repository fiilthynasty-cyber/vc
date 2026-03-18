import React, { useState } from "react";

export default function PromptBuilder() {
  const [prompt, setPrompt] = useState("");

  return (
    <div>
      <textarea
        className="w-full p-3 bg-black bg-opacity-50 border border-gray-900 rounded text-green-400 font-mono-tech"
        rows="6"
        placeholder="Type your AI prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button className="mt-3 px-4 py-2 bg-green-900 text-black font-bold rounded hover:bg-green-700">
        Generate
      </button>
    </div>
  );
}
