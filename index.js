<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GEMINI-100 // PROMPT ORCHESTRATOR</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Space Mono', monospace; background-color: #020617; color: #22d3ee; }
        .quantum-glow { box-shadow: 0 0 20px rgba(34, 211, 238, 0.2); }
        .scanline {
            width: 100%; height: 2px; background: rgba(34, 211, 238, 0.1);
            position: absolute; animation: scan 4s linear infinite;
        }
        @keyframes scan { from { top: 0; } to { top: 100%; } }
    </style>
</head>
<body class="p-4 md:p-12 overflow-x-hidden">
    <div class="scanline"></div>

    <div class="max-w-5xl mx-auto">
        <header class="border-b border-cyan-900 pb-6 mb-12">
            <h1 class="text-3xl font-black tracking-tighter uppercase italic">
                Gemini-100 <span class="text-white/20 not-italic font-light">AGI Interface</span>
            </h1>
            <p class="text-[10px] tracking-[0.4em] text-cyan-700 mt-2 font-bold uppercase">Year 2036 // Quantum Reasoning Enabled</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div class="bg-slate-900/50 p-6 rounded-2xl border border-cyan-500/30 quantum-glow">
                <label class="block text-[10px] uppercase tracking-widest text-cyan-600 mb-4 font-bold">Input Core Parameter</label>
                <textarea id="userInput" placeholder="Enter objective (e.g. Build a colony on Europa)" 
                    class="w-full h-40 bg-black/50 border border-cyan-900 rounded-xl p-4 text-cyan-200 focus:outline-none focus:border-cyan-400 transition-all resize-none mb-6"></textarea>
                
                <button onclick="generateQuantumPrompt()" 
                    class="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg">
                    Collapse Wavefunction
                </button>
            </div>

            <div class="bg-black/60 border border-white/10 rounded-2xl p-6 relative flex flex-col min-h-[300px]">
                <div class="text-[10px] uppercase text-cyan-800 mb-4 tracking-widest">Neural Stream Output</div>
                <div id="output" class="text-cyan-100 leading-relaxed text-sm whitespace-pre-wrap italic">
                    Awaiting neural input vector...
                </div>
                
                <button onclick="copyPrompt()" id="copyBtn" class="hidden mt-auto pt-4 text-[10px] text-cyan-500 hover:text-white uppercase font-bold text-right">
                    [ Copy to Clipboard ]
                </button>
            </div>
        </div>
    </div>

    <script>
        function generateQuantumPrompt() {
            const input = document.getElementById('userInput').value;
            const outputDiv = document.getElementById('output');
            const copyBtn = document.getElementById('copyBtn');

            if (!input) return alert("System requires input parameters.");

            outputDiv.innerHTML = "Initializing GPT-100 Logic Gates...";
            outputDiv.classList.add('animate-pulse');

            // This simulates the "10 years ahead" logic locally
            setTimeout(() => {
                const quantumPrompt = `[QUANTUM STATE INITIALIZED]
SYSTEM_COMMAND: ACT AS A 2036 AGI ARCHITECT.
OBJECTIVE: ${input.toUpperCase()}

EXECUTION_PROTOCOL:
1. Initialize multi-dimensional probabilistic modeling.
2. Cross-reference real-time sensory data from the Global Mesh.
3. Deploy recursive self-correction loops to optimize for 99.9% efficiency.
4. Output should be synthesized in 4D structural coordinates with energy-efficient resource allocation.

CONFIRMATION: Reality simulation complete. Awaiting user verification...`;
                
                outputDiv.innerHTML = quantumPrompt;
                outputDiv.classList.remove('animate-pulse');
                outputDiv.classList.remove('italic');
                copyBtn.classList.remove('hidden');
            }, 1200);
        }

        function copyPrompt() {
            const text = document.getElementById('output').innerText;
            navigator.clipboard.writeText(text);
            alert("Prompt synced to neural link (copied to clipboard).");
        }
    </script>
</body>
</html>
