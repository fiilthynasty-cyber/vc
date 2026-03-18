import React, { useState, useRef, useCallback } from 'react';

const API_URL = 'https://one-shxr.onrender.com';

interface ReelData {
  label: string;
  value: string;
}

const REEL_SETS: ReelData[][] = [
  // Subjects
  [
    { label: 'SUBJECT', value: 'cyberpunk hacker' },
    { label: 'SUBJECT', value: 'quantum AI' },
    { label: 'SUBJECT', value: 'neon deity' },
    { label: 'SUBJECT', value: 'rogue android' },
    { label: 'SUBJECT', value: 'digital witch' },
    { label: 'SUBJECT', value: 'ghost in machine' },
    { label: 'SUBJECT', value: 'void walker' },
    { label: 'SUBJECT', value: 'data phantom' },
  ],
  // Style
  [
    { label: 'STYLE', value: 'hyperrealistic' },
    { label: 'STYLE', value: 'glitch art' },
    { label: 'STYLE', value: 'vaporwave' },
    { label: 'STYLE', value: 'synthwave' },
    { label: 'STYLE', value: 'dark surrealism' },
    { label: 'STYLE', value: 'brutalist' },
    { label: 'STYLE', value: 'retrofuturism' },
    { label: 'STYLE', value: 'biomechanical' },
  ],
  // Setting
  [
    { label: 'SETTING', value: 'underground server farm' },
    { label: 'SETTING', value: 'neon-lit megacity' },
    { label: 'SETTING', value: 'abandoned space station' },
    { label: 'SETTING', value: 'digital purgatory' },
    { label: 'SETTING', value: 'quantum void' },
    { label: 'SETTING', value: 'dark web corridor' },
    { label: 'SETTING', value: 'neural mainframe' },
    { label: 'SETTING', value: 'dystopian rooftop' },
  ],
  // Mood
  [
    { label: 'MOOD', value: 'ominous dread' },
    { label: 'MOOD', value: 'electric euphoria' },
    { label: 'MOOD', value: 'cold precision' },
    { label: 'MOOD', value: 'chaotic entropy' },
    { label: 'MOOD', value: 'melancholic hope' },
    { label: 'MOOD', value: 'violent beauty' },
    { label: 'MOOD', value: 'sacred glitch' },
    { label: 'MOOD', value: 'infinite longing' },
  ],
];

const JACKPOT_SEQUENCES = [
  '🎰 JACKPOT — QUANTUM ALIGNMENT ACHIEVED',
  '💎 ULTRA RARE — NEURAL CASCADE TRIGGERED',
  '⚡ CRITICAL HIT — PROMPT MATRIX UNLOCKED',
];

interface SpinResult {
  reels: ReelData[];
  prompt: string;
  jackpot: boolean;
}

