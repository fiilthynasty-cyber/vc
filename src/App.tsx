import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PromptBuilder from "./components/PromptBuilder";
import CasinoSpinner from "./components/CasinoSpinner";
import SystemPanel from "./components/SystemPanel";

// Define tabs
const TAB_LABELS = {
  builder: {
    title: "PROMPT BUILDER",
    desc: "Construct & AI-refine your prompts using modular components",
  },
  casino: {
    title: "CASINO SPINNER",
    desc: "Spin the reels for randomly generated prompt combinations",
  },
  system: {
    title: "SYSTEM MONITOR",
    desc: "Backend health, service map & live console output",
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState("builder");

  return (
    <div className="scanlines min-h-screen flex flex-col grid-bg">
      {/* Header */}
      <Header />

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile tab bar */}
          <div className="lg:hidden flex border-b border-gray-900 bg-black bg-opacity-40 px-4">
            {Object.keys(TAB_LABELS).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab].title.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Page header */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-900 border-opacity-50">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-orbitron text-base font-bold neon-green tracking-wider">
                  {TAB_LABELS[activeTab].title}
                </h2>
                <p className="font-mono-tech text-xs text-gray-600 mt-0.5">
                  // {TAB_LABELS[activeTab].desc}
                </p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-green-900 to-transparent hidden md:block ml-4" />
            </div>
          </div>

          {/* Content area */}
          <div className="p-6">
            {activeTab === "builder" && (
              <div className="fade-in max-w-3xl">
                <PromptBuilder />
              </div>
            )}
            {activeTab === "casino" && (
              <div className="fade-in max-w-3xl">
                <CasinoSpinner />
              </div>
            )}
            {activeTab === "system" && (
              <div className="fade-in max-w-3xl">
                <SystemPanel />
              </div>
            )}
          </div>
        </main>

        {/* Right info panel (desktop only) */}
        <aside className="hidden xl:flex flex-col w-64 panel border-t-0 border-b-0 border-r-0 flex-shrink-0">
          {/* Quick Reference */}
          <div className="p-4 border-b border-gray-900">
            <p className="font-orbitron text-xs neon-green tracking-wider mb-3">QUICK REFERENCE</p>
            <div className="flex flex-col gap-3">
              {[
                { fn: "getAutocompleteSuggestions(task)", color: "var(--neon-cyan)" },
                { fn: "refinePrompt(components, level)", color: "var(--neon-purple)" },
                { fn: "spinCasino()", color: "var(--neon-green)" },
              ].map((f, i) => (
                <div key={i} className="bg-black bg-opacity-40 rounded p-2 border border-gray-900">
                  <p className="font-mono-tech text-xs break-all" style={{ color: f.color }}>
                    {f.fn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* API Endpoints */}
          <div className="p-4 border-b border-gray-900">
            <p className="font-orbitron text-xs neon-green tracking-wider mb-3">API ENDPOINTS</p>
            <div className="flex flex-col gap-2">
              {[
                { method: "GET", path: "/", note: "Health check" },
                { method: "POST", path: "/autocomplete", note: "Get suggestions" },
                { method: "POST", path: "/refine", note: "AI refine prompt" },
                { method: "POST", path: "/casino/spin", note: "Random spin" },
              ].map((ep, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="badge badge-cyan flex-shrink-0">{ep.method}</span>
                  <div>
                    <p className="font-mono-tech text-xs text-green-600">{ep.path}</p>
                    <p className="font-mono-tech text-xs text-gray-700">{ep.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="p-4">
            <p className="font-orbitron text-xs neon-green tracking-wider mb-3">STACK</p>
            <div className="flex flex-col gap-1">
              {["Express.js (Node)", "Supabase (DB)", "Google Gemini AI", "OpenAI GPT", "React + Vite", "Tailwind CSS"].map(
                (s, i) => (
                  <div key={i} className="log-line">
                    <span className="text-green-900">▸</span>
                    <span className="font-mono-tech text-xs text-gray-600">{s}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Animated Data Stream */}
          <div className="mt-auto p-4 border-t border-gray-900">
            <p className="font-orbitron text-xs text-gray-800 tracking-wider mb-2">DATA STREAM</p>
            <DataStream />
          </div>
        </aside>
      </div>
    </div>
  );
}

// Animated random hex data stream
function DataStream() {
  const [stream, setStream] = useState([]);

  useEffect(() => {
    const gen = () => {
      const hex = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0")
          .toUpperCase()
      ).join(" ");
      setStream((prev) => [hex, ...prev].slice(0, 8));
    };
    gen();
    const t = setInterval(gen, 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-0.5">
      {stream.map((line, i) => (
        <p
          key={i}
          className="font-mono-tech text-xs"
          style={{ color: `rgba(0, 255, 136, ${0.8 - i * 0.1})`, fontSize: "0.65rem" }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
