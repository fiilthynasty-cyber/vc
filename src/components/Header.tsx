import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [connected] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toTimeString().split(' ')[0];
  const dateStr = time.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase();

  return (
    <header className="panel border-l-0 border-r-0 border-t-0 px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Animated logo mark */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="#00ff88" strokeWidth="1.5" fill="none" opacity="0.8"/>
            <polygon points="16,7 25,12 25,20 16,25 7,20 7,12" stroke="#00ff88" strokeWidth="1" fill="none" opacity="0.4"/>
            <circle cx="16" cy="16" r="4" fill="#00ff88" opacity="0.9"/>
            <line x1="16" y1="2" x2="16" y2="7" stroke="#00ff88" strokeWidth="1" opacity="0.6"/>
            <line x1="16" y1="25" x2="16" y2="30" stroke="#00ff88" strokeWidth="1" opacity="0.6"/>
          </svg>
          <div>
            <h1 className="font-orbitron text-sm font-bold neon-green tracking-widest">QPOS</h1>
            <p className="font-mono-tech text-xs text-gray-600 leading-none">QUANTUM PROMPT OS</p>
          </div>
        </div>

        <div className="h-8 w-px bg-gray-800 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2">
          <span className="badge badge-green">v1.0.0</span>
          <span className="badge badge-cyan">BACKEND LIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-2 text-right">
          <div>
            <p className="font-mono-tech text-xs neon-green leading-none">{timeStr}</p>
            <p className="font-mono-tech text-xs text-gray-600 leading-none mt-0.5">{dateStr}</p>
          </div>
        </div>

        <div className="h-8 w-px bg-gray-800 hidden md:block" />

        <div className="flex items-center gap-2">
          <span className={`status-dot ${connected ? 'green' : 'red'}`} />
          <span className="font-mono-tech text-xs text-gray-500">
            {connected ? 'NODE ACTIVE' : 'OFFLINE'}
          </span>
        </div>

        <a
          href="https://github.com/fiilthynasty-cyber/1"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 font-mono-tech text-xs text-gray-600 hover:text-green-400 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>SOURCE</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
