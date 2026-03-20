import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [uses, setUses] = useState(3);

  const generate = () => {
    if (!input) {
      alert("Type something first");
      return;
    }

    if (uses <= 0) {
      alert("🔒 You ran out of free uses. Upgrade coming soon.");
      return;
    }

    setUses(uses - 1);

    // Fake AI output (we upgrade this next)
    const result = `
🔥 MONEY IDEA GENERATED:

You typed: "${input}"

Here’s how to turn this into money:

1. Create content around it (TikTok, YouTube, posts)
2. Turn it into a digital product (ebook or guide)
3. Promote it using AI tools
4. Add affiliate links or sell it

💰 Goal: Turn this into income within 7 days
`;

    setOutput(result);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      
      <h1 className="text-4xl font-bold mb-6 text-center">
        💰 AI MONEY MACHINE
      </h1>

      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-md">
        
        <textarea
          className="w-full p-4 border rounded-xl mb-4"
          rows="4"
          placeholder="Type something like: 'fitness', 'crypto', 'AI business'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={generate}
          className="w-full bg-black text-white py-3 rounded-xl text-lg"
        >
          Generate 💰
        </button>

        <p className="mt-3 text-sm text-gray-600 text-center">
          Free uses left: {uses}
        </p>

        {output && (
          <div className="mt-6 p-4 border rounded-xl whitespace-pre-wrap bg-gray-50">
            {output}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
