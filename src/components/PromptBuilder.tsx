import React, { useState, useRef, useEffect, useCallback } from 'react';

const API_URL = 'https://one-shxr.onrender.com';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface Suggestion {
  text: string;
  category: string;
}

const COMPONENT_CATEGORIES = ['SUBJECT', 'STYLE', 'MOOD', 'SETTING', 'TECHNIQUE', 'LIGHTING', 'COLOR', 'DETAIL'];

const SAMPLE_SUGGESTIONS: Suggestion[] = [
  { text: 'cyberpunk city at night', category: 'SETTING' },
  { text: 'cinematic lighting', category: 'LIGHTING' },
  { text: 'hyperrealistic', category: 'TECHNIQUE' },
  { text: 'neon reflections', category: 'DETAIL' },
  { text: 'dystopian atmosphere', category: 'MOOD' },
  { text: 'digital art style', category: 'STYLE' },
  { text: 'glitch aesthetic', category: 'STYLE' },
  { text: 'holographic interface', category: 'DETAIL' },
  { text: 'rain-soaked streets', category: 'SETTING' },
  { text: 'volumetric fog', category: 'DETAIL' },
  { text: 'neural network visualization', category: 'SUBJECT' },
  { text: 'quantum entanglement', category: 'SUBJECT' },
  { text: 'bokeh depth of field', category: 'TECHNIQUE' },
  { text: 'electric blue palette', category: 'COLOR' },
  { text: 'neon green accents', category: 'COLOR' },
];

