import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  {
    id: 'builder',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    label: 'PROMPT BUILDER',
    sublabel: 'Build & refine prompts',
  },
  {
    id: 'casino',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <rect x="5" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.5"/>
        <rect x="10" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.8"/>
        <rect x="15" y="7" width="4" height="4" rx="1" fill="currentColor"/>
        <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: 'CASINO SPINNER',
    sublabel: 'Random prompt gen',
  },
  {
    id: 'system',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 7.76a6 6 0 0 0 0 8.49"/>
      </svg>
    ),
    label: 'SYSTEM MONITOR',
    sublabel: 'Backend & DB status',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="panel border-t-0 border-b-0 border-l-0 w-64 flex-shrink-0 flex flex-col hidden lg:flex">
      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1 pt-4">
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full text-left p-3 rounded transition-all duration-200 group
                flex items-start gap-3
                ${isActive
                  ? 'bg-green-950 bg-opacity-30 border border-green-900 border-opacity-50'
                  : 'hover:bg-gray-900 border border-transparent hover:border-gray-800'
                }
              `}
            >
              <span className={`mt-0.5 flex-shrink-0 transition-colors ${isActive ? 'text-green-400' : 'text-gray-700 group-hover:text-gray-500'}`}>
                {item.icon}
              </span>
              <div>
                <p className={`font-orbitron text-xs tracking-wider transition-colors ${isActive ? 'neon-green' : 'text-gray-600 group-hover:text-gray-400'}`}>
                  {item.label}
                </p>
                <p className="font-mono-tech text-xs text-gray-700 mt-0.5 leading-none">
                  {item.sublabel}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="p-4 border-t border-gray-900">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="status-dot green" />
            <span className="font-mono-tech text-xs text-gray-600">BACKEND CONNECTED</span>
          </div>
          <p className="font-mono-tech text-xs text-gray-800">one-shxr.onrender.com</p>

          <div className="mt-1 pt-2 border-t border-gray-900">
            <p className="font-mono-tech text-xs text-gray-800">QPOS — Quantum Prompt OS</p>
            <p className="font-mono-tech text-xs text-gray-900">fiilthynasty-cyber/1</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
