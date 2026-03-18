import React from "react";

export default function Sidebar({ activeTab, onTabChange }) {
  const tabs = ["builder", "casino", "system", "backend"];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-black bg-opacity-40 border-r border-gray-900 flex-shrink-0">
      <nav className="flex flex-col p-4 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`text-left px-3 py-2 rounded font-mono-tech text-sm ${
              activeTab === tab ? "bg-green-900 text-black" : "text-gray-400 hover:bg-gray-800"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </nav>
    </aside>
  );
}
