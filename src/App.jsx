import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PromptBuilder from "./components/PromptBuilder";
import CasinoSpinner from "./components/CasinoSpinner";
import SystemPanel from "./components/SystemPanel";
import BackendTest from "./components/BackendTest";
import FeatureList from "./components/FeatureList";

// Tab labels in plain JS
const TAB_LABELS = {
  builder: { title: "PROMPT BUILDER", desc: "Construct & refine prompts using modular components" },
  casino: { title: "CASINO SPINNER", desc: "Spin the reels for random prompt combos" },
  system: { title: "SYSTEM MONITOR", desc: "View backend health & live console output" },
  backend: { title: "BACKEND TEST", desc: "Test Supabase backend and database data" },
};

export default function App() {
  const [activeTab, setActiveTab] = useState("builder");

  return (
    <div className="scanlines min-h-screen flex flex-col grid-bg">
      {/* Header */}
      <Header />

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
            <h2 className="font-orbitron text-base font-bold neon-green tracking-wider">
              {TAB_LABELS[activeTab].title}
            </h2>
            <p className="font-mono-tech text-xs text-gray-600 mt-0.5">
              // {TAB_LABELS[activeTab].desc}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 max-w-4xl mx-auto">
            {activeTab === "builder" && <PromptBuilder />}
            {activeTab === "casino" && <CasinoSpinner />}
            {activeTab === "system" && <SystemPanel />}
            {activeTab === "backend" && (
              <div>
                <BackendTest />
                <FeatureList />
              </div>
            )}
          </div>
        </main>

        {/* Right info panel for desktop */}
        <aside className="hidden xl:flex flex-col w-64 panel border-l border-gray-900 flex-shrink-0">
          <div className="p-4">
            <p className="font-orbitron text-xs neon-green tracking-wider mb-3">STACK</p>
            {["React + Vite", "Tailwind CSS", "Supabase", "Express.js", "OpenAI GPT", "Google Gemini AI"].map((s, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <span className="text-green-900">▸</span>
                <span className="font-mono-tech text-xs text-gray-600">{s}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
