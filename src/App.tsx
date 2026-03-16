import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Wand2, 
  Info, 
  Layout, 
  Target, 
  ShieldAlert, 
  Users, 
  MessageSquare, 
  FileText,
  ChevronRight,
  History as HistoryIcon,
  ArrowLeftRight,
  X,
  Clock,
  Zap,
  Globe,
  Infinity as InfinityIcon,
  BrainCircuit,
  Activity,
  Dices,
  TrendingUp,
  DollarSign,
  Cpu,
  Lock,
  Eye,
  AlertTriangle,
  Layers,
  Compass,
  Rocket,
  Monitor,
  Hammer,
  Handshake,
  Map as MapIcon,
  Dna,
  Search,
  Network,
  FlaskConical,
  Share2,
  Trophy,
  Image as ImageIcon,
  Sword,
  Star,
  BarChart3,
  LayoutGrid,
  Map
} from 'lucide-react';
import { PromptComponents, PromptVersion, QuantumResult, CasinoResult, AutocompleteSuggestion } from './types';
import { refinePrompt, spinCasino, getAutocompleteSuggestions } from './services/geminiService';

const TEMPLATES = [
  {
    name: "Coding Assistant",
    task: "Write a React component for a data table",
    context: "I am building a dashboard for a logistics company. The table needs to show shipment status.",
    constraints: "Use Tailwind CSS and Lucide icons. No external libraries besides React.",
    audience: "Frontend developers",
    tone: "Professional and technical",
    format: "Clean, documented code with usage examples"
  },
  {
    name: "Creative Writer",
    task: "Write a short story about a time-traveling librarian",
    context: "The librarian discovers a book that shouldn't exist in their timeline.",
    constraints: "Avoid cliches like 'the grandfather paradox'. Keep it under 500 words.",
    audience: "Sci-fi fans",
    tone: "Mysterious and whimsical",
    format: "Narrative prose"
  },
  {
    name: "Business Analyst",
    task: "Analyze the quarterly sales data",
    context: "Sales are up 15% but customer acquisition cost has doubled.",
    constraints: "Focus on the relationship between marketing spend and growth.",
    audience: "Executive leadership team",
    tone: "Data-driven and strategic",
    format: "Executive summary with bulleted recommendations"
  }
];

const GOD_LEVEL_PROMPTS = [
  {
    name: "The Disruptor",
    description: "Invert an entire industry's logic.",
    task: "Invert the logic of the traditional banking industry.",
    context: "Imagine a world where debt is an asset and savings are a liability.",
    constraints: "Must be technically feasible with current blockchain tech.",
    audience: "Venture Capitalists",
    tone: "Radical and visionary",
    format: "Pitch deck outline"
  },
  {
    name: "The Ghostwriter",
    description: "Capture a specific historical voice.",
    task: "Write a letter from Marcus Aurelius to a modern CEO.",
    context: "The CEO is struggling with a PR crisis and internal burnout.",
    constraints: "Use Stoic terminology. Maintain the tone of 'Meditations'.",
    audience: "Modern leaders",
    tone: "Stoic and profound",
    format: "Personal letter"
  },
  {
    name: "The Architect",
    description: "Build a complex system from scratch.",
    task: "Design a self-sustaining Mars colony for 10,000 people.",
    context: "Focus on the intersection of resource management and social psychology.",
    constraints: "Must address oxygen, water, food, and mental health.",
    audience: "NASA engineers",
    tone: "Highly technical and detailed",
    format: "System architecture document"
  }
];