const PromptBuilder: React.FC = () => {
  const [task, setTask] = useState('');
  const [components, setComponents] = useState<string[]>([]);
  const [componentInput, setComponentInput] = useState('');
  const [creativityLevel, setCreativityLevel] = useState(5);
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [error, setError] = useState('');
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedTask = useDebounce(task, 400);

  // Fetch autocomplete suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setAutocompleteLoading(true);
    try {
      const res = await fetch(`${API_URL}/autocomplete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: query }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          setShowSuggestions(data.suggestions.length > 0);
          return;
        }
      }
    } catch {
      // fallback to local suggestions
    } finally {
      setAutocompleteLoading(false);
    }
    // Fallback: filter local suggestions
    const filtered = SAMPLE_SUGGESTIONS.filter(s =>
      s.text.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedTask);
  }, [debouncedTask, fetchSuggestions]);

  const addComponent = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !components.includes(trimmed)) {
      setComponents(prev => [...prev, trimmed]);
    }
    setComponentInput('');
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
  };

  const removeComponent = (idx: number) => {
    setComponents(prev => prev.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && selectedSuggestion >= 0) {
        e.preventDefault();
        addComponent(suggestions[selectedSuggestion].text);
        return;
      }
    }
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (componentInput.trim()) addComponent(componentInput);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const refinePrompt = async () => {
    if (components.length === 0) {
      setError('Add at least one prompt component before refining.');
      return;
    }
    setError('');
    setRefining(true);
    setRefinedPrompt('');
    try {
      const res = await fetch(`${API_URL}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components, creativityLevel }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data = await res.json();
        setRefinedPrompt(data.refined || data.prompt || data.result || JSON.stringify(data));
      } else {
        // Demo mode fallback
        await new Promise(r => setTimeout(r, 1200));
        const creativity = creativityLevel >= 8 ? 'wildly experimental' : creativityLevel >= 5 ? 'artistically balanced' : 'precisely controlled';
        setRefinedPrompt(
          `[QPOS REFINED — CREATIVITY ${creativityLevel}/10]\n\n${components.join(', ')}, ${creativity} composition, ultra-detailed render, 8K resolution, award-winning photography, masterpiece quality — generated by Quantum Prompt OS`
        );
      }
    } catch {
      await new Promise(r => setTimeout(r, 1200));
      const creativity = creativityLevel >= 8 ? 'wildly experimental' : creativityLevel >= 5 ? 'artistically balanced' : 'precisely controlled';
      setRefinedPrompt(
        `[QPOS REFINED — CREATIVITY ${creativityLevel}/10]\n\n${components.join(', ')}, ${creativity} composition, ultra-detailed render, 8K resolution, award-winning photography, masterpiece quality — generated by Quantum Prompt OS`
      );
    } finally {
      setRefining(false);
    }
  };

  const getAutocomplete = async () => {
    if (!task.trim()) {
      setError('Enter a task description first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/autocomplete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        }
      } else {
        // Fallback to local
        setSuggestions(SAMPLE_SUGGESTIONS.slice(0, 6));
        setShowSuggestions(true);
      }
    } catch {
      setSuggestions(SAMPLE_SUGGESTIONS.slice(0, 6));
      setShowSuggestions(true);
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = () => {
    if (refinedPrompt) {
      navigator.clipboard.writeText(refinedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const creativityLabel = creativityLevel <= 3 ? 'PRECISE' : creativityLevel <= 6 ? 'BALANCED' : creativityLevel <= 8 ? 'CREATIVE' : 'CHAOTIC';
  const creativityColor = creativityLevel <= 3 ? 'var(--neon-cyan)' : creativityLevel <= 6 ? 'var(--neon-green)' : creativityLevel <= 8 ? 'var(--neon-purple)' : 'var(--neon-pink)';

  return (
    <div className="flex flex-col gap-5">
      {/* Task Input */}
      <div className="panel p-4 corner-decoration">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono-tech text-xs text-gray-600">▶</span>
          <span className="font-orbitron text-xs neon-green tracking-wider">TASK DESCRIPTOR</span>
          {autocompleteLoading && (
            <span className="font-mono-tech text-xs text-gray-600 animate-pulse ml-auto">FETCHING SUGGESTIONS...</span>
          )}
        </div>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className="input-neon"
            placeholder="describe your creative task or prompt goal..."
            value={task}
            onChange={e => setTask(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div ref={dropdownRef} className="autocomplete-dropdown fade-in">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className={`autocomplete-item flex items-center justify-between ${i === selectedSuggestion ? 'active' : ''}`}
                  onMouseDown={() => { setTask(s.text); setShowSuggestions(false); }}
                >
                  <span>{s.text}</span>
                  <span className="badge badge-cyan ml-2">{s.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-2">
          <button className="btn-neon btn-cyan" onClick={getAutocomplete} disabled={loading}>
            {loading ? '// LOADING...' : '⚡ GET SUGGESTIONS'}
          </button>
        </div>
      </div>

      {/* Component Builder */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono-tech text-xs text-gray-600">▶</span>
          <span className="font-orbitron text-xs neon-green tracking-wider">PROMPT COMPONENTS</span>
          <span className="ml-auto font-mono-tech text-xs text-gray-600">{components.length} LOADED</span>
        </div>

        {/* Component input */}
        <div className="relative mb-3">
          <input
            type="text"
            className="input-neon"
            placeholder="type component + press Enter or comma to add..."
            value={componentInput}
            onChange={e => setComponentInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Quick-add chips from sample */}
        <div className="mb-3">
          <p className="font-mono-tech text-xs text-gray-700 mb-1.5">// QUICK ADD:</p>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_SUGGESTIONS.slice(0, 8).map((s, i) => (
              <button
                key={i}
                className="tag-chip cursor-pointer hover:border-green-500 hover:text-green-400 transition-colors"
                onClick={() => addComponent(s.text)}
              >
                + {s.text}
              </button>
            ))}
          </div>
        </div>

        {/* Active components */}
        {components.length > 0 && (
          <div className="fade-in">
            <p className="font-mono-tech text-xs text-gray-700 mb-1.5">// ACTIVE COMPONENTS:</p>
            <div className="flex flex-wrap gap-2">
              {components.map((c, i) => (
                <div
                  key={i}
                  className="tag-chip"
                  style={{ borderColor: '#1a4050', color: 'var(--neon-green)' }}
                >
                  <span className="font-mono-tech text-xs text-gray-600">[{COMPONENT_CATEGORIES[i % COMPONENT_CATEGORIES.length]}]</span>
                  {c}
                  <button
                    className="ml-1 text-gray-600 hover:text-red-400 transition-colors font-bold"
                    onClick={() => removeComponent(i)}
                  >×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Creativity Slider */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono-tech text-xs text-gray-600">▶</span>
          <span className="font-orbitron text-xs neon-green tracking-wider">CREATIVITY MATRIX</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="badge" style={{ background: creativityColor + '20', border: `1px solid ${creativityColor}40`, color: creativityColor }}>
              {creativityLabel}
            </span>
            <span className="font-orbitron text-sm" style={{ color: creativityColor }}>
              {creativityLevel}/10
            </span>
          </div>
        </div>
        <input
          type="range"
          className="slider-neon"
          min={0}
          max={10}
          value={creativityLevel}
          onChange={e => setCreativityLevel(Number(e.target.value))}
        />
        <div className="flex justify-between mt-1">
          <span className="font-mono-tech text-xs text-gray-700">PRECISE</span>
          <span className="font-mono-tech text-xs text-gray-700">BALANCED</span>
          <span className="font-mono-tech text-xs text-gray-700">CHAOTIC</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="panel p-3 border-red-900 fade-in">
          <p className="font-mono-tech text-xs" style={{ color: 'var(--neon-pink)' }}>⚠ {error}</p>
        </div>
      )}

      {/* Refine Button */}
      <button
        className="btn-neon btn-purple w-full py-3 text-sm tracking-widest"
        onClick={refinePrompt}
        disabled={refining}
      >
        {refining ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin inline-block w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full" />
            // PROCESSING NEURAL REFINEMENT...
          </span>
        ) : '⚡ REFINE PROMPT VIA AI'}
      </button>

      {/* Output */}
      {refinedPrompt && (
        <div className="panel p-4 fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono-tech text-xs text-gray-600">▶</span>
            <span className="font-orbitron text-xs neon-purple tracking-wider">REFINED OUTPUT</span>
            <div className="ml-auto flex gap-2">
              <button className="copy-btn" onClick={copyPrompt}>
                {copied ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
          </div>
          <div className="bg-black bg-opacity-40 rounded p-3 border border-purple-900 border-opacity-40">
            <p className="font-mono-tech text-sm text-purple-300 leading-relaxed whitespace-pre-wrap">
              {refinedPrompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptBuilder;
