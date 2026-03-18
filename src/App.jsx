import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('Click the button to test backend →');

  const handleClick = async () => {
    try {
      const res = await fetch('https://one-shxr.onrender.com');
      const text = await res.text();
      setMessage(`Backend says: ${text}`);
      alert('✅ Backend is LIVE!');
    } catch (err) {
      setMessage('Backend error – check Render logs');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-sans">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold mb-4 tracking-tighter">QPOS</h1>
        <p className="text-xl text-zinc-400 mb-8">SaaS Backend + React Frontend</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
          <p className="text-zinc-400 mb-6">{message}</p>
          <button
            onClick={handleClick}
            className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-zinc-200 transition-all active:scale-95"
          >
            Test Backend Connection
          </button>
        </div>

        <p className="text-xs text-zinc-500">Tailwind v4 + Vite + Supabase ready</p>
      </div>
    </div>
  );
}

export default App;   // ← THIS WAS MISSING
