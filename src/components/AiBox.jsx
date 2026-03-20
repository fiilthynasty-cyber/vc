import { useState } from "react";

export default function AiBox() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [uses, setUses] = useState(3);

  const generate = async () => {
    if (uses <= 0) {
      alert("Pay to unlock 🔒");
      return;
    }

    setUses(uses - 1);

    // FAKE AI (we upgrade to real next)
    setOutput("🔥 AI RESULT:\n\n" + input + " → Turn this into money idea...");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <textarea
        className="w-full p-4 border rounded-xl"
        placeholder="Type anything to make money..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={generate}
        className="mt-4 bg-black text-white px-6 py-3 rounded-xl"
      >
        Generate 💰
      </button>

      <p className="mt-2 text-sm">Free uses left: {uses}</p>

      <div className="mt-4 p-4 border rounded-xl whitespace-pre-wrap">
        {output}
      </div>
    </div>
  );
}
