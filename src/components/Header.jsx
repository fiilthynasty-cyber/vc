import React from "react";

export default function Header() {
  return (
    <header className="bg-black bg-opacity-40 border-b border-gray-900 px-6 py-3 flex items-center justify-between">
      <h1 className="font-orbitron text-xl neon-green tracking-wider">Quantum AI</h1>
      <div className="flex gap-4">
        <button className="btn-neon">Login</button>
        <button className="btn-neon">Sign Up</button>
      </div>
    </header>
  );
}
