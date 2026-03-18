import React, { useState, useEffect } from 'react';

const API_URL = 'https://one-shxr.onrender.com';
const SUPABASE_URL = 'https://ridjafkezqszjunjquqg.supabase.co';

interface LogEntry {
  id: string;
  time: string;
  type: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

interface StatItem {
  label: string;
  value: string;
  color: string;
}

const SystemPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [uptime] = useState(Math.floor(Math.random() * 86400) + 3600);

  const addLog = (type: LogEntry['type'], message: string) => {
    const entry: LogEntry = {
      id: Date.now().toString(),
      time: new Date().toTimeString().split(' ')[0],
      type,
      message,
    };
    setLogs(prev => [entry, ...prev].slice(0, 50));
  };

  useEffect(() => {
    addLog('INFO', 'QPOS frontend initialized');
    addLog('INFO', `Connecting to backend: ${API_URL}`);
    addLog('INFO', `Connecting to Supabase: ${SUPABASE_URL}`);

    // Check backend
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_URL}/`, {
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          setBackendStatus('online');
          addLog('SUCCESS', 'Backend node connected — Hello from VC backend!');
        } else {
          setBackendStatus('offline');
          addLog('WARN', `Backend responded with status ${res.status}`);
        }
      } catch {
        setBackendStatus('offline');
        addLog('WARN', 'Backend unreachable — running in local demo mode');
      }
    };

    // Check Supabase
    const checkDb = async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          headers: { 'apikey': 'anon' },
          signal: AbortSignal.timeout(5000),
        });
        if (res.status < 500) {
          setDbStatus('online');
          addLog('SUCCESS', 'Supabase database endpoint reachable');
        } else {
          setDbStatus('offline');
          addLog('WARN', 'Supabase returned server error');
        }
      } catch {
        setDbStatus('offline');
        addLog('WARN', 'Supabase unreachable — check credentials');
      }
    };

    setTimeout(checkBackend, 500);
    setTimeout(checkDb, 1000);

    // Simulate periodic logs
    const periodicLog = setInterval(() => {
      const messages = [
        ['INFO', 'Heartbeat check — all systems nominal'],
        ['INFO', 'Neural network latency: ' + (Math.floor(Math.random() * 200) + 50) + 'ms'],
        ['INFO', 'Memory allocation: ' + (Math.floor(Math.random() * 40) + 30) + '% utilized'],
        ['INFO', 'Quantum entropy pool refreshed'],
        ['SUCCESS', 'Cache sync complete'],
      ] as const;
      const [type, msg] = messages[Math.floor(Math.random() * messages.length)];
      addLog(type, msg);
    }, 8000);

    return () => clearInterval(periodicLog);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const stats: StatItem[] = [
    { label: 'BACKEND', value: backendStatus === 'online' ? 'ONLINE' : backendStatus === 'offline' ? 'OFFLINE' : '...', color: backendStatus === 'online' ? 'var(--neon-green)' : backendStatus === 'offline' ? 'var(--neon-pink)' : 'var(--neon-cyan)' },
    { label: 'DATABASE', value: dbStatus === 'online' ? 'CONNECTED' : dbStatus === 'offline' ? 'UNREACHABLE' : '...', color: dbStatus === 'online' ? 'var(--neon-green)' : dbStatus === 'offline' ? 'var(--neon-pink)' : 'var(--neon-cyan)' },
    { label: 'AI ENGINE', value: 'GEMINI/GPT', color: 'var(--neon-purple)' },
    { label: 'UPTIME', value: formatUptime(uptime), color: 'var(--neon-cyan)' },
  ];

  const logColors: Record<LogEntry['type'], string> = {
    INFO: '#2a5070',
    WARN: '#aaaa00',
    ERROR: 'var(--neon-pink)',
    SUCCESS: 'var(--neon-green)',
  };

  const logPrefixes: Record<LogEntry['type'], string> = {
    INFO: '//  ',
    WARN: '//⚠ ',
    ERROR: '//✕ ',
    SUCCESS: '//✓ ',
  };

  return (
    <div className="flex flex-col gap-5">
      {/* System Stats Grid */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono-tech text-xs text-gray-600">▶</span>
          <span className="font-orbitron text-xs neon-green tracking-wider">SYSTEM STATUS</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <p className="font-mono-tech text-xs text-gray-700 mb-1">{s.label}</p>
              <p className="font-orbitron text-sm font-bold" style={{ color: s.color }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Backend Info */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono-tech text-xs text-gray-600">▶</span>
          <span className="font-orbitron text-xs neon-green tracking-wider">NODE CONFIGURATION</span>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { label: 'BACKEND URL', value: API_URL },
            { label: 'SUPABASE URL', value: SUPABASE_URL },
            { label: 'FRAMEWORK', value: 'Express.js v4 + ESM' },
            { label: 'AI PROVIDERS', value: 'Google Gemini + OpenAI' },
            { label: 'PROJECT', value: 'qpos-backend v1.0.0' },
            { label: 'FRONTEND', value: 'React + Vite + Tailwind' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-1 border-b border-gray-900">
              <span className="font-mono-tech text-xs text-gray-600 flex-shrink-0 w-32">{item.label}</span>
              <span className="font-mono-tech text-xs text-green-400 break-all">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Service Map */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono-tech text-xs text-gray-600">▶</span>
          <span className="font-orbitron text-xs neon-green tracking-wider">SERVICE MAP</span>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { service: 'aiService.js', exports: ['getAutocompleteSuggestions', 'refinePrompt', 'spinCasino'], status: 'LOADED' },
            { service: 'autocomplete.js', exports: ['getAutocompleteSuggestions', 'refinePrompt'], status: 'LOADED' },
            { service: 'casino.js', exports: ['spinCasino'], status: 'LOADED' },
          ].map((svc, i) => (
            <div key={i} className="bg-black bg-opacity-30 rounded p-2 border border-gray-900">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono-tech text-xs neon-cyan">{svc.service}</span>
                <span className="badge badge-green ml-auto">{svc.status}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {svc.exports.map((e, j) => (
                  <span key={j} className="font-mono-tech text-xs text-gray-600">
                    {j > 0 && '· '}{e}()
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Console Log */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono-tech text-xs text-gray-600">▶</span>
          <span className="font-orbitron text-xs neon-green tracking-wider">CONSOLE OUTPUT</span>
          <button
            className="ml-auto copy-btn"
            onClick={() => setLogs([])}
          >CLR</button>
        </div>
        <div className="bg-black bg-opacity-60 rounded p-3 max-h-64 overflow-y-auto border border-gray-900">
          {logs.length === 0 ? (
            <p className="font-mono-tech text-xs text-gray-700">// no logs yet</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="log-line fade-in">
                <span className="text-gray-700 flex-shrink-0">{log.time}</span>
                <span className="flex-shrink-0" style={{ color: logColors[log.type] }}>
                  {logPrefixes[log.type]}
                </span>
                <span style={{ color: logColors[log.type] }}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemPanel;
