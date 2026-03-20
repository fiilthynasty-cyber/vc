import React, { useState, useEffect } from 'react';
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
  Flag,
  LayoutGrid,
  Shield,
  Map,
  Bug,
  Lightbulb,
  Send,
  CheckCircle,
  Key,
  FastForward,
  Sun,
  Moon
} from 'lucide-react';
import { PromptComponents, PromptVersion, QuantumResult, CasinoResult, AutocompleteSuggestion } from './types';
import { refinePrompt, spinCasino, getAutocompleteSuggestions, analyzeFeedback, reviewCode, CodeReviewResult } from './services/geminiService';

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
  },
  {
    name: "The Launchpad",
    description: "Generate a complete, launch-ready full-stack app blueprint.",
    task: "Create a revolutionary AI-powered personal finance manager.",
    context: "The app should help Gen Z users automate savings and investments using behavioral psychology.",
    constraints: "Must be scalable to millions of users. High security is paramount.",
    audience: "Venture Capitalists and Lead Engineers",
    tone: "Visionary, technical, and business-oriented",
    format: "Full Stack Launchpad Blueprint"
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
  
  // Code Review State
  const [codeToReview, setCodeToReview] = useState('');
  const [codeReviewResult, setCodeReviewResult] = useState<CodeReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [blueprintIdea, setBlueprintIdea] = useState('');
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);
  
  // Versioning State
  const [history, setHistory] = useState<PromptVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Viral Feature States
  const [showShareModal, setShowShareModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  const [activeTab, setActiveTab] = useState<'analysis' | 'builder' | 'simulator' | 'viral' | 'future' | 'architect' | 'feedback' | 'launchpad'>('analysis');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('quantum-theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('quantum-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const [feedbackForm, setFeedbackForm] = useState({ type: 'suggestion', content: '', email: '' });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackList, setFeedbackList] = useState<{ id: string; type: string; content: string; email: string; timestamp: number; analysis?: string }[]>([]);
  const [isAnalyzingFeedback, setIsAnalyzingFeedback] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing Quantum Core...');

  const loadingMessages = [
    'Initializing Quantum Core...',
    'Scanning Prompt DNA...',
    'Consulting the Council of 10...',
    'Simulating Parallel Universes...',
    'Calculating Butterfly Effects...',
    'Synthesizing Neural Insights...',
    'Architecting Strategic Blueprint...',
    'Bending Reality Parameters...',
    'Optimizing Token Entropy...',
    'Calibrating Semantic Weights...',
    'Mapping Multi-Dimensional Context...',
    'Decrypting Hidden Intent...',
    'Synchronizing Temporal Nodes...',
    'Harmonizing Cognitive Dissonance...',
    'Collapsing Probability Wavefronts...',
    'Finalizing Quantum Refinement...'
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingStatus(loadingMessages[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

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
    try {
      const refined = await refinePrompt(components, creativityLevel);
      
      const newVersion: PromptVersion = {
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        components: { ...components },
        result: refined
      };

      setHistory(prev => [newVersion, ...prev]);
      setResult(refined);
    } catch (error: any) {
      console.error("Generation Error:", error);
      const isRateLimit = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
      if (isRateLimit) {
        showNotification("Quantum Quota Exhausted. Please wait a moment for the nodes to reset.", "info");
      } else {
        showNotification("Quantum Link Failed. Please try again.", "info");
      }
    } finally {
      setIsGenerating(false);
    }
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
    if (!hasDailySpin) return;
    setIsSpinning(true);
    try {
      const res = await spinCasino();
      setCasinoResult(res);
      setHasDailySpin(false);
      // Automatically apply the idea to the task
      setComponents(prev => ({
        ...prev,
        task: `Build a ${res.type} based on: ${res.idea}`,
        context: `Type: ${res.type}, Technology: ${res.tech}, Industry: ${res.industry}, Psychology: ${res.trigger}`,
        format: "Complete execution blueprint with viral hooks, pricing, and automation strategy."
      }));
    } catch (error: any) {
      console.error("Jackpot Error:", error);
      const isRateLimit = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
      if (isRateLimit) {
        showNotification("Jackpot Quota Exhausted. Try again in a few seconds.", "info");
      } else {
        showNotification("Jackpot Link Failed. Try again.", "info");
      }
    } finally {
      setIsSpinning(false);
    }
  };

  const handleCodeReview = async () => {
    if (!codeToReview) return;
    setIsReviewing(true);
    try {
      const res = await reviewCode(codeToReview);
      setCodeReviewResult(res);
      showNotification("Code Review Complete. Analysis loaded in Builder tab.", "success");
    } catch (error: any) {
      console.error("Code Review Error:", error);
      const isRateLimit = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
      if (isRateLimit) {
        showNotification("Review Quota Exhausted. Please wait.", "info");
      } else {
        showNotification("Quantum Review Failed. Try again.", "info");
      }
    } finally {
      setIsReviewing(false);
    }
  };

  const handleGenerateBlueprint = async () => {
    if (!blueprintIdea) return;
    setIsGeneratingBlueprint(true);
    try {
      const blueprintComponents: PromptComponents = {
        task: blueprintIdea,
        context: "Generate a complete, launch-ready full-stack application blueprint.",
        constraints: "Focus on scalability, performance, and high security. Include specific implementation details for auth, payments, and viral growth.",
        audience: "Venture Capitalists and Lead Engineers",
        tone: "Visionary and technical",
        format: "Full Stack Launchpad Blueprint"
      };
      
      const refined = await refinePrompt(blueprintComponents, 'Bold');
      setResult(refined);
      setActiveTab('launchpad');
      showNotification("Full Stack Blueprint Generated", "success");
    } catch (error: any) {
      console.error("Blueprint Generation Error:", error);
      const isRateLimit = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
      if (isRateLimit) {
        showNotification("Launchpad Quota Exhausted. Please wait.", "info");
      } else {
        showNotification("Launchpad Sequence Failed. Please try again.", "info");
      }
    } finally {
      setIsGeneratingBlueprint(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.content) return;
    setIsSubmittingFeedback(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newFeedback = {
      id: Math.random().toString(36).substring(7),
      ...feedbackForm,
      timestamp: Date.now()
    };
    setFeedbackList(prev => [newFeedback, ...prev]);
    setFeedbackForm({ type: 'suggestion', content: '', email: '' });
    setIsSubmittingFeedback(false);
    showNotification('Feedback submitted to the Quantum Core!', 'success');
  };

  const handleAnalyzeFeedback = async () => {
    if (feedbackList.length === 0) return;
    setIsAnalyzingFeedback(true);
    try {
      const analysis = await analyzeFeedback(feedbackList.map(f => ({ type: f.type, content: f.content })));
      setFeedbackList(prev => prev.map((f, i) => i === 0 ? { ...f, analysis } : f));
      showNotification('Quantum Analysis Complete!', 'info');
    } catch (error) {
      console.error(error);
      showNotification('Analysis failed.', 'info');
    } finally {
      setIsAnalyzingFeedback(false);
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#050505] text-zinc-100' : 'bg-zinc-50 text-zinc-900'} font-sans selection:bg-purple-500/30 transition-colors duration-300`}>
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            role="alert"
            aria-live="polite"
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-zinc-800 text-white rounded-full shadow-2xl border border-white/10 flex items-center gap-3"
          >
            <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-fuchsia-400' : 'bg-purple-400'} animate-pulse`} />
            <span className="text-xs font-bold uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-zinc-900/50 border-white/10' : 'bg-white/80 border-black/5'} backdrop-blur-xl border-b sticky top-0 z-10 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">Quantum Prompt Engine</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors focus:ring-2 focus:ring-purple-500/40 outline-none ${theme === 'dark' ? 'hover:bg-white/5 text-zinc-400' : 'hover:bg-black/5 text-zinc-600'}`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 focus:ring-2 focus:ring-purple-500/40 outline-none ${showHistory ? 'bg-purple-600 text-white' : 'hover:bg-white/5 text-zinc-400'}`}
              title="Version History"
              aria-label="Toggle Version History"
              aria-expanded={showHistory}
            >
              <HistoryIcon size={20} />
              {history.length > 0 && (
                <span className="text-[10px] font-bold bg-fuchsia-500 text-white px-1.5 py-0.5 rounded-full">
                  {history.length}
                </span>
              )}
            </button>
            <div className="h-6 w-px bg-white/10" />
            <button 
              onClick={reset}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 focus:ring-2 focus:ring-rose-500/40 outline-none"
              title="Reset All"
              aria-label="Reset All Components"
            >
              <RotateCcw size={20} />
            </button>
            <div className="h-6 w-px bg-white/10" />
            <a 
              href="https://ai.google.dev/gemini-api/docs/prompting-strategies" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              aria-label="Prompting Best Practices (opens in new tab)"
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
            <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Blueprint</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {TEMPLATES.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => applyTemplate(t)}
                      className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
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
                theme={theme}
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
                          className="text-[10px] font-medium bg-purple-900/30 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30 hover:bg-purple-900/50 transition-colors flex items-center gap-1"
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
                theme={theme}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  icon={<ShieldAlert size={18} />} 
                  label="Constraints" 
                  placeholder="Rules, limits, or what to avoid."
                  value={components.constraints}
                  onChange={(v) => handleInputChange('constraints', v)}
                  theme={theme}
                />
                <InputGroup 
                  icon={<Users size={18} />} 
                  label="Audience" 
                  placeholder="Who is the output for?"
                  value={components.audience}
                  onChange={(v) => handleInputChange('audience', v)}
                  theme={theme}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  icon={<MessageSquare size={18} />} 
                  label="Tone" 
                  placeholder="Professional, witty, empathetic..."
                  value={components.tone}
                  onChange={(v) => handleInputChange('tone', v)}
                  theme={theme}
                />
                <InputGroup 
                  icon={<FileText size={18} />} 
                  label="Format" 
                  placeholder="Markdown, JSON, bullet points..."
                  value={components.format}
                  onChange={(v) => handleInputChange('format', v)}
                  theme={theme}
                />
              </div>
            </div>

            {/* Creativity Slider */}
            <div className="space-y-4 mt-8">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <BrainCircuit size={14} />
                Creativity Level: <span className="text-purple-400">{creativityLevel}</span>
              </label>
              <div className="flex justify-between gap-1">
                {(['Safe', 'Creative', 'Bold', 'Wild', 'Quantum Chaos'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setCreativityLevel(level)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all border ${
                      creativityLevel === level 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20' 
                        : 'bg-zinc-800 text-zinc-400 border-white/10 hover:border-purple-500/30'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Idea Jackpot */}
            <div className="mt-8 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden group transition-colors duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy size={80} className="text-white" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center">
                      <Trophy size={14} className="text-white" />
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Idea Jackpot</h3>
                  </div>
                  <div className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${hasDailySpin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {hasDailySpin ? 'Daily Spin Available' : 'Next Spin Tomorrow'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4" role="group" aria-label="Jackpot Wheels">
                  <CasinoWheel label="Tech/Platform" value={casinoResult?.tech || '???'} spinning={isSpinning} theme={theme} />
                  <CasinoWheel label="Industry/Niche" value={casinoResult?.industry || '???'} spinning={isSpinning} theme={theme} />
                  <CasinoWheel label="Trigger" value={casinoResult?.trigger || '???'} spinning={isSpinning} theme={theme} />
                </div>

                {casinoResult && !isSpinning && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10"
                    aria-live="polite"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-amber-400 uppercase tracking-widest">{casinoResult.type}</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                          casinoResult.rarity === 'Legendary' ? 'bg-amber-500 text-black' :
                          casinoResult.rarity === 'Epic' ? 'bg-fuchsia-500 text-white' :
                          casinoResult.rarity === 'Rare' ? 'bg-purple-500 text-white' :
                          'bg-zinc-500 text-white'
                        }`}>
                          {casinoResult.rarity} Discovery
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed italic">"{casinoResult.idea}"</p>
                  </motion.div>
                )}

                <button
                  onClick={handleSpin}
                  disabled={isSpinning || !hasDailySpin}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                    hasDailySpin 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-amber-500/20' 
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                  aria-busy={isSpinning}
                  aria-label={isSpinning ? 'Spinning the jackpot' : hasDailySpin ? 'Spin the jackpot' : 'Jackpot spin unavailable'}
                >
                  {isSpinning ? <RotateCcw size={14} className="animate-spin" /> : <Zap size={14} />}
                  {isSpinning ? 'Spinning...' : hasDailySpin ? 'Spin the Jackpot' : 'Come Back Tomorrow'}
                </button>
                
                {!hasDailySpin && (
                  <p className="text-[8px] text-center text-zinc-500 mt-2 uppercase tracking-widest">
                    Share a discovery to unlock an extra spin!
                  </p>
                )}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="list" aria-label="Prompt Templates">
                      {GOD_LEVEL_PROMPTS.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => applyTemplate(p)}
                          className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-black/5 dark:border-white/5 shadow-sm hover:border-indigo-200 transition-all text-left group"
                          aria-label={`Apply template: ${p.name}`}
                          role="listitem"
                        >
                          <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-200 mb-1 group-hover:text-indigo-600 transition-colors">{p.name}</h4>
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
              aria-busy={isGenerating}
              aria-disabled={isGenerating || !components.task}
              aria-label={isGenerating ? 'Generating prompt...' : 'Ignite Quantum Engine'}
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
                      aria-pressed={compareMode}
                      className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded transition-all focus:ring-2 focus:ring-emerald-500/40 outline-none ${compareMode ? 'bg-emerald-500 text-white' : (theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200')}`}
                    >
                      {compareMode ? 'Comparing...' : 'Compare Mode'}
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar" role="list" aria-label="Version History List">
                    {history.length === 0 ? (
                      <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200" role="status">
                        <p className="text-sm text-zinc-400">No history yet.</p>
                      </div>
                    ) : (
                      history.map((v) => (
                        <div 
                          key={v.id}
                          className={`p-4 rounded-xl border transition-all cursor-pointer group relative ${
                            selectedForCompare.includes(v.id) 
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                              : theme === 'dark' ? 'border-white/10 bg-zinc-900 hover:border-white/20' : 'border-black/10 bg-white hover:border-black/20 shadow-sm'
                          }`}
                          onClick={() => compareMode ? toggleCompare(v.id) : revertToVersion(v)}
                          role="listitem"
                          aria-label={`Version from ${new Date(v.timestamp).toLocaleTimeString()}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono text-zinc-400">
                              {new Date(v.timestamp).toLocaleTimeString()}
                            </span>
                            <div className="flex items-center gap-2">
                              {!compareMode && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    revertToVersion(v);
                                  }}
                                  className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:text-purple-400' : 'bg-zinc-100 text-zinc-600 hover:text-purple-600'} transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none focus:ring-2 focus:ring-purple-500/40`}
                                  title="Rollback to this version"
                                  aria-label={`Rollback to version from ${new Date(v.timestamp).toLocaleTimeString()}`}
                                >
                                  <RotateCcw size={12} />
                                </button>
                              )}
                              {compareMode && (
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedForCompare.includes(v.id) ? 'bg-emerald-500 border-emerald-500' : theme === 'dark' ? 'border-zinc-700' : 'border-zinc-300'}`}>
                                  {selectedForCompare.includes(v.id) && <Check size={10} className="text-white" />}
                                </div>
                              )}
                            </div>
                          </div>
                          <h4 className={`text-sm font-semibold truncate ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{v.components.task}</h4>
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
                            <div key={id} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} rounded-2xl p-4 border shadow-sm`}>
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Version {new Date(v.timestamp).toLocaleTimeString()}</span>
                                  <span className={`text-[10px] font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>{new Date(v.timestamp).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => revertToVersion(v)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20 focus:ring-2 focus:ring-purple-500/40 outline-none"
                                    aria-label={`Rollback to version from ${new Date(v.timestamp).toLocaleTimeString()}`}
                                  >
                                    <RotateCcw size={12} />
                                    Rollback
                                  </button>
                                  <button 
                                    onClick={() => toggleCompare(id)}
                                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-red-500/10 text-zinc-500' : 'hover:bg-red-50 text-zinc-400'} hover:text-red-500 transition-colors focus:ring-2 focus:ring-red-500/40 outline-none`}
                                    aria-label="Remove from comparison"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                              <pre className={`text-xs leading-relaxed whitespace-pre-wrap font-mono ${theme === 'dark' ? 'text-zinc-400 bg-black/20 border-white/5' : 'text-zinc-600 bg-zinc-50 border-black/5'} p-3 rounded-lg border max-h-[200px] overflow-y-auto custom-scrollbar`}>
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
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-3xl p-12 border border-black/5 shadow-2xl space-y-8 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100">
                        <motion.div 
                          className="h-full bg-indigo-600"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 15, ease: "linear" }}
                        />
                      </div>

                      <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse">
                            <Activity className="text-indigo-600" size={32} />
                          </div>
                          <motion.div 
                            className="absolute -inset-2 border-2 border-indigo-200 rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>

                        <div className="space-y-2 h-12 flex flex-col items-center justify-center">
                          <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Quantum Synthesis in Progress</h3>
                          <AnimatePresence mode="wait">
                            <motion.p 
                              key={loadingStatus}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-sm text-indigo-600 font-mono font-bold uppercase tracking-widest"
                            >
                              {loadingStatus}
                            </motion.p>
                          </AnimatePresence>
                        </div>

                        <div className="w-full max-w-md space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
                              <span>Neural Load</span>
                              <span>88%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-indigo-500"
                                animate={{ width: ["20%", "88%", "45%", "92%"] }}
                                transition={{ duration: 10, repeat: Infinity }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-fuchsia-500"
                                  animate={{ width: ["0%", "100%", "0%"] }}
                                  transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-zinc-50 border-black/5'} rounded-xl p-4 font-mono text-[10px] text-emerald-400/80 space-y-1 h-32 overflow-hidden relative border transition-colors`}>
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10 pointer-events-none" />
                          <div className="space-y-1">
                            <p className="opacity-40">&gt; [SYSTEM] Quantum Core v10.0 Online</p>
                            <p className="opacity-50">&gt; [DATA] DNA Hash: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                            <p className="opacity-60">&gt; [PROC] Parallel Processing Enabled</p>
                            <p className="opacity-70">&gt; [NEURAL] Synaptic Bridge Established</p>
                            <p className="opacity-80">&gt; [AUTH] Council of 10: Status Green</p>
                            <p className="text-fuchsia-400 font-bold animate-pulse">&gt; [STATUS] {loadingStatus}</p>
                            <p className="text-purple-400/70">&gt; [LOG] {new Date().toISOString().split('T')[1].split('.')[0]} - {loadingStatus.split(' ')[0]} sequence initiated</p>
                            <p className="animate-bounce">_</p>
                          </div>
                        </div>
                        <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/10 space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">Active Nodes</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-zinc-700 rounded-full overflow-hidden">
                              <motion.div className="h-full bg-purple-500" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity }} />
                            </div>
                            <div className="h-2 w-2/3 bg-zinc-700 rounded-full overflow-hidden">
                              <motion.div className="h-full bg-fuchsia-500" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-8 pb-24"
                    >
                      {/* Tab Navigation */}
                      <div 
                        role="tablist"
                        aria-label="Application sections"
                        className={`flex items-center gap-1 p-1 ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} rounded-xl border mb-8 overflow-x-auto transition-colors`}
                      >
                        {(['analysis', 'builder', 'simulator', 'architect', 'future', 'viral', 'launchpad', 'feedback'] as const).map((tab) => (
                          <button
                            key={tab}
                            role="tab"
                            aria-selected={activeTab === tab}
                            aria-controls={`panel-${tab}`}
                            id={`tab-${tab}`}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-w-[80px] py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all focus:ring-2 focus:ring-purple-500/40 outline-none ${
                              activeTab === tab 
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                                : (theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900')
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          id={`tab-panel-${activeTab}`}
                          role="tabpanel"
                          aria-labelledby={`tab-${activeTab}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
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
                                <ScoreCard label="Clarity" value={result.scores.creativity} theme={theme} />
                                <ScoreCard label="Originality" value={result.scores.originality} theme={theme} />
                                <ScoreCard label="Virality" value={result.scores.power} theme={theme} />
                                <ScoreCard label="Monetization" value={result.scores.monetization} theme={theme} />
                                <ScoreCard label="Automation" value={result.scores.automation} theme={theme} />
                                <ScoreCard label="Impact" value={result.scores.impact} theme={theme} />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={14} />
                                Health Report
                              </h3>
                              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-4 rounded-2xl border space-y-4 transition-colors`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-zinc-500">Prompt Strength</span>
                                  <span className={`text-lg font-bold ${result.healthReport.strength > 80 ? 'text-fuchsia-400' : 'text-amber-400'}`}>
                                    {result.healthReport.strength}%
                                  </span>
                                </div>
                                
                                <div className="space-y-2">
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Weak Areas</p>
                                  {result.healthReport.weakAreas.map((area, i) => (
                                    <div key={i} className={`flex items-center gap-2 text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
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
                                <GenomeCard label="Disruption" value={result.genome.disruption} theme={theme} />
                                <GenomeCard label="Complexity" value={result.genome.complexity} theme={theme} />
                                <GenomeCard label="Market Size" value={result.genome.marketSize} theme={theme} />
                                <GenomeCard label="Difficulty" value={result.genome.difficulty} theme={theme} />
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
                                  <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-4 rounded-xl border flex items-center justify-between transition-colors`}>
                                    <div>
                                      <p className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-800'}`}>{sector.sector}</p>
                                      <p className="text-[10px] text-zinc-500">{sector.reason}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs font-bold text-fuchsia-400">{sector.opportunityScore}/100</p>
                                      <p className="text-[8px] font-bold text-zinc-500 uppercase">Opportunity</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Pattern Analysis */}
                          {result.patternAnalysis && (
                            <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5 shadow-xl'} rounded-2xl p-6 border transition-colors`}>
                              <div className="flex items-center gap-2 mb-4">
                                <Compass className="text-fuchsia-400" size={18} />
                                <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-800'} uppercase tracking-wider`}>Pattern Detection & Creativity Shift</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Your Style</p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>{result.patternAnalysis.style}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Hidden Creativity</p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>{result.patternAnalysis.hiddenCreativity}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Suggested Shift</p>
                                  <p className="text-xs text-fuchsia-400 font-medium">{result.patternAnalysis.suggestedShift}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Refined Prompt Card */}
                          <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-xl'} rounded-2xl overflow-hidden transition-colors border`}>
                            <div className={`${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-zinc-50 border-black/5'} p-4 flex items-center justify-between border-b transition-colors`}>
                              <div className="flex items-center gap-2">
                                <Layers className="text-purple-400" size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Quantum Refined Output</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => setShowShareModal(true)}
                                  className={`flex items-center gap-1.5 text-xs font-medium ${theme === 'dark' ? 'text-zinc-500 hover:text-fuchsia-400' : 'text-zinc-500 hover:text-indigo-600'} transition-colors`}
                                >
                                  <Share2 size={14} />
                                  Share
                                </button>
                                <button
                                  onClick={handleCopy}
                                  className={`flex items-center gap-1.5 text-xs font-medium ${theme === 'dark' ? 'text-white hover:text-indigo-400' : 'text-zinc-800 hover:text-indigo-600'} transition-colors`}
                                >
                                  {copied ? <Check size={14} /> : <Copy size={14} />}
                                  {copied ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                            </div>
                            <div className="p-6">
                              <pre className={`text-sm leading-relaxed whitespace-pre-wrap font-mono ${theme === 'dark' ? 'text-zinc-300 bg-zinc-800/50 border-white/5' : 'text-zinc-700 bg-zinc-50 border-black/5'} p-4 rounded-xl border transition-colors`}>
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
                                <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-2xl border md:col-span-2 grid grid-cols-2 gap-4 transition-colors`}>
                                  <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Revenue Model</p>
                                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{result.businessIntel.revenueModel}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Pricing</p>
                                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{result.businessIntel.pricing}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Marketing Strategy</p>
                                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{result.businessIntel.marketingStrategy}</p>
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
                                <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 shadow-sm hover:border-indigo-100'} p-4 rounded-xl border transition-colors`}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-6 h-6 ${theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-50'} rounded-full flex items-center justify-center transition-colors`}>
                                      <BrainCircuit size={12} className="text-indigo-600" />
                                    </div>
                                    <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-900'} uppercase`}>{opinion.expert}</span>
                                  </div>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} leading-relaxed`}>{opinion.insight}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'builder' && (
                        <div className="space-y-8">
                          {/* AI Code Review Section */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <Bug size={14} />
                              Quantum Code Architect (Review)
                            </h3>
                            <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-3xl border space-y-4 transition-colors`}>
                              <div className="space-y-2">
                                <label htmlFor="code-review-input" className="text-[10px] font-bold text-zinc-400 uppercase">Paste Code Snippet</label>
                                <textarea
                                  id="code-review-input"
                                  value={codeToReview}
                                  onChange={(e) => setCodeToReview(e.target.value)}
                                  placeholder="Paste your code here for a quantum-level review..."
                                  aria-label="Code snippet for review"
                                  className={`w-full h-32 p-4 ${theme === 'dark' ? 'bg-zinc-950 border-white/10 text-zinc-300' : 'bg-zinc-50 border-black/5 text-zinc-900'} border rounded-2xl text-xs font-mono focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 outline-none transition-all`}
                                />
                              </div>
                              <button
                                onClick={handleCodeReview}
                                disabled={isReviewing || !codeToReview}
                                aria-busy={isReviewing}
                                aria-label={isReviewing ? "Analyzing code" : "Run quantum code review"}
                                className={`w-full py-3 ${theme === 'dark' ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-black'} rounded-2xl text-xs font-bold transition-all disabled:opacity-50 focus:ring-2 focus:ring-purple-500/40 outline-none flex items-center justify-center gap-2`}
                              >
                                {isReviewing ? (
                                  <>
                                    <RotateCcw className="animate-spin" size={14} />
                                    Analyzing Code...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles size={14} />
                                    Run Quantum Review
                                  </>
                                )}
                              </button>

                              {codeReviewResult && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  role="region"
                                  aria-label="Code Review Results"
                                  className="mt-6 space-y-6 pt-6 border-t border-black/5"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Overall Quality Score</p>
                                      <div className="flex items-center gap-2">
                                        <div className="h-2 w-32 bg-zinc-100 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full transition-all duration-1000 ${
                                              codeReviewResult.overallScore > 80 ? 'bg-emerald-500' :
                                              codeReviewResult.overallScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}
                                            style={{ width: `${codeReviewResult.overallScore}%` }}
                                          />
                                        </div>
                                        <span className="text-sm font-bold text-zinc-800">{codeReviewResult.overallScore}/100</span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Status</p>
                                      <p className={`text-xs font-bold ${
                                        codeReviewResult.overallScore > 80 ? 'text-emerald-600' :
                                        codeReviewResult.overallScore > 50 ? 'text-amber-600' : 'text-rose-600'
                                      }`}>
                                        {codeReviewResult.overallScore > 80 ? 'Production Ready' :
                                         codeReviewResult.overallScore > 50 ? 'Needs Refinement' : 'Critical Issues'}
                                      </p>
                                    </div>
                                  </div>

                                <div className={`${theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'} p-4 rounded-2xl border`}>
                                  <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} uppercase mb-1`}>Architect's Summary</p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-900'} leading-relaxed`}>{codeReviewResult.summary}</p>
                                </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <p className="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-2">
                                        <ShieldAlert size={12} />
                                        Bugs & Vulnerabilities
                                      </p>
                                      <div className="space-y-2">
                                        {codeReviewResult.bugs.length > 0 ? codeReviewResult.bugs.map((bug, i) => (
                                          <div key={i} className={`p-3 ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100'} border rounded-xl space-y-1`}>
                                            <div className="flex items-center justify-between">
                                              <span className={`text-[8px] font-bold ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'} uppercase`}>Line {bug.line}</span>
                                              <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                                                bug.severity === 'high' ? 'bg-rose-600 text-white' :
                                                bug.severity === 'medium' ? 'bg-amber-500 text-white' : 'bg-zinc-400 text-white'
                                              }`}>{bug.severity}</span>
                                            </div>
                                            <p className={`text-[10px] ${theme === 'dark' ? 'text-rose-200' : 'text-rose-900'}`}>{bug.issue}</p>
                                          </div>
                                        )) : (
                                          <p className="text-[10px] text-zinc-400 italic">No critical bugs detected.</p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="space-y-6">
                                      <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-2">
                                          <Zap size={12} />
                                          Optimizations
                                        </p>
                                        <ul className="space-y-2">
                                          {codeReviewResult.optimizations.map((opt, i) => (
                                            <li key={i} className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} flex items-start gap-2`}>
                                              <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                                              {opt}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-2">
                                          <Check size={12} />
                                          Best Practices
                                        </p>
                                        <ul className="space-y-2">
                                          {codeReviewResult.bestPractices.map((bp, i) => (
                                            <li key={i} className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} flex items-start gap-2`}>
                                              <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                                              {bp}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>

                          {/* Autonomous Builder Mode */}
                          {result.builder && (
                            <div className="space-y-6">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Hammer size={14} />
                                Autonomous Builder Output
                              </h3>
                              <div className="grid grid-cols-1 gap-6">
                                <BuilderCard label="Landing Page Concept" content={result.builder.landingPage} icon={<Monitor size={16} />} theme={theme} />
                                <BuilderCard label="App Interface Design" content={result.builder.appInterface} icon={<Layout size={16} />} theme={theme} />
                                <BuilderCard label="Product Roadmap" content={result.builder.roadmap} icon={<TrendingUp size={16} />} theme={theme} />
                                <BuilderCard label="Marketing Funnel" content={result.builder.marketingFunnel} icon={<Target size={16} />} theme={theme} />
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
                              
                              {/* Competitor SWOT Analysis */}
                              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-2xl border space-y-6 transition-colors`}>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Competitor SWOT Analysis</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {result.marketResearch.competitors.map((comp, idx) => (
                                    <div 
                                      key={idx} 
                                      tabIndex={0}
                                      className={`space-y-4 p-5 rounded-2xl ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-zinc-50 border-zinc-100/50'} border hover:border-indigo-200 focus:ring-2 focus:ring-purple-500/40 outline-none transition-colors group`}
                                    >
                                      <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'} flex items-center gap-2`}>
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
                                        {comp.name}
                                      </h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Strengths</p>
                                          <ul className="space-y-1">
                                            {comp.swot.strengths.map((s, i) => (
                                              <li key={i} className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} leading-tight flex gap-1`}>
                                                <span className="text-emerald-400">•</span> {s}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div className="space-y-2">
                                          <p className="text-[9px] font-bold text-rose-600 uppercase tracking-tighter">Weaknesses</p>
                                          <ul className="space-y-1">
                                            {comp.swot.weaknesses.map((w, i) => (
                                              <li key={i} className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} leading-tight flex gap-1`}>
                                                <span className="text-rose-400">•</span> {w}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div className="space-y-2">
                                          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">Opportunities</p>
                                          <ul className="space-y-1">
                                            {comp.swot.opportunities.map((o, i) => (
                                              <li key={i} className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} leading-tight flex gap-1`}>
                                                <span className="text-blue-400">•</span> {o}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div className="space-y-2">
                                          <p className="text-[9px] font-bold text-amber-600 uppercase tracking-tighter">Threats</p>
                                          <ul className="space-y-1">
                                            {comp.swot.threats.map((t, i) => (
                                              <li key={i} className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} leading-tight flex gap-1`}>
                                                <span className="text-amber-400">•</span> {t}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-4 rounded-2xl border space-y-3 transition-colors`}>
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pricing Trends</p>
                                  <ul className="space-y-2">
                                    {result.marketResearch.pricingTrends.map((p, i) => (
                                      <li key={i} className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} flex items-center gap-2`}>
                                        <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                                        {p}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-4 rounded-2xl border space-y-3 transition-colors`}>
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Future Trends</p>
                                  <ul className="space-y-2">
                                    {result.marketResearch.futureTrends.map((t, i) => (
                                      <li key={i} className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} flex items-center gap-2`}>
                                        <div className="w-1 h-1 bg-amber-400 rounded-full" />
                                        {t}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-4 rounded-2xl border space-y-3 transition-colors`}>
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Market Size</p>
                                  <div className="flex items-baseline gap-2">
                                    <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{result.marketResearch.marketSize}</span>
                                  </div>
                                  <p className="text-[10px] text-zinc-400 italic">Estimated Total Addressable Market (TAM)</p>
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
                              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} rounded-2xl p-6 border transition-colors`}>
                                <div className="mb-4">
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Core Idea</p>
                                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>{result.ecosystem.core}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {result.ecosystem.components.map((comp, i) => (
                                    <div key={i} className={`p-3 ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-zinc-50 border-black/5'} rounded-xl border transition-colors`}>
                                      <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{comp.type}</p>
                                      <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{comp.description}</p>
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
                                <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-2xl border text-center transition-colors`}>
                                  <Users className="mx-auto text-indigo-500 mb-2" size={24} />
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Simulated Users</p>
                                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{result.digitalTwin.simulatedUsers.toLocaleString()}</p>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-2xl border text-center transition-colors`}>
                                  <Activity className="mx-auto text-emerald-500 mb-2" size={24} />
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Retention Rate</p>
                                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{result.digitalTwin.retentionRate}%</p>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-2xl border text-center transition-colors`}>
                                  <DollarSign className="mx-auto text-amber-500 mb-2" size={24} />
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Revenue Projection</p>
                                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{result.digitalTwin.revenueProjection}</p>
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
                                <div key={i} className={`p-3 rounded-xl border transition-colors ${
                                  theme === 'dark' ? (
                                    sim.type === 'Success' ? 'bg-emerald-900/20 border-emerald-800/50' :
                                    sim.type === 'Failure' ? 'bg-rose-900/20 border-rose-800/50' :
                                    sim.type === 'Viral' ? 'bg-indigo-900/20 border-indigo-800/50' :
                                    sim.type === 'Competitor' ? 'bg-amber-900/20 border-amber-800/50' :
                                    sim.type === 'Saturation' ? 'bg-zinc-800/50 border-zinc-700/50' :
                                    'bg-violet-900/20 border-violet-800/50'
                                  ) : (
                                    sim.type === 'Success' ? 'bg-emerald-50 border-emerald-100' :
                                    sim.type === 'Failure' ? 'bg-rose-50 border-rose-100' :
                                    sim.type === 'Viral' ? 'bg-indigo-50 border-indigo-100' :
                                    sim.type === 'Competitor' ? 'bg-amber-50 border-amber-100' :
                                    sim.type === 'Saturation' ? 'bg-zinc-50 border-zinc-200' :
                                    'bg-violet-50 border-violet-100'
                                  )
                                }`}>
                                  <span className={`text-[8px] font-bold uppercase tracking-widest mb-1 block ${
                                    sim.type === 'Success' ? 'text-emerald-600' :
                                    sim.type === 'Failure' ? 'text-rose-600' :
                                    sim.type === 'Viral' ? 'text-indigo-600' :
                                    sim.type === 'Competitor' ? 'text-amber-600' :
                                    sim.type === 'Saturation' ? 'text-zinc-600' :
                                    'text-violet-600'
                                  }`}>{sim.type}</span>
                                  <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'} leading-tight`}>{sim.prediction}</p>
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
                                <TimeCard label="Past (Why it failed)" content={result.timeMachine.past} color="rose" theme={theme} />
                                <TimeCard label="Present (Opportunity)" content={result.timeMachine.present} color="emerald" theme={theme} />
                                <TimeCard label="Future (10-Year Evolution)" content={result.timeMachine.future} color="indigo" theme={theme} />
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
                                  <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} rounded-2xl p-4 border space-y-3 transition-colors`}>
                                    <div className="flex items-start gap-3">
                                      <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <Users size={16} className="text-zinc-500" />
                                      </div>
                                      <div className={`${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'} p-3 rounded-2xl rounded-tl-none`}>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">{neg.persona}</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>"{neg.concern}"</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-3 justify-end">
                                      <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none text-white max-w-[80%]">
                                        <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Suggested Response</p>
                                        <p className="text-xs">{neg.suggestedResponse}</p>
                                      </div>
                                      <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <Zap size={16} className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
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
                                  <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-4 rounded-2xl border space-y-2 transition-colors`}>
                                    <div className="flex items-center justify-between">
                                      <p className="text-[10px] font-bold text-indigo-600 uppercase">Experiment 0{i+1}</p>
                                      <span className={`px-2 py-0.5 ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'} text-[8px] font-bold rounded-full uppercase`}>Active</span>
                                    </div>
                                    <p className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{exp.experiment}</p>
                                    <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'} italic`}>Hypothesis: {exp.hypothesis}</p>
                                    <div className={`pt-2 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
                                      <p className="text-[9px] font-bold text-zinc-400 uppercase">Projected Outcome</p>
                                      <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{exp.projectedOutcome}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'architect' && result.strategicBlueprint && (
                        <div className="space-y-12">
                          {/* Design System */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <LayoutGrid size={14} />
                              Design System & Philosophy
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-3xl border space-y-3 transition-colors`}>
                                <p className="text-[10px] font-bold text-indigo-600 uppercase">Philosophy</p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-700'} leading-relaxed`}>{result.strategicBlueprint.designSystem.philosophy}</p>
                              </div>
                              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-3xl border space-y-3 transition-colors`}>
                                <p className="text-[10px] font-bold text-violet-600 uppercase">Visual Direction</p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-700'} leading-relaxed`}>{result.strategicBlueprint.designSystem.visualDirection}</p>
                              </div>
                              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-3xl border space-y-3 transition-colors`}>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase">Core Components</p>
                                <div className="flex flex-wrap gap-2">
                                  {result.strategicBlueprint.designSystem.coreComponents.map((comp, i) => (
                                    <span key={i} className={`px-2 py-1 ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} text-[9px] font-bold rounded-lg border uppercase transition-colors`}>
                                      {comp}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Detailed Outline */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <FileText size={14} />
                              Multi-Phase Project Outline
                            </h3>
                            <div className="space-y-4">
                              {result.strategicBlueprint.detailedOutline.map((phase, i) => (
                                <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-zinc-50 border-black/5'} p-6 rounded-3xl border space-y-4 transition-colors`}>
                                  <div className="flex items-center justify-between">
                                    <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{phase.phase}</h4>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Phase 0{i+1}</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-bold text-indigo-600 uppercase">Objectives</p>
                                      <ul className="space-y-1">
                                        {phase.objectives.map((obj, j) => (
                                          <li key={j} className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} flex items-start gap-2`}>
                                            <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                                            {obj}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-bold text-violet-600 uppercase">Deliverables</p>
                                      <ul className="space-y-1">
                                        {phase.deliverables.map((del, j) => (
                                          <li key={j} className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} flex items-start gap-2`}>
                                            <div className="w-1 h-1 bg-violet-400 rounded-full mt-1.5 flex-shrink-0" />
                                            {del}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Predictive Milestones */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <TrendingUp size={14} />
                              Predictive Future Milestones
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {result.strategicBlueprint.predictiveMilestones.map((ms, i) => (
                                <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-5 rounded-3xl border space-y-3 relative overflow-hidden transition-colors`}>
                                  <div className="absolute top-0 right-0 p-2">
                                    <div className={`text-[10px] font-bold ${theme === 'dark' ? 'text-emerald-400 bg-emerald-900/30 border-emerald-800/50' : 'text-emerald-600 bg-emerald-50 border-emerald-100'} px-2 py-0.5 rounded-full border transition-colors`}>
                                      {ms.probability}% Prob.
                                    </div>
                                  </div>
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{ms.timeframe}</p>
                                  <p className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{ms.event}</p>
                                  <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} leading-relaxed`}>{ms.impact}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Setup Path */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <Compass size={14} />
                              Execution & Setup Path
                            </h3>
                            <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} rounded-3xl border overflow-hidden transition-colors`}>
                              <table className="w-full text-left border-collapse">
                                <thead className={`${theme === 'dark' ? 'bg-zinc-800 border-white/5' : 'bg-zinc-50 border-black/5'} border-b transition-colors`}>
                                  <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Step</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Action</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tool/Platform</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Expected Result</th>
                                  </tr>
                                </thead>
                                <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-black/5'}`}>
                                  {result.strategicBlueprint.setupPath.map((step, i) => (
                                    <tr key={i} className={`${theme === 'dark' ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50/50'} transition-colors`}>
                                      <td className="px-6 py-4">
                                        <span className={`w-6 h-6 ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'} rounded-full flex items-center justify-center text-[10px] font-bold transition-colors`}>
                                          {step.step}
                                        </span>
                                      </td>
                                      <td className={`px-6 py-4 text-xs font-medium ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{step.action}</td>
                                      <td className="px-6 py-4">
                                        <span className={`px-2 py-1 ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400 border-white/5' : 'bg-zinc-100 text-zinc-600 border-black/5'} text-[9px] font-bold rounded-lg border uppercase transition-colors`}>
                                          {step.tool}
                                        </span>
                                      </td>
                                      <td className={`px-6 py-4 text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>{step.expectedResult}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'future' && (
                        <div className="space-y-8">
                          {/* Neural Synthesis */}
                          {result.neuralSynthesis && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <BrainCircuit size={14} />
                                Neural Synthesis (10-Brain Fusion)
                              </h3>
                              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5 shadow-2xl'} p-6 rounded-3xl border relative overflow-hidden transition-colors`}>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                  <Dna size={80} className={theme === 'dark' ? 'text-white' : 'text-zinc-800'} />
                                </div>
                                <div className="relative z-10 space-y-4">
                                  <div className="flex flex-wrap gap-2">
                                    {result.neuralSynthesis.figures.map((figure, i) => (
                                      <span key={i} className={`px-3 py-1 ${theme === 'dark' ? 'bg-white/10 border-white/5 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-600'} rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors`}>
                                        {figure}
                                      </span>
                                    ))}
                                  </div>
                                  <p className={`text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'} leading-relaxed italic`}>
                                    "{result.neuralSynthesis.combinedInsight}"
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Quantum Entanglement */}
                          {result.entanglement && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Network size={14} />
                                Quantum Entanglement Predictor
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {result.entanglement.map((ent, i) => (
                                  <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-4 rounded-2xl border space-y-2 transition-colors`}>
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{ent.trend}</p>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-700'}`}>{ent.impact}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sentience Path */}
                            {result.sentiencePath && (
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                  <Zap size={14} />
                                  Sentience Roadmap
                                </h3>
                                <div className={`${theme === 'dark' ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm'} p-6 rounded-3xl border transition-colors`}>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} leading-relaxed`}>{result.sentiencePath}</p>
                                </div>
                              </div>
                            )}

                            {/* Butterfly Effect */}
                            {result.butterflyEffect && (
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                  <Globe size={14} />
                                  Butterfly Effect Simulation
                                </h3>
                                <div className={`${theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm'} p-6 rounded-3xl border transition-colors`}>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-900'} leading-relaxed`}>{result.butterflyEffect}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Ethical Paradox */}
                          {result.ethicalParadox && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldAlert size={14} />
                                Ethical Paradox Solver
                              </h3>
                              <div className={`${theme === 'dark' ? 'bg-rose-900/20 border-rose-500/30' : 'bg-rose-50 border-rose-100 shadow-sm'} p-6 rounded-3xl border space-y-3 transition-colors`}>
                                <div className="space-y-1">
                                  <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'} uppercase`}>The Paradox</p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-rose-200' : 'text-rose-900'} font-medium`}>{result.ethicalParadox.dilemma}</p>
                                </div>
                                <div className={`space-y-1 pt-3 border-t ${theme === 'dark' ? 'border-rose-500/30' : 'border-rose-200'}`}>
                                  <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} uppercase`}>Quantum Solution</p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-emerald-200' : 'text-emerald-900'} font-medium`}>{result.ethicalParadox.solution}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Synthetic Focus Group */}
                          {result.syntheticFocusGroup && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Users size={14} />
                                Synthetic Focus Group (AI Personas)
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {result.syntheticFocusGroup.map((persona, i) => (
                                  <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-4 rounded-2xl border space-y-2 transition-colors`}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'} rounded-full flex items-center justify-center transition-colors`}>
                                        <Users size={12} className="text-zinc-500" />
                                      </div>
                                      <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-800'} uppercase`}>{persona.persona}</p>
                                    </div>
                                    <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'} italic`}>"{persona.feedback}"</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Post-Scarcity Adaptation */}
                          {result.postScarcityAdaptation && (
                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <InfinityIcon size={14} />
                                Post-Scarcity Adaptation
                              </h3>
                              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-zinc-900 border-black/5 shadow-2xl'} p-8 rounded-3xl text-white text-center space-y-4 border transition-colors`}>
                                <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-white/10' : 'bg-white/10'} rounded-full mx-auto flex items-center justify-center`}>
                                  <InfinityIcon size={24} className="text-indigo-400" />
                                </div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-300'} max-w-2xl mx-auto leading-relaxed`}>
                                  {result.postScarcityAdaptation}
                                </p>
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
                              aria-label="Open social media share options"
                              className="w-full py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all flex items-center justify-center gap-2"
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
                            <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} rounded-2xl border overflow-hidden transition-colors`}>
                              {[
                                { rank: 1, name: "Neural Sleep Learning", score: 98, user: "Alex_AI" },
                                { rank: 2, name: "Carbon Capture DAO", score: 95, user: "EcoTech" },
                                { rank: 3, name: "Emotion-Based Gaming", score: 92, user: "GameMaster" }
                              ].map((item, i) => (
                                <div 
                                  key={i} 
                                  tabIndex={0}
                                  role="listitem"
                                  className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-white/5 hover:bg-zinc-800/50' : 'border-black/5 hover:bg-zinc-50'} last:border-0 focus:ring-2 focus:ring-purple-500/40 outline-none transition-colors`}
                                >
                                  <div className="flex items-center gap-4">
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${i === 0 ? 'bg-amber-100 text-amber-600' : (theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500')}`}>
                                      {item.rank}
                                    </span>
                                    <div>
                                      <p className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{item.name}</p>
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
                          <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5 shadow-xl'} rounded-2xl p-6 border relative overflow-hidden transition-colors`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Sword size={64} className={theme === 'dark' ? 'text-white' : 'text-zinc-800'} />
                            </div>
                            <div className="relative z-10 space-y-4">
                              <div className="flex items-center gap-2">
                                <Star className="text-amber-400" size={18} />
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Weekly Challenge</h3>
                              </div>
                              <div>
                                <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>The Great Decarbonization</h4>
                                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} mt-1`}>Invent a scalable AI system to remove 1 gigaton of CO2 by 2030.</p>
                              </div>
                              <div className={`flex items-center justify-between pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                                <div className="flex items-center gap-2">
                                  <Users size={14} className="text-zinc-500" />
                                  <span className="text-[10px] font-bold text-zinc-500">1,240 Participants</span>
                                </div>
                                <button 
                                  aria-label="Join Weekly Challenge"
                                  className={`px-4 py-2 ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'} rounded-lg text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-purple-500/40 outline-none transition-colors`}
                                >
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
                                <div 
                                  key={i} 
                                  tabIndex={0}
                                  role="button"
                                  aria-label={`View ${item.title} in gallery`}
                                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer focus:ring-2 focus:ring-purple-500/40 outline-none"
                                >
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

                      {activeTab === 'launchpad' && (
                        <div className="space-y-8">
                          {!result?.fullStackBlueprint ? (
                            <div className="max-w-2xl mx-auto space-y-8 py-12">
                              <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-purple-500/20">
                                  <Rocket className="text-white" size={40} />
                                </div>
                                <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>Full Stack Launchpad</h2>
                                <p className={`${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Transform your idea into a production-ready application blueprint.</p>
                              </div>

                              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-8 rounded-3xl border space-y-6 transition-colors`}>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your App Idea</label>
                                  <textarea 
                                    value={blueprintIdea}
                                    onChange={(e) => setBlueprintIdea(e.target.value)}
                                    placeholder="e.g., A decentralized platform for peer-to-peer energy trading using IoT sensors..."
                                    className={`w-full ${theme === 'dark' ? 'bg-zinc-800/50 border-white/10 text-zinc-100 placeholder-zinc-600' : 'bg-zinc-50 border-black/5 text-zinc-900 placeholder-zinc-400'} rounded-2xl p-4 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none transition-all min-h-[120px] resize-none border`}
                                  />
                                </div>
                                <button
                                  onClick={handleGenerateBlueprint}
                                  disabled={isGeneratingBlueprint || !blueprintIdea}
                                  aria-busy={isGeneratingBlueprint}
                                  aria-label={isGeneratingBlueprint ? "Generating blueprint" : "Generate full-stack blueprint"}
                                  className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-sm hover:bg-purple-700 focus:ring-2 focus:ring-purple-500/40 outline-none transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                  {isGeneratingBlueprint ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                      Generating Blueprint...
                                    </>
                                  ) : (
                                    <>
                                      <Zap size={18} />
                                      Initialize Launch Sequence
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                  { icon: Shield, title: "Secure by Design", desc: "Zod, Rate Limiting, CSRF" },
                                  { icon: TrendingUp, title: "Viral Engine", desc: "Referrals & Social Loops" },
                                  { icon: DollarSign, title: "Monetized", desc: "Pricing Tiers & Upsells" }
                                ].map((feature, i) => (
                                  <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-zinc-50 border-black/5 shadow-sm'} p-4 rounded-2xl border text-center space-y-1 transition-colors`}>
                                    <feature.icon className="mx-auto text-purple-400 mb-2" size={20} />
                                    <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{feature.title}</p>
                                    <p className="text-[9px] text-zinc-500">{feature.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-12">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <Rocket className="text-white" size={24} />
                                  </div>
                                  <div>
                                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{result.fullStackBlueprint.concept.name}</h3>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Full Stack Launchpad</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      const text = JSON.stringify(result.fullStackBlueprint, null, 2);
                                      navigator.clipboard.writeText(text);
                                      showNotification("Full Blueprint JSON copied!", "success");
                                    }}
                                    className={`${theme === 'dark' ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'} px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2`}
                                  >
                                    <Copy size={14} />
                                    Copy JSON
                                  </button>
                                  <button 
                                    onClick={() => setResult(null)}
                                    className={`px-4 py-2 ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-zinc-400 hover:bg-zinc-800' : 'bg-zinc-100 border-black/5 text-zinc-600 hover:bg-zinc-200'} rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border`}
                                  >
                                    New Blueprint
                                  </button>
                                </div>
                              </div>
                                                             {/* App Concept */}
                              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-8 rounded-3xl border shadow-sm space-y-6 transition-colors duration-300`}>
                                <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} leading-relaxed`}>{result.fullStackBlueprint.concept.description}</p>
                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Audience</p>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'} font-medium`}>{result.fullStackBlueprint.concept.targetAudience}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Monetization Strategy</p>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'} font-medium`}>{result.fullStackBlueprint.concept.monetizationStrategy}</p>
                                  </div>
                                </div>
                                <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} space-y-3`}>
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">AI-Driven Enhancements</p>
                                  <div className="flex flex-wrap gap-2">
                                    {result.fullStackBlueprint.concept.aiEnhancements.map((enhancement, i) => (
                                      <span key={i} className="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md border border-purple-500/20">{enhancement}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Core Features */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                  <Star size={14} />
                                  Core Features
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {result.fullStackBlueprint.coreFeatures.map((feature, i) => (
                                    <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-4 rounded-2xl border ${feature.futuristic ? 'border-purple-500/30' : ''} shadow-sm space-y-2 transition-colors duration-300`}>
                                      <div className="flex items-center justify-between">
                                        <p className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{feature.title}</p>
                                        {feature.futuristic && <Sparkles size={12} className="text-purple-400" />}
                                      </div>
                                      <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'} leading-relaxed`}>{feature.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Tech Stack */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                  <Cpu size={14} />
                                  Full Tech Stack
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-6 rounded-2xl border space-y-4 transition-colors duration-300`}>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Frontend</p>
                                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{result.fullStackBlueprint.techStack.frontend.framework}</p>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {result.fullStackBlueprint.techStack.frontend.libraries.map((lib, i) => (
                                          <span key={i} className={`${theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'} text-[8px] px-1.5 py-0.5 rounded`}>{lib}</span>
                                        ))}
                                      </div>
                                      <p className="text-[10px] text-zinc-500 mt-2">{result.fullStackBlueprint.techStack.frontend.reason}</p>
                                    </div>
                                  </div>
                                  <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-6 rounded-2xl border space-y-4 transition-colors duration-300`}>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">Backend</p>
                                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{result.fullStackBlueprint.techStack.backend.framework}</p>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {result.fullStackBlueprint.techStack.backend.apis.map((api, i) => (
                                          <span key={i} className={`${theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'} text-[8px] px-1.5 py-0.5 rounded`}>{api}</span>
                                        ))}
                                      </div>
                                      <p className="text-[10px] text-zinc-500 mt-2">{result.fullStackBlueprint.techStack.backend.reason}</p>
                                    </div>
                                  </div>
                                  <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-6 rounded-2xl border space-y-4 transition-colors duration-300`}>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Database</p>
                                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{result.fullStackBlueprint.techStack.database.type}</p>
                                      <p className="text-[10px] text-zinc-500 mt-2">{result.fullStackBlueprint.techStack.database.reason}</p>
                                    </div>
                                  </div>
                                  <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-6 rounded-2xl border space-y-4 transition-colors duration-300`}>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Cloud & DevOps</p>
                                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{result.fullStackBlueprint.techStack.cloudDevOps.provider}</p>
                                      <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'} font-medium mt-1`}>{result.fullStackBlueprint.techStack.cloudDevOps.strategy}</p>
                                      <p className="text-[10px] text-zinc-500 mt-2">{result.fullStackBlueprint.techStack.cloudDevOps.reason}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Security Blueprint */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                  <Shield size={14} />
                                  Security Blueprint
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {[
                                    { label: 'Input Validation', content: result.fullStackBlueprint.security.inputValidation, icon: CheckCircle },
                                    { label: 'Rate Limiting', content: result.fullStackBlueprint.security.rateLimiting, icon: Activity },
                                    { label: 'CSRF/XSS Prevention', content: result.fullStackBlueprint.security.csrfXss, icon: ShieldAlert },
                                    { label: 'API Key Management', content: result.fullStackBlueprint.security.apiKeyManagement, icon: Key },
                                    { label: 'Threat Detection', content: result.fullStackBlueprint.security.threatDetection, icon: Eye },
                                    { label: 'Deployment Security', content: result.fullStackBlueprint.security.deploymentSecurity, icon: Lock }
                                  ].map((s, i) => (
                                    <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-4 rounded-2xl border space-y-2 transition-colors duration-300`}>
                                      <div className="flex items-center gap-2">
                                        <s.icon size={12} className="text-purple-400" />
                                        <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} uppercase tracking-widest`}>{s.label}</p>
                                      </div>
                                      <p className="text-[10px] text-zinc-500 leading-relaxed">{s.content}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Build Prompts */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                  <Hammer size={14} />
                                  Autonomous Builder Prompts
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {[
                                    { label: 'Frontend UI', content: result.fullStackBlueprint.buildPrompts.frontend, icon: Layout },
                                    { label: 'Backend Logic', content: result.fullStackBlueprint.buildPrompts.backend, icon: Cpu },
                                    { label: 'Database Schema', content: result.fullStackBlueprint.buildPrompts.database, icon: Layers },
                                    { label: 'Deployment Setup', content: result.fullStackBlueprint.buildPrompts.deployment, icon: Globe }
                                  ].map((p, i) => (
                                    <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-6 rounded-2xl border shadow-sm space-y-4 group transition-colors duration-300`}>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{p.label}</p>
                                        </div>
                                        <button 
                                          onClick={() => {
                                            navigator.clipboard.writeText(p.content);
                                            showNotification(`${p.label} prompt copied!`);
                                          }}
                                          className={`${theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'} p-2 rounded-lg transition-colors`}
                                        >
                                          <Copy size={12} className="text-zinc-500" />
                                        </button>
                                      </div>
                                      <div className={`${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-zinc-50 border-black/5'} p-4 rounded-xl border text-[10px] font-mono text-zinc-400 line-clamp-6 leading-relaxed transition-colors`}>
                                        {p.content}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Quantum Analysis */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                  <Zap size={14} />
                                  Quantum Analysis
                                </h3>
                                <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-8 rounded-3xl border space-y-8 transition-colors duration-300`}>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <ScoreCard label="Clarity" value={result.fullStackBlueprint.quantumAnalysis.scores.clarity} theme={theme} />
                                    <ScoreCard label="Originality" value={result.fullStackBlueprint.quantumAnalysis.scores.originality} theme={theme} />
                                    <ScoreCard label="Impact" value={result.fullStackBlueprint.quantumAnalysis.scores.impact} theme={theme} />
                                  </div>
                                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                                    <div className="space-y-4">
                                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Weak Areas</p>
                                      <ul className="space-y-2">
                                        {result.fullStackBlueprint.quantumAnalysis.weakAreas.map((area, i) => (
                                          <li key={i} className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} flex items-start gap-2`}>
                                            <div className="w-1 h-1 bg-rose-500 rounded-full mt-1.5" />
                                            {area}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="space-y-4">
                                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Suggested Improvements</p>
                                      <ul className="space-y-2">
                                        {result.fullStackBlueprint.quantumAnalysis.improvements.map((imp, i) => (
                                          <li key={i} className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} flex items-start gap-2`}>
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5" />
                                            {imp}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className={`pt-8 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Market Readiness</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} leading-relaxed`}>{result.fullStackBlueprint.quantumAnalysis.marketReadiness}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Idea Jackpot Spin-offs */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                  <Dices size={14} />
                                  Idea Jackpot Spin-offs
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {result.fullStackBlueprint.ideaJackpotSpinOffs.map((spin, i) => (
                                    <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-6 rounded-2xl border space-y-3 transition-colors duration-300`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[8px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded uppercase font-bold">{spin.tech}</span>
                                        <span className="text-[8px] bg-fuchsia-500/20 text-fuchsia-400 px-1.5 py-0.5 rounded uppercase font-bold">{spin.industry}</span>
                                      </div>
                                      <p className={`text-xs ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} font-medium`}>{spin.idea}</p>
                                      <p className="text-[10px] text-zinc-500 italic">Trigger: {spin.trigger}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Viral Growth & Money Engine */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp size={14} />
                                    Viral Growth System
                                  </h3>
                                  <div className={`${theme === 'dark' ? 'bg-fuchsia-500/10 border-fuchsia-500/20' : 'bg-fuchsia-50 border-fuchsia-200'} p-6 rounded-3xl border space-y-4 transition-colors duration-300`}>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-fuchsia-400 uppercase">Referral System</p>
                                      <p className={`text-xs ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{result.fullStackBlueprint.viralGrowth.referralSystem}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-bold text-fuchsia-400 uppercase">Viral Hooks</p>
                                      <ul className="space-y-1">
                                        {result.fullStackBlueprint.viralGrowth.viralHooks.map((hook, i) => (
                                          <li key={i} className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'} flex items-center gap-2`}>
                                            <div className="w-1 h-1 bg-fuchsia-400 rounded-full" />
                                            {hook}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-fuchsia-400 uppercase">Social Loop</p>
                                      <p className={`text-xs ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{result.fullStackBlueprint.viralGrowth.socialMediaLoop}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    <DollarSign size={14} />
                                    Money Engine
                                  </h3>
                                  <div className={`${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} p-6 rounded-3xl border space-y-6 transition-colors duration-300`}>
                                    <div className="grid grid-cols-1 gap-4">
                                      {result.fullStackBlueprint.moneyEngine.pricingTiers.map((tier, i) => (
                                        <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-black/5'} p-4 rounded-xl border transition-colors`}>
                                          <div className="flex justify-between items-center mb-2">
                                            <p className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{tier.tier}</p>
                                            <p className="text-xs font-bold text-amber-400">{tier.price}</p>
                                          </div>
                                          <ul className="space-y-1">
                                            {tier.features.map((f, j) => (
                                              <li key={j} className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} flex items-center gap-2`}>
                                                <Check size={10} className="text-amber-500" />
                                                {f}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-amber-400 uppercase">Upsells</p>
                                      <div className="flex flex-wrap gap-2">
                                        {result.fullStackBlueprint.moneyEngine.upsells.map((u, i) => (
                                          <span key={i} className={`${theme === 'dark' ? 'bg-amber-500/20 text-amber-200 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200'} text-[9px] px-2 py-1 rounded-md border transition-colors`}>{u}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Future-Proof Enhancements */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                  <FastForward size={14} />
                                  Future-Proof Enhancements
                                </h3>
                                <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-8 rounded-3xl border space-y-6 transition-colors duration-300`}>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Auto-Updates</p>
                                      <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{result.fullStackBlueprint.futureProof.autoUpdates}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">AI Refactoring</p>
                                      <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{result.fullStackBlueprint.futureProof.refactoringSuggestions}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Predictive Analytics</p>
                                      <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{result.fullStackBlueprint.futureProof.predictiveAnalytics}</p>
                                    </div>
                                    {result.fullStackBlueprint.futureProof.blockchainIntegration && (
                                      <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Blockchain/Web3</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{result.fullStackBlueprint.futureProof.blockchainIntegration}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'feedback' && (
                        <div className="space-y-8">
                          <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-8 rounded-3xl border space-y-6 transition-colors duration-300`}>
                            <div className="space-y-2">
                              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'} flex items-center gap-2`}>
                                <MessageSquare className="text-indigo-500" size={24} />
                                Quantum Feedback Portal
                              </h3>
                              <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Help us evolve the Quantum AI OS. Submit your suggestions, report bugs, or share your vision.</p>
                            </div>

                            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label htmlFor="feedback-type" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Feedback Type</label>
                                  <select 
                                    id="feedback-type"
                                    value={feedbackForm.type}
                                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, type: e.target.value }))}
                                    className={`w-full ${theme === 'dark' ? 'bg-zinc-800 border-white/10 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all`}
                                  >
                                    <option value="suggestion">Suggestion</option>
                                    <option value="bug">Bug Report</option>
                                    <option value="vision">Future Vision</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor="feedback-email" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email (Optional)</label>
                                  <input 
                                    id="feedback-email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={feedbackForm.email}
                                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                                    className={`w-full ${theme === 'dark' ? 'bg-zinc-800 border-white/10 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all`}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="feedback-content" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Your Message</label>
                                <textarea 
                                  id="feedback-content"
                                  required
                                  placeholder="Describe your suggestion or bug in detail..."
                                  value={feedbackForm.content}
                                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, content: e.target.value }))}
                                  className={`w-full ${theme === 'dark' ? 'bg-zinc-800 border-white/10 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all h-32 resize-none`}
                                />
                              </div>
                              <button 
                                type="submit"
                                disabled={isSubmittingFeedback}
                                aria-busy={isSubmittingFeedback}
                                aria-label={isSubmittingFeedback ? "Transmitting feedback" : "Transmit feedback"}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                {isSubmittingFeedback ? (
                                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <Send size={18} />
                                    Transmit Feedback
                                  </>
                                )}
                              </button>
                            </form>
                          </div>

                          {/* Feedback Analysis Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <BrainCircuit size={14} />
                                Quantum Feedback Analysis
                              </h3>
                              <button 
                                onClick={handleAnalyzeFeedback}
                                disabled={isAnalyzingFeedback || feedbackList.length === 0}
                                className={`px-4 py-2 ${theme === 'dark' ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'} rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center gap-2`}
                              >
                                {isAnalyzingFeedback ? 'Analyzing...' : 'Analyze All Feedback'}
                              </button>
                            </div>

                            {feedbackList.length > 0 ? (
                              <div className="space-y-4" role="list" aria-label="User Feedback List">
                                {feedbackList[0].analysis && (
                                  <div className={`${theme === 'dark' ? 'bg-indigo-900 border-white/10' : 'bg-indigo-600 border-indigo-500 shadow-2xl'} rounded-3xl p-8 text-white border space-y-4 transition-colors`} role="region" aria-label="Strategic Synthesis">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} rounded-full flex items-center justify-center transition-colors`}>
                                        <Lightbulb size={20} className="text-amber-400" aria-hidden="true" />
                                      </div>
                                      <div>
                                        <h4 className="text-lg font-bold">Strategic Synthesis</h4>
                                        <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-indigo-100'} uppercase tracking-widest`}>AI-Generated Insights</p>
                                      </div>
                                    </div>
                                    <div className="prose prose-invert prose-sm max-w-none">
                                      <p className={`text-zinc-300 leading-relaxed whitespace-pre-wrap ${theme === 'dark' ? 'text-zinc-300' : 'text-white'}`}>{feedbackList[0].analysis}</p>
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 gap-4">
                                  {feedbackList.map((f) => (
                                    <div key={f.id} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5 shadow-sm'} p-5 rounded-2xl border flex items-start gap-4 transition-colors duration-300`} role="listitem">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                          f.type === 'bug' ? (theme === 'dark' ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600') : 
                                          f.type === 'suggestion' ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600') : 
                                          (theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')
                                        }`} aria-hidden="true">
                                        {f.type === 'bug' ? <Bug size={20} /> : <Lightbulb size={20} />}
                                      </div>
                                      <div className="space-y-1 flex-1">
                                        <div className="flex items-center justify-between">
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{f.type}</p>
                                          <p className="text-[10px] text-zinc-400">{new Date(f.timestamp).toLocaleString()}</p>
                                        </div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{f.content}</p>
                                        {f.email && <p className="text-[10px] text-zinc-400">From: {f.email}</p>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              ) : (
                                <div className={`${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-200'} border border-dashed rounded-3xl p-12 text-center space-y-3 transition-colors duration-300`}>
                                  <MessageSquare className="mx-auto text-zinc-400" size={48} />
                                  <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>No feedback collected yet. Be the first to shape the future.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                      {/* Common Footer Sections (History, Experimental, etc.) */}
                      <div className="space-y-8 pt-8 border-t border-black/5">
                        {/* Parallel Universes */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <InfinityIcon size={14} aria-hidden="true" />
                            Parallel Universe Variations
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Parallel Universe Variations">
                            {result.parallelUniverses.map((uni, i) => (
                              <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 shadow-sm hover:border-indigo-200'} p-5 rounded-2xl border transition-all group cursor-pointer duration-300`} role="listitem">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{uni.name}</span>
                                  <ArrowLeftRight size={12} className="text-zinc-300 group-hover:text-indigo-400" aria-hidden="true" />
                                </div>
                                <p className={`text-[11px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} mb-4 leading-relaxed`}>{uni.description}</p>
                                <div className={`${theme === 'dark' ? 'bg-black/20 border-white/5 text-zinc-500' : 'bg-zinc-50 border-black/5 text-zinc-600'} p-3 rounded-lg border text-[10px] font-mono line-clamp-3 transition-colors`}>
                                  {uni.prompt}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Self Improvement Section */}
                        <div className={`${theme === 'dark' ? 'bg-violet-900/20 border-violet-500/20' : 'bg-violet-50 border-violet-100'} rounded-2xl p-6 border transition-colors duration-300`}>
                          <div className="flex items-center gap-2 mb-3">
                            <InfinityIcon className="text-violet-600" size={18} />
                            <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-violet-300' : 'text-violet-900'} uppercase tracking-wider`}>Self-Improving Evolution</h3>
                          </div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-violet-200/70 bg-black/20 border-violet-500/20' : 'text-violet-800/80 bg-white/50 border-violet-200/50'} leading-relaxed font-mono p-3 rounded-lg border transition-colors`}>
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
                              <div key={i} className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-indigo-500/50' : 'bg-white border-black/5 text-zinc-600 hover:border-indigo-200'} p-4 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer group`}>
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
                        <div className={`${theme === 'dark' ? 'bg-indigo-900/40 border-indigo-500/20' : 'bg-indigo-900 shadow-indigo-200'} rounded-2xl p-6 text-white border transition-all duration-300`}>
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="text-indigo-300" size={18} />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Never Tried Before Discovery</h3>
                          </div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-100'} leading-relaxed italic`}>
                            "{result.neverTriedBefore}"
                          </p>
                        </div>

                        {/* Suggested Next */}
                        <div className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-zinc-100 border-black/5'} rounded-xl border transition-colors duration-300`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white'} rounded-full flex items-center justify-center shadow-sm transition-colors`}>
                              <ChevronRight className="text-indigo-600" size={16} />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">Suggested Next Evolution</p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'} font-medium`}>{result.suggestedNext}</p>
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
              className={`relative ${theme === 'dark' ? 'bg-zinc-900 border border-white/10' : 'bg-white'} rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transition-colors duration-300`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-modal-title"
            >
              <div className="p-8 text-center space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 id="share-modal-title" className={`text-lg font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>Share Your Discovery</h3>
                  <button onClick={() => setShowShareModal(false)} className="text-zinc-400 hover:text-zinc-600" aria-label="Close share modal">
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
                  <button className={`flex items-center justify-center gap-2 py-3 ${theme === 'dark' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'} rounded-xl text-xs font-bold transition-all`} aria-label="Save discovery as image">
                    <ImageIcon size={16} /> Save Image
                  </button>
                  <button className={`flex items-center justify-center gap-2 py-3 ${theme === 'dark' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'} rounded-xl text-xs font-bold transition-all`} aria-label="Copy discovery link">
                    <Copy size={16} /> Copy Link
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    setShowShareModal(false);
                    setHasDailySpin(true); // Reward for sharing
                    showNotification("Discovery shared! You've earned an extra Quantum Spin.");
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

      <footer className={`max-w-7xl mx-auto px-6 py-12 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} mt-12 transition-colors duration-300`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} font-medium`}>
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
  required = false,
  theme
}: { 
  icon: React.ReactNode; 
  label: string; 
  placeholder: string; 
  value: string; 
  onChange: (v: string) => void;
  textarea?: boolean;
  required?: boolean;
  theme: 'light' | 'dark';
}) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-700'}`}>
        <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'} aria-hidden="true">{icon}</span>
        {label}
        {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          className={`w-full ${theme === 'dark' ? 'bg-zinc-800/50 border-white/10 text-zinc-100' : 'bg-white border-black/10 text-zinc-900'} rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all min-h-[100px] resize-none border`}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          className={`w-full ${theme === 'dark' ? 'bg-zinc-800/50 border-white/10 text-zinc-100' : 'bg-white border-black/10 text-zinc-900'} rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all border`}
        />
      )}
    </div>
  );
}

function CasinoWheel({ label, value, spinning, theme }: { label: string; value: string; spinning: boolean; theme: 'light' | 'dark' }) {
  return (
    <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-zinc-100 border-black/5'} border rounded-xl p-2 text-center overflow-hidden transition-colors`}>
      <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">{label}</p>
      <div className="h-6 flex items-center justify-center" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'} whitespace-nowrap ${spinning ? 'animate-pulse' : ''}`}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
function ScoreCard({ label, value, theme }: { label: string; value: number; theme: 'light' | 'dark' }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
        <p className={`text-xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{value}<span className="text-[10px] text-zinc-600">/100</span></p>
      </div>
      <div 
        className={`h-1.5 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'} rounded-full overflow-hidden transition-colors`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} score`}
      >
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${
            value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
        />
      </div>
    </div>
  );
}

function GenomeCard({ label, value, theme }: { label: string; value: string; theme: 'light' | 'dark' }) {
  return (
    <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} p-3 rounded-xl border shadow-sm transition-colors`}>
      <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">{label}</p>
      <p className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{value}</p>
    </div>
  );
}

function BuilderCard({ label, content, icon, theme }: { label: string; content: string; icon: React.ReactNode; theme: 'light' | 'dark' }) {
  return (
    <div className={`${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'} rounded-2xl border shadow-sm overflow-hidden transition-colors`}>
      <div className={`${theme === 'dark' ? 'bg-zinc-950 border-white/10' : 'bg-zinc-50 border-black/5'} p-3 border-b flex items-center gap-2 transition-colors`}>
        <span className="text-purple-400">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
      </div>
      <div className="p-4">
        <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} leading-relaxed whitespace-pre-wrap`}>{content}</p>
      </div>
    </div>
  );
}

function TimeCard({ label, content, color, theme }: { label: string; content: string; color: 'rose' | 'emerald' | 'indigo'; theme: 'light' | 'dark' }) {
  const colors = {
    rose: theme === 'dark' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200',
    emerald: theme === 'dark' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' : 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200',
    indigo: theme === 'dark' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200'
  };
  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} space-y-2 transition-colors`}>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</p>
      <p className="text-xs leading-relaxed">{content}</p>
    </div>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <a 
      href={href} 
      className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-purple-400 transition-colors"
    >
      {label}
    </a>
  );
}