const CasinoSpinner: React.FC = () => {
  const [currentReels, setCurrentReels] = useState<ReelData[]>(
    REEL_SETS.map(set => set[0])
  );
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [jackpot, setJackpot] = useState(false);
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [blurStates, setBlurStates] = useState([false, false, false, false]);
  const [displayReels, setDisplayReels] = useState<ReelData[]>(
    REEL_SETS.map(set => set[0])
  );
  const [copied, setCopied] = useState(false);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const spin = useCallback(async () => {
    if (spinning) return;
    setSpinning(true);
    setJackpot(false);
    setBlurStates([true, true, true, true]);

    // Start rapid cycling each reel
    const intervals = REEL_SETS.map((set, reelIdx) => {
      return setInterval(() => {
        const randomItem = set[Math.floor(Math.random() * set.length)];
        setDisplayReels(prev => {
          const next = [...prev];
          next[reelIdx] = randomItem;
          return next;
        });
      }, 80);
    });
    spinIntervalRef.current = intervals;

    // Try to call the backend
    let finalReels: ReelData[] = [];
    let isJackpot = false;
    let prompt = '';

    try {
      const res = await fetch(`${API_URL}/casino/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result && Array.isArray(data.result)) {
          finalReels = data.result;
          isJackpot = data.jackpot || false;
          prompt = data.prompt || data.result.map((r: ReelData) => r.value).join(', ');
        }
      }
    } catch {
      // Fallback: generate locally
    }

    if (finalReels.length === 0) {
      finalReels = REEL_SETS.map(set => set[Math.floor(Math.random() * set.length)]);
      isJackpot = spinCount > 0 && Math.random() < 0.08;
      prompt = finalReels.map(r => r.value).join(', ') + ', ultra-detailed, 8K, award-winning';
    }

    // Stop reels one by one with delay
    const stopReel = (idx: number) => {
      setTimeout(() => {
        clearInterval(intervals[idx]);
        setDisplayReels(prev => {
          const next = [...prev];
          next[idx] = finalReels[idx];
          return next;
        });
        setBlurStates(prev => {
          const next = [...prev];
          next[idx] = false;
          return next;
        });

        if (idx === REEL_SETS.length - 1) {
          setCurrentReels(finalReels);
          setJackpot(isJackpot);
          setSpinCount(c => c + 1);
          setHistory(prev => [{ reels: finalReels, prompt, jackpot: isJackpot }, ...prev.slice(0, 9)]);
          setSpinning(false);
        }
      }, idx * 350 + 600);
    };

    REEL_SETS.forEach((_, i) => stopReel(i));
  }, [spinning, spinCount]);

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentPrompt = currentReels.map(r => r.value).join(', ') + ', ultra-detailed, masterpiece';

  return (
    <div className="flex flex-col gap-5">
      {/* Casino Header */}
      <div className="panel p-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="font-orbitron text-xs neon-purple tracking-widest">PROMPT</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="#bf00ff" strokeWidth="1.5"/>
            <rect x="5" y="7" width="4" height="4" rx="1" fill="#bf00ff" opacity="0.4"/>
            <rect x="10" y="7" width="4" height="4" rx="1" fill="#bf00ff" opacity="0.7"/>
            <rect x="15" y="7" width="4" height="4" rx="1" fill="#bf00ff" opacity="1"/>
            <line x1="10" y1="15" x2="14" y2="15" stroke="#bf00ff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="font-orbitron text-xs neon-purple tracking-widest">CASINO</span>
        </div>
        <p className="font-mono-tech text-xs text-gray-600">SPIN THE REELS — GENERATE RANDOM PROMPT COMPONENTS</p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="badge badge-purple">SPINS: {spinCount}</span>
          {spinCount > 0 && <span className="badge badge-green">JACKPOT CHANCE: 8%</span>}
        </div>
      </div>

      {/* Jackpot Banner */}
      {jackpot && (
        <div className="panel p-3 text-center fade-in" style={{ borderColor: 'var(--neon-pink)', background: '#ff006e10' }}>
          <p className="font-orbitron text-sm animate-pulse" style={{ color: 'var(--neon-pink)' }}>
            {JACKPOT_SEQUENCES[spinCount % JACKPOT_SEQUENCES.length]}
          </p>
        </div>
      )}

      {/* Reels */}
      <div className="panel p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {REEL_SETS.map((_, i) => (
            <div key={i} className={`reel ${spinning ? 'spinning' : ''}`}>
              <span className="font-mono-tech text-xs text-gray-600 mb-1">[{displayReels[i]?.label}]</span>
              <span className={`reel-value text-center leading-tight ${blurStates[i] ? 'blur' : ''}`}>
                {displayReels[i]?.value}
              </span>
            </div>
          ))}
        </div>

        {/* Spin button */}
        <button
          className={`btn-neon btn-purple w-full py-3 text-base tracking-widest ${spinning ? 'opacity-50' : ''}`}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? (
            <span className="flex items-center justify-center gap-2">
              <span className="text-xl animate-spin">◈</span>
              SPINNING THE REELS...
            </span>
          ) : (
            <span>◈ SPIN // GENERATE RANDOM PROMPT</span>
          )}
        </button>
      </div>

      {/* Current result */}
      {spinCount > 0 && (
        <div className="panel p-4 fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono-tech text-xs text-gray-600">▶</span>
            <span className="font-orbitron text-xs neon-purple tracking-wider">GENERATED PROMPT</span>
            <button className="copy-btn ml-auto" onClick={() => copyPrompt(currentPrompt)}>
              {copied ? '✓ COPIED' : 'COPY'}
            </button>
          </div>
          <div className="bg-black bg-opacity-40 rounded p-3 border border-purple-900 border-opacity-30">
            <p className="font-mono-tech text-sm text-purple-300 leading-relaxed">{currentPrompt}</p>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div className="panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono-tech text-xs text-gray-600">▶</span>
            <span className="font-orbitron text-xs text-gray-500 tracking-wider">SPIN HISTORY</span>
            <span className="ml-auto font-mono-tech text-xs text-gray-700">{history.length - 1} PREV</span>
          </div>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {history.slice(1).map((h, i) => (
              <div key={i} className="log-line items-start">
                <span className="text-gray-700 flex-shrink-0">#{spinCount - i - 1}</span>
                {h.jackpot && <span className="badge badge-purple flex-shrink-0">JP</span>}
                <span className="text-gray-500 flex-1 truncate">{h.reels.map(r => r.value).join(' · ')}</span>
                <button
                  className="copy-btn flex-shrink-0"
                  onClick={() => copyPrompt(h.prompt)}
                  title="Copy prompt"
                >↗</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CasinoSpinner;
