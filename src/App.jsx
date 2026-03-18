import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PromptBuilder from "./components/PromptBuilder";
import CasinoSpinner from "./components/CasinoSpinner";
import SystemPanel from "./components/SystemPanel";
import BackendTest from "./components/BackendTest";
import FeatureList from "./components/FeatureList";
import { supabase } from "./supabaseClient"; // backend client

type Tab = "builder" | "casino" | "system" | "backend";

const TAB_LABELS: Record<Tab, { title: string; desc: string }> = {
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
  backend: {
    title: "BACKEND TEST",
    desc: "Test your Supabase backend and view database data",
  },
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("builder");

  return (
    <div className="scanlines min-h-screen flex flex-col grid-bg">
      {/* Header */}
      <Header />

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as Tab)} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile tab bar */}
          <div className="lg:hidden flex border-b border-gray-900 bg-black bg-opacity-40 px-4">
            {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
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

        {/* Right info panel (desktop only) */}
        <aside className="hidden xl:flex flex-col w-64 panel border-t-0 border-b-0 border-r-0 flex-shrink-0">
          <div className="p-4 border-b border-gray-900">
            <p className="font-orbitron text-xs neon-green tracking-wider mb-3">STACK</p>
            <div className="flex flex-col gap-1">
              {[
                "Express.js (Node)",
                "Supabase (DB)",
                "Google Gemini AI",
                "OpenAI GPT",
                "React + Vite",
                "Tailwind CSS",
              ].map((s, i) => (
                <div key={i} className="log-line">
                  <span className="text-green-900">▸</span>
                  <span className="font-mono-tech text-xs text-gray-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