export default function App() {
  const [components, setComponents] = useState<PromptComponents>({
    task: '',
    context: '',
    constraints: '',
    audience: '',
    tone: '',
    format: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<QuantumResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [creativityLevel, setCreativityLevel] = useState<'Safe' | 'Creative' | 'Bold' | 'Wild' | 'Quantum Chaos'>('Creative');
  
  // Casino State
  const [casinoResult, setCasinoResult] = useState<CasinoResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [hasDailySpin, setHasDailySpin] = useState(true);
  
  // Versioning State
  const [history, setHistory] = useState<PromptVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Viral Feature States
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'builder' | 'simulator' | 'viral'>('analysis');

  const handleInputChange = (field: keyof PromptComponents, value: string) => {
    setComponents(prev => ({ ...prev, [field]: value }));
  };

  // Autocomplete Logic
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (components.task.length > 5) {
        setIsSuggesting(true);
        const res = await getAutocompleteSuggestions(components.task);
        setSuggestions(res);
        setIsSuggesting(false);
      } else {
        setSuggestions([]);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [components.task]);

  const applySuggestion = (suggestion: AutocompleteSuggestion) => {
    setComponents(prev => ({ ...prev, [suggestion.type]: suggestion.text }));
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  const handleGenerate = async () => {
    if (!components.task) return;
    setIsGenerating(true);
    const refined = await refinePrompt(components, creativityLevel);
    
    const newVersion: PromptVersion = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      components: { ...components },
      result: refined
    };

    setHistory(prev => [newVersion, ...prev]);
    setResult(refined);
    setIsGenerating(false);
  };

  const revertToVersion = (version: PromptVersion) => {
    setComponents(version.components);
    setResult(version.result);
    setShowHistory(false);
  };

  const toggleCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleSpin = async () => {
    if (!hasDailySpin) {
      alert("You've used your daily spin! Come back tomorrow or share a discovery to unlock another.");
      return;
    }
    setIsSpinning(true);
    try {
      const res = await spinCasino();
      setCasinoResult(res);
      setHasDailySpin(false);
      // Automatically apply the idea to the task
      setComponents(prev => ({
        ...prev,
        task: `Build a startup based on: ${res.idea}`,
        context: `Technology: ${res.tech}, Industry: ${res.industry}, Psychology: ${res.trigger}`,
        format: "Complete business blueprint with brand, pricing, and marketing strategy."
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSpinning(false);
    }
  };
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.refined);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setComponents({
      task: template.task,
      context: template.context,
      constraints: template.constraints,
      audience: template.audience,
      tone: template.tone,
      format: template.format
    });
    setResult(null);
  };

  const reset = () => {
    setComponents({
      task: '',
      context: '',
      constraints: '',
      audience: '',
      tone: '',
      format: ''
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Quantum Prompt Engine</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${showHistory ? 'bg-black text-white' : 'hover:bg-black/5 text-zinc-500'}`}
              title="Version History"
            >
              <HistoryIcon size={20} />
              {history.length > 0 && (
                <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                  {history.length}
                </span>
              )}
            </button>
            <div className="h-6 w-px bg-black/5" />
            <button 
              onClick={reset}
              className="p-2 hover:bg-black/5 rounded-full transition-colors text-zinc-500"
              title="Reset All"
            >
              <RotateCcw size={20} />
            </button>
            <div className="h-6 w-px bg-black/5" />
            <a 
              href="https://ai.google.dev/gemini-api/docs/prompting-strategies" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-medium text-zinc-500 hover:text-black transition-colors flex items-center gap-1"
            >
              Best Practices <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input */}
          <div className={`${showHistory ? 'lg:col-span-4' : 'lg:col-span-7'} space-y-6 transition-all duration-300`}>
            <section className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Blueprint</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {TEMPLATES.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => applyTemplate(t)}
                      className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-zinc-100 hover:bg-zinc-200 rounded transition-colors"
                    >
                      {t.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

            <div className="space-y-6">
              <InputGroup 
                icon={<Layout size={18} />} 
                label="The Task" 
                placeholder="What do you want the AI to do? (e.g., Write a blog post, Debug code)"
                value={components.task}
                onChange={(v) => handleInputChange('task', v)}
                required
              />

              {/* Autocomplete Suggestions */}
              <AnimatePresence>
                {(suggestions.length > 0 || isSuggesting) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                    {isSuggesting ? (
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 animate-pulse">
                        <Wand2 size={12} />
                        AI is thinking of improvements...
                      </div>
                    ) : (
                      suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => applySuggestion(s)}
                          className="text-[10px] font-medium bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                        >
                          <Sparkles size={10} />
                          Add {s.type}: {s.text.length > 20 ? s.text.substring(0, 20) + '...' : s.text}
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <InputGroup 
                icon={<Target size={18} />} 
                label="Context" 
                placeholder="Background information, why this is needed, or specific data to use."
                value={components.context}
                onChange={(v) => handleInputChange('context', v)}
                textarea
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  icon={<ShieldAlert size={18} />} 
                  label="Constraints" 
                  placeholder="Rules, limits, or what to avoid."
                  value={components.constraints}
                  onChange={(v) => handleInputChange('constraints', v)}
                />
                <InputGroup 
                  icon={<Users size={18} />} 
                  label="Audience" 
                  placeholder="Who is the output for?"
                  value={components.audience}
                  onChange={(v) => handleInputChange('audience', v)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  icon={<MessageSquare size={18} />} 
                  label="Tone" 
                  placeholder="Professional, witty, empathetic..."
                  value={components.tone}
                  onChange={(v) => handleInputChange('tone', v)}
                />
                <InputGroup 
                  icon={<FileText size={18} />} 
                  label="Format" 
                  placeholder="Markdown, JSON, bullet points..."
                  value={components.format}
                  onChange={(v) => handleInputChange('format', v)}
                />
              </div>
            </div>

            {/* Creativity Slider */}
            <div className="space-y-4 mt-8">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <BrainCircuit size={14} />
                Creativity Level: <span className="text-indigo-600">{creativityLevel}</span>
              </label>
              <div className="flex justify-between gap-1">
                {(['Safe', 'Creative', 'Bold', 'Wild', 'Quantum Chaos'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setCreativityLevel(level)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all border ${
                      creativityLevel === level 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                        : 'bg-white text-zinc-400 border-black/5 hover:border-indigo-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Idea Casino */}
            <div className="mt-8 bg-zinc-900 rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Dices size={80} className="text-white" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
                    <Dices size={14} className="text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">AI Idea Casino</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <CasinoWheel label="Tech" value={casinoResult?.tech || '???'} spinning={isSpinning} />
                  <CasinoWheel label="Industry" value={casinoResult?.industry || '???'} spinning={isSpinning} />
                  <CasinoWheel label="Trigger" value={casinoResult?.trigger || '???'} spinning={isSpinning} />
                </div>

                {casinoResult && !isSpinning && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        casinoResult.rarity === 'Legendary' ? 'bg-amber-500 text-black' :
                        casinoResult.rarity === 'Epic' ? 'bg-purple-500 text-white' :
                        casinoResult.rarity === 'Rare' ? 'bg-indigo-500 text-white' :
                        'bg-zinc-500 text-white'
                      }`}>
                        {casinoResult.rarity} Discovery
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed italic">"{casinoResult.idea}"</p>
                  </motion.div>
                )}

                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  {isSpinning ? <RotateCcw size={14} className="animate-spin" /> : <Zap size={14} />}
                  {isSpinning ? 'Spinning...' : 'Spin the Idea Machine'}
                </button>
              </div>
            </div>

            {/* Prompt Library */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Rocket size={14} />
                  God-Level Library
                </h3>
                <button 
                  onClick={() => applyTemplate(GOD_LEVEL_PROMPTS[Math.floor(Math.random() * GOD_LEVEL_PROMPTS.length)])}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1"
                >
                  Discovery Mode <Sparkles size={10} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {GOD_LEVEL_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(p)}
                    className="bg-white p-4 rounded-xl border border-black/5 shadow-sm hover:border-indigo-200 transition-all text-left group"
                  >
                    <h4 className="text-xs font-bold text-zinc-700 mb-1 group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                    <p className="text-[10px] text-zinc-400 line-clamp-2">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !components.task}
              className={`w-full mt-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                isGenerating || !components.task
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              }`}
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RotateCcw size={20} />
                </motion.div>
              ) : (
                <>
                  <BrainCircuit size={20} />
                  Ignite Quantum Engine
                </>
              )}
            </button>
          </section>
        </div>

          {/* Right Column: Output / History */}
          <div className={`${showHistory ? 'lg:col-span-8' : 'lg:col-span-5'} transition-all duration-300`}>
            {showHistory ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* History List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                      <Clock size={16} />
                      History
                    </h3>
                    <button 
                      onClick={() => setCompareMode(!compareMode)}
                      className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded transition-all ${compareMode ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                    >
                      {compareMode ? 'Comparing...' : 'Compare Mode'}
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {history.length === 0 ? (
                      <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <p className="text-sm text-zinc-400">No history yet.</p>
                      </div>
                    ) : (
                      history.map((v) => (
                        <div 
                          key={v.id}
                          className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                            selectedForCompare.includes(v.id) 
                              ? 'border-emerald-500 bg-emerald-50' 
                              : 'border-black/5 bg-white hover:border-black/20'
                          }`}
                          onClick={() => compareMode ? toggleCompare(v.id) : revertToVersion(v)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono text-zinc-400">
                              {new Date(v.timestamp).toLocaleTimeString()}
                            </span>
                            {compareMode && (
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedForCompare.includes(v.id) ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-300'}`}>
                                {selectedForCompare.includes(v.id) && <Check size={10} className="text-white" />}
                              </div>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold truncate text-zinc-700">{v.components.task}</h4>
                          <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{v.result.refined}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Comparison / Preview Area */}
                <div className="space-y-4">
                  {compareMode && selectedForCompare.length === 2 ? (
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <ArrowLeftRight size={16} />
                        Comparison
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedForCompare.map(id => {
                          const v = history.find(h => h.id === id);
                          if (!v) return null;
                          return (
                            <div key={id} className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Version {new Date(v.timestamp).toLocaleTimeString()}</span>
                                <button 
                                  onClick={() => toggleCompare(id)}
                                  className="text-zinc-400 hover:text-red-500"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                              <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-zinc-600 bg-zinc-50 p-3 rounded-lg border border-black/5 max-h-[200px] overflow-y-auto">
                                {v.result.refined}
                              </pre>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-zinc-50 rounded-2xl p-8 border border-dashed border-zinc-200 h-full flex flex-col items-center justify-center text-center">
                      <ArrowLeftRight className="text-zinc-300 mb-4" size={32} />
                      <h3 className="text-sm font-medium text-zinc-500">
                        {compareMode ? 'Select two versions to compare' : 'Select a version to revert or compare'}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="sticky top-24 space-y-6">
                <AnimatePresence mode="wait">
                  {!result && !isGenerating ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-indigo-50 border-2 border-dashed border-indigo-100 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Globe className="text-indigo-400" size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-indigo-900">Quantum Core Idle</h3>
                        <p className="text-sm text-indigo-400 mt-1">Input your parameters to begin multi-future synthesis.</p>
                      </div>
                    </motion.div>
                  ) : isGenerating ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm space-y-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
                          <Activity className="text-indigo-600" size={16} />
                        </div>
                        <div className="h-4 w-1/3 bg-zinc-100 rounded animate-pulse" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 w-full bg-zinc-100 rounded animate-pulse" />
                        <div className="h-4 w-full bg-zinc-100 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-zinc-100 rounded animate-pulse" />
                      </div>
                      <div className="h-32 w-full bg-zinc-50 rounded-xl animate-pulse" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-8 pb-24"
                    >
                      {/* Tab Navigation */}
                      <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-black/5 mb-8">
                        {(['analysis', 'builder', 'simulator', 'viral'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                              activeTab === tab 
                                ? 'bg-white text-indigo-600 shadow-sm' 
                                : 'text-zinc-400 hover:text-zinc-600'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {activeTab === 'analysis' && (
                        <div className="space-y-8">
                          {/* DNA Scanner & Health Report */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Cpu size={14} />
                                Prompt DNA Scanner
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <ScoreCard label="Clarity" value={result.scores.creativity} />
                                <ScoreCard label="Originality" value={result.scores.originality} />
                                <ScoreCard label="Virality" value={result.scores.power} />
                                <ScoreCard label="Monetization" value={result.scores.monetization} />
                                <ScoreCard label="Automation" value={result.scores.automation} />
                                <ScoreCard label="Impact" value={result.scores.impact} />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={14} />
                                Health Report
                              </h3>
                              <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-zinc-500">Prompt Strength</span>
                                  <span className={`text-lg font-bold ${result.healthReport.strength > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {result.healthReport.strength}%
                                  </span>
                                </div>
                                
                                <div className="space-y-2">
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Weak Areas</p>
                                  {result.healthReport.weakAreas.map((area, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] text-zinc-600">
                                      <AlertTriangle size={10} className="text-amber-500" />
                                      {area}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Idea Genome */}
                          {result.genome && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Dna size={14} />
                                Idea Genome Mapping
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <GenomeCard label="Disruption" value={result.genome.disruption} />
                                <GenomeCard label="Complexity" value={result.genome.complexity} />
                                <GenomeCard label="Market Size" value={result.genome.marketSize} />
                                <GenomeCard label="Difficulty" value={result.genome.difficulty} />
                              </div>
                            </div>
                          )}

                          {/* Innovation Heatmap */}
                          {result.heatmap && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Map size={14} />
                                Innovation Heatmap
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.heatmap.map((sector, i) => (
                                  <div key={i} className="bg-white p-4 rounded-xl border border-black/5 shadow-sm flex items-center justify-between">
                                    <div>
                                      <p className="text-xs font-bold text-zinc-700">{sector.sector}</p>
                                      <p className="text-[10px] text-zinc-400">{sector.reason}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs font-bold text-emerald-500">{sector.opportunityScore}/100</p>
                                      <p className="text-[8px] font-bold text-zinc-400 uppercase">Opportunity</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Pattern Analysis */}
                          {result.patternAnalysis && (
                            <div className="bg-zinc-900 rounded-2xl p-6 border border-white/5 shadow-xl">
                              <div className="flex items-center gap-2 mb-4">
                                <Compass className="text-emerald-400" size={18} />
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pattern Detection & Creativity Shift</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Your Style</p>
                                  <p className="text-xs text-zinc-300">{result.patternAnalysis.style}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Hidden Creativity</p>
                                  <p className="text-xs text-zinc-300">{result.patternAnalysis.hiddenCreativity}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Suggested Shift</p>
                                  <p className="text-xs text-emerald-400 font-medium">{result.patternAnalysis.suggestedShift}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Refined Prompt Card */}
                          <div className="bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden">
                            <div className="bg-zinc-900 p-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Layers className="text-indigo-400" size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Quantum Refined Output</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => setShowShareModal(true)}
                                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-400 transition-colors"
                                >
                                  <Share2 size={14} />
                                  Share
                                </button>
                                <button
                                  onClick={handleCopy}
                                  className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-indigo-400 transition-colors"
                                >
                                  {copied ? <Check size={14} /> : <Copy size={14} />}
                                  {copied ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                            </div>
                            <div className="p-6">
                              <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-zinc-700 bg-zinc-50 p-4 rounded-xl border border-black/5">
                                {result.refined}
                              </pre>
                            </div>
                          </div>

                          {/* Reality Bending Idea */}
                          {result.realityBentIdea && (
                            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl">
                              <div className="flex items-center gap-2 mb-3">
                                <FlaskConical className="text-purple-300" size={18} />
                                <h3 className="text-sm font-bold uppercase tracking-wider">Reality Bending Discovery</h3>
                              </div>
                              <p className="text-sm text-purple-100 leading-relaxed italic">
                                "{result.realityBentIdea}"
                              </p>
                            </div>
                          )}

                          {/* Business Intelligence */}
                          {result.businessIntel && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={14} />
                                Business Intelligence
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-200">
                                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Brand Name</p>
                                  <h4 className="text-xl font-bold">{result.businessIntel.brandName}</h4>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm md:col-span-2 grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Revenue Model</p>
                                    <p className="text-xs font-medium text-zinc-700">{result.businessIntel.revenueModel}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Pricing</p>
                                    <p className="text-xs font-medium text-zinc-700">{result.businessIntel.pricing}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Marketing Strategy</p>
                                    <p className="text-xs font-medium text-zinc-700">{result.businessIntel.marketingStrategy}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 10-Brain Council */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <Users size={14} />
                              Quantum Expert Council
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {result.council.map((opinion, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-black/5 shadow-sm hover:border-indigo-100 transition-colors">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center">
                                      <BrainCircuit size={12} className="text-indigo-600" />
                                    </div>
                                    <span className="text-[10px] font-bold text-indigo-900 uppercase">{opinion.expert}</span>
                                  </div>
                                  <p className="text-xs text-zinc-600 leading-relaxed">{opinion.insight}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'builder' && (
                        <div className="space-y-8">
                          {/* Autonomous Builder Mode */}
                          {result.builder && (
                            <div className="space-y-6">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Hammer size={14} />
                                Autonomous Builder Output
                              </h3>
                              <div className="grid grid-cols-1 gap-6">
                                <BuilderCard label="Landing Page Concept" content={result.builder.landingPage} icon={<Monitor size={16} />} />
                                <BuilderCard label="App Interface Design" content={result.builder.appInterface} icon={<Layout size={16} />} />
                                <BuilderCard label="Product Roadmap" content={result.builder.roadmap} icon={<TrendingUp size={16} />} />
                                <BuilderCard label="Marketing Funnel" content={result.builder.marketingFunnel} icon={<Target size={16} />} />
                              </div>
                            </div>
                          )}

                          {/* Autonomous Market Researcher */}
                          {result.marketResearch && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Search size={14} />
                                Autonomous Market Researcher
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm space-y-3">
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Competitors</p>
                                  <ul className="space-y-2">
                                    {result.marketResearch.competitors.map((c, i) => (
                                      <li key={i} className="text-xs text-zinc-600 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                                        {c}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm space-y-3">
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pricing Trends</p>
                                  <ul className="space-y-2">
                                    {result.marketResearch.pricingTrends.map((p, i) => (
                                      <li key={i} className="text-xs text-zinc-600 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                                        {p}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm space-y-3">
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Future Trends</p>
                                  <ul className="space-y-2">
                                    {result.marketResearch.futureTrends.map((t, i) => (
                                      <li key={i} className="text-xs text-zinc-600 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-amber-400 rounded-full" />
                                        {t}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Idea Ecosystem */}
                          {result.ecosystem && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Network size={14} />
                                Idea Ecosystem Builder
                              </h3>
                              <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
                                <div className="mb-4">
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Core Idea</p>
                                  <p className="text-sm font-bold text-indigo-600">{result.ecosystem.core}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {result.ecosystem.components.map((comp, i) => (
                                    <div key={i} className="p-3 bg-zinc-50 rounded-xl border border-black/5">
                                      <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{comp.type}</p>
                                      <p className="text-xs text-zinc-600">{comp.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'simulator' && (
                        <div className="space-y-8">
                          {/* Digital Twin Simulator */}
                          {result.digitalTwin && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Monitor size={14} />
                                Digital Twin Idea Simulator
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm text-center">
                                  <Users className="mx-auto text-indigo-500 mb-2" size={24} />
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Simulated Users</p>
                                  <p className="text-2xl font-bold text-zinc-800">{result.digitalTwin.simulatedUsers.toLocaleString()}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm text-center">
                                  <Activity className="mx-auto text-emerald-500 mb-2" size={24} />
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Retention Rate</p>
                                  <p className="text-2xl font-bold text-zinc-800">{result.digitalTwin.retentionRate}%</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm text-center">
                                  <DollarSign className="mx-auto text-amber-500 mb-2" size={24} />
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Revenue Projection</p>
                                  <p className="text-2xl font-bold text-zinc-800">{result.digitalTwin.revenueProjection}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Future Simulations */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <Globe size={14} />
                              Future Simulation Lab
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                              {result.simulations.map((sim, i) => (
                                <div key={i} className={`p-3 rounded-xl border ${
                                  sim.type === 'Success' ? 'bg-emerald-50 border-emerald-100' :
                                  sim.type === 'Failure' ? 'bg-rose-50 border-rose-100' :
                                  sim.type === 'Viral' ? 'bg-indigo-50 border-indigo-100' :
                                  sim.type === 'Competitor' ? 'bg-amber-50 border-amber-100' :
                                  sim.type === 'Saturation' ? 'bg-zinc-50 border-zinc-200' :
                                  'bg-violet-50 border-violet-100'
                                }`}>
                                  <span className={`text-[8px] font-bold uppercase tracking-widest mb-1 block ${
                                    sim.type === 'Success' ? 'text-emerald-600' :
                                    sim.type === 'Failure' ? 'text-rose-600' :
                                    sim.type === 'Viral' ? 'text-indigo-600' :
                                    sim.type === 'Competitor' ? 'text-amber-600' :
                                    sim.type === 'Saturation' ? 'text-zinc-600' :
                                    'text-violet-600'
                                  }`}>{sim.type}</span>
                                  <p className="text-[10px] text-zinc-700 leading-tight">{sim.prediction}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Time Machine Mode */}
                          {result.timeMachine && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} />
                                Time Machine Mode
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TimeCard label="Past (Why it failed)" content={result.timeMachine.past} color="rose" />
                                <TimeCard label="Present (Opportunity)" content={result.timeMachine.present} color="emerald" />
                                <TimeCard label="Future (10-Year Evolution)" content={result.timeMachine.future} color="indigo" />
                              </div>
                            </div>
                          )}

                          {/* AI Negotiation Simulator */}
                          {result.negotiation && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Handshake size={14} />
                                AI Negotiation Simulator
                              </h3>
                              <div className="space-y-3">
                                {result.negotiation.map((neg, i) => (
                                  <div key={i} className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm space-y-3">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Users size={16} className="text-zinc-500" />
                                      </div>
                                      <div className="bg-zinc-100 p-3 rounded-2xl rounded-tl-none">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">{neg.persona}</p>
                                        <p className="text-xs text-zinc-700">"{neg.concern}"</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-3 justify-end">
                                      <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none text-white max-w-[80%]">
                                        <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Suggested Response</p>
                                        <p className="text-xs">{neg.suggestedResponse}</p>
                                      </div>
                                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Zap size={16} className="text-indigo-600" />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Autonomous Innovation Agent (Experiments) */}
                          {result.experiments && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <FlaskConical size={14} />
                                Autonomous Innovation Agent
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.experiments.map((exp, i) => (
                                  <div key={i} className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm space-y-2">
                                    <div className="flex items-center justify-between">
                                      <p className="text-[10px] font-bold text-indigo-600 uppercase">Experiment 0{i+1}</p>
                                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-bold rounded-full uppercase">Active</span>
                                    </div>
                                    <p className="text-xs font-bold text-zinc-800">{exp.experiment}</p>
                                    <p className="text-[10px] text-zinc-500 italic">Hypothesis: {exp.hypothesis}</p>
                                    <div className="pt-2 border-t border-black/5">
                                      <p className="text-[9px] font-bold text-zinc-400 uppercase">Projected Outcome</p>
                                      <p className="text-[10px] text-zinc-600">{exp.projectedOutcome}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'viral' && (
                        <div className="space-y-8">
                          {/* Share Discovery Card Preview */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <Share2 size={14} />
                              Shareable Discovery Card
                            </h3>
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-2xl max-w-sm mx-auto text-center space-y-6">
                              <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-md">
                                <Sparkles size={32} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">AI Discovery</p>
                                <h4 className="text-xl font-bold mt-2 leading-tight">
                                  {result.businessIntel?.brandName || result.components.task}
                                </h4>
                              </div>
                              <div className="flex justify-center gap-4">
                                <div className="text-center">
                                  <p className="text-[10px] font-bold uppercase opacity-60">Impact</p>
                                  <p className="text-lg font-bold">{result.scores.impact}/100</p>
                                </div>
                                <div className="h-8 w-px bg-white/20" />
                                <div className="text-center">
                                  <p className="text-[10px] font-bold uppercase opacity-60">Virality</p>
                                  <p className="text-lg font-bold">{result.scores.power}/100</p>
                                </div>
                              </div>
                              <div className="pt-4 border-t border-white/10">
                                <p className="text-[10px] font-medium opacity-60">Generated by Quantum AI OS</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setShowShareModal(true)}
                              className="w-full py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                            >
                              <Share2 size={14} />
                              Share to Social Media
                            </button>
                          </div>

                          {/* Leaderboard Mock */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <Trophy size={14} />
                              Global Discovery Leaderboard
                            </h3>
                            <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                              {[
                                { rank: 1, name: "Neural Sleep Learning", score: 98, user: "Alex_AI" },
                                { rank: 2, name: "Carbon Capture DAO", score: 95, user: "EcoTech" },
                                { rank: 3, name: "Emotion-Based Gaming", score: 92, user: "GameMaster" }
                              ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border-b border-black/5 last:border-0 hover:bg-zinc-50 transition-colors">
                                  <div className="flex items-center gap-4">
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-zinc-500'}`}>
                                      {item.rank}
                                    </span>
                                    <div>
                                      <p className="text-xs font-bold text-zinc-700">{item.name}</p>
                                      <p className="text-[10px] text-zinc-400">by {item.user}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs font-bold text-indigo-600">{item.score}</p>
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase">Score</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Challenge Mode Mock */}
                          <div className="bg-zinc-900 rounded-2xl p-6 text-white border border-white/5 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Sword size={64} />
                            </div>
                            <div className="relative z-10 space-y-4">
                              <div className="flex items-center gap-2">
                                <Star className="text-amber-400" size={18} />
                                <h3 className="text-sm font-bold uppercase tracking-wider">Weekly Challenge</h3>
                              </div>
                              <div>
                                <h4 className="text-lg font-bold">The Great Decarbonization</h4>
                                <p className="text-xs text-zinc-400 mt-1">Invent a scalable AI system to remove 1 gigaton of CO2 by 2030.</p>
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                  <Users size={14} className="text-zinc-500" />
                                  <span className="text-[10px] font-bold text-zinc-500">1,240 Participants</span>
                                </div>
                                <button className="px-4 py-2 bg-white text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                                  Join Challenge
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Public Idea Gallery Mock */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <LayoutGrid size={14} />
                              Public Discovery Gallery
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {[
                                { title: "Quantum Farming", tag: "AgriTech", color: "bg-emerald-500" },
                                { title: "Bio-Digital Mesh", tag: "Health", color: "bg-indigo-500" },
                                { title: "Mars Colony OS", tag: "Space", color: "bg-rose-500" },
                                { title: "AI Ethics Layer", tag: "Safety", color: "bg-amber-500" },
                                { title: "Ocean Plastic Bot", tag: "Eco", color: "bg-cyan-500" },
                                { title: "Neural Link Art", tag: "Creative", color: "bg-purple-500" }
                              ].map((item, i) => (
                                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
                                  <div className={`absolute inset-0 ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">{item.tag}</span>
                                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Common Footer Sections (History, Experimental, etc.) */}
                      <div className="space-y-8 pt-8 border-t border-black/5">
                        {/* Parallel Universes */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <InfinityIcon size={14} />
                            Parallel Universe Variations
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {result.parallelUniverses.map((uni, i) => (
                              <div key={i} className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:border-indigo-200 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{uni.name}</span>
                                  <ArrowLeftRight size={12} className="text-zinc-300 group-hover:text-indigo-400" />
                                </div>
                                <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed">{uni.description}</p>
                                <div className="bg-zinc-50 p-3 rounded-lg border border-black/5 text-[10px] font-mono text-zinc-400 line-clamp-3">
                                  {uni.prompt}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Self Improvement Section */}
                        <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
                          <div className="flex items-center gap-2 mb-3">
                            <InfinityIcon className="text-violet-600" size={18} />
                            <h3 className="text-sm font-bold text-violet-900 uppercase tracking-wider">Self-Improving Evolution</h3>
                          </div>
                          <p className="text-xs text-violet-800/80 leading-relaxed font-mono bg-white/50 p-3 rounded-lg border border-violet-200/50">
                            {result.selfImprovement}
                          </p>
                        </div>

                        {/* Experimental Variations */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <BrainCircuit size={14} />
                            Wild Experimental Variations
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {result.experimentalPrompts.map((p, i) => (
                              <div key={i} className="bg-white p-4 rounded-xl border border-black/5 text-xs text-zinc-600 leading-relaxed hover:border-indigo-200 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Variation 0{i+1}</span>
                                  <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                {p}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Never Tried Before */}
                        <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="text-indigo-300" size={18} />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Never Tried Before Discovery</h3>
                          </div>
                          <p className="text-sm text-indigo-100 leading-relaxed italic">
                            "{result.neverTriedBefore}"
                          </p>
                        </div>

                        {/* Suggested Next */}
                        <div className="flex items-center justify-between p-4 bg-zinc-100 rounded-xl border border-black/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <ChevronRight className="text-indigo-600" size={16} />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">Suggested Next Evolution</p>
                              <p className="text-xs text-zinc-600 font-medium">{result.suggestedNext}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-8 text-center space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-zinc-800">Share Your Discovery</h3>
                  <button onClick={() => setShowShareModal(false)} className="text-zinc-400 hover:text-zinc-600">
                    <X size={20} />
                  </button>
                </div>
                
                {/* Preview Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl text-center space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-md">
                    <Sparkles size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">AI Discovery</p>
                    <h4 className="text-xl font-bold mt-2 leading-tight">
                      {result?.businessIntel?.brandName || result?.components.task}
                    </h4>
                  </div>
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase opacity-60">Impact</p>
                      <p className="text-lg font-bold">{result?.scores.impact}/100</p>
                    </div>
                    <div className="h-8 w-px bg-white/20" />
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase opacity-60">Virality</p>
                      <p className="text-lg font-bold">{result?.scores.power}/100</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-3 bg-zinc-100 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-200 transition-all">
                    <ImageIcon size={16} /> Save Image
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-zinc-100 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-200 transition-all">
                    <Copy size={16} /> Copy Link
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    setShowShareModal(false);
                    setHasDailySpin(true); // Reward for sharing
                    alert("Discovery shared! You've earned an extra Quantum Spin.");
                  }}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all"
                >
                  Post to Discovery Network
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-black/5 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-zinc-400 font-medium">
            © 2026 Prompt Architect. Built for the next generation of AI users.
          </div>
          <div className="flex gap-8">
            <FooterLink label="Principles" href="#" />
            <FooterLink label="Community" href="#" />
            <FooterLink label="API" href="#" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function InputGroup({ 
  icon, 
  label, 
  placeholder, 
  value, 
  onChange, 
  textarea = false,
  required = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  placeholder: string; 
  value: string; 
  onChange: (v: string) => void;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
        <span className="text-zinc-400">{icon}</span>
        {label}
        {required && <span className="text-emerald-500 ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all min-h-[100px] resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
        />
      )}
    </div>
  );
}

function CasinoWheel({ label, value, spinning }: { label: string; value: string; spinning: boolean }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center overflow-hidden">
      <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">{label}</p>
      <div className="h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`text-[10px] font-bold text-white whitespace-nowrap ${spinning ? 'animate-pulse' : ''}`}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-black/5 shadow-sm text-center">
      <p className="text-[8px] font-bold text-zinc-400 uppercase mb-1">{label}</p>
      <p className={`text-lg font-bold ${value > 80 ? 'text-emerald-500' : value > 60 ? 'text-indigo-500' : 'text-amber-500'}`}>
        {value}
      </p>
    </div>
  );
}

function GenomeCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-black/5 shadow-sm">
      <p className="text-[8px] font-bold text-zinc-400 uppercase mb-1">{label}</p>
      <p className="text-xs font-bold text-zinc-700">{value}</p>
    </div>
  );
}

function BuilderCard({ label, content, icon }: { label: string; content: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="bg-zinc-50 p-3 border-b border-black/5 flex items-center gap-2">
        <span className="text-indigo-600">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
      </div>
      <div className="p-4">
        <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

function TimeCard({ label, content, color }: { label: string; content: string; color: 'rose' | 'emerald' | 'indigo' }) {
  const colors = {
    rose: 'bg-rose-50 text-rose-800 border-rose-100',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-800 border-indigo-100'
  };
  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} space-y-2`}>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</p>
      <p className="text-xs leading-relaxed">{content}</p>
    </div>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <a 
      href={href} 
      className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-600 transition-colors"
    >
      {label}
    </a>
  );
}
