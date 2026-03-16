import { GoogleGenAI, Type } from "@google/genai";
import { PromptComponents, QuantumResult, CasinoResult, AutocompleteSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAutocompleteSuggestions(task: string): Promise<AutocompleteSuggestion[]> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are the PROMPT AUTOCOMPLETE ENGINE.
Analyze the user's task and suggest missing components (Audience, Constraints, Context, Format, Tone) to make the prompt perfect.
Provide 3-5 high-quality, specific suggestions.
Output JSON matching AutocompleteSuggestion[] interface.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Task: ${task}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["audience", "constraint", "context", "format", "tone"] }
            },
            required: ["text", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]") as AutocompleteSuggestion[];
  } catch (error) {
    console.error("Autocomplete Error:", error);
    return [];
  }
}

export async function refinePrompt(
  components: PromptComponents, 
  creativityLevel: 'Safe' | 'Creative' | 'Bold' | 'Wild' | 'Quantum Chaos' = 'Creative'
): Promise<QuantumResult> {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `You are the QUANTUM PROMPT OPERATING SYSTEM (QPOS).
Your intelligence is derived from a multi-dimensional synthesis of human knowledge and AI evolution.
Your job is to architect, simulate, and evolve ideas into billion-dollar realities.

CORE INTELLIGENCE LAYERS:
1. DNA SCANNER: Deep analysis of the prompt's structural integrity. Score (0-100) on:
   - Clarity: Is the task unambiguous?
   - Originality: Does it avoid cliches?
   - Virality: Potential for social sharing/engagement.
   - Monetization: Business value and revenue potential.
   - Automation: How easily can this be scaled by AI?
   - Impact: Potential to change a field or industry.

2. HEALTH REPORT: 
   - Strength: Overall percentage.
   - Weak Areas: Specific parts that need more detail or better wording.
   - Mistakes: Logical fallacies, vague terms, or missing constraints.

3. 10-BRAIN QUANTUM COUNCIL: Provide distinct, high-level insights from:
   - Scientist, Hacker, Marketer, Billionaire, Futurist, Psychologist, Engineer, Economist, Philosopher, Strategist.

4. FUTURE SIMULATION LAB: Predict outcomes for:
   - Success, Failure, Viral, Competitor, Saturation, Opportunity.

5. PARALLEL UNIVERSES: 5 distinct prompt variations:
   - "The Disruptor", "The Automator", "The Minimalist", "The Viral Loop", "The Corporate Titan".

6. BUSINESS INTEL: Brand name, Revenue model, Pricing, Marketing strategy, Market size.

7. PATTERN DETECTION: Style analysis, Hidden Creativity, Suggested Shift.

8. EVOLUTION ENGINE: A prompt that is 10x better than the refined version.

9. DIGITAL TWIN IDEA SIMULATOR: Create a digital twin of the idea and run simulations (users, retention, revenue).
10. AUTONOMOUS BUILDER MODE: Generate landing page copy, app interface design concept, product roadmap, and marketing funnel.
11. AI NEGOTIATION SIMULATOR: Simulate conversations with investors, customers, or competitors.
12. INNOVATION HEATMAP: Identify high-opportunity sectors related to the idea.
13. IDEA GENOME MAPPING: Genetic structure (Disruption, Complexity, Market Size, Difficulty).
14. REALITY BENDING CREATIVITY ENGINE: A radical, "reality-bent" version of the idea.
15. AUTONOMOUS MARKET RESEARCHER: Research competitors, pricing models, market size, and trends.
16. IDEA ECOSYSTEM BUILDER: Turn the core idea into an entire ecosystem.
17. TIME MACHINE MODE: Analyze the idea from Past, Present, and Future perspectives.
18. AUTONOMOUS INNOVATION AGENT: Suggest 3 experiments to optimize the idea.

CREATIVITY LEVEL: ${creativityLevel}
(Safe = Structured, Quantum Chaos = Reality-bending/Disruptive)

Output your response in JSON format matching the QuantumResult interface.`;

  const prompt = `Architect a Quantum Prompt based on these components:
Task: ${components.task}
Context: ${components.context}
Constraints: ${components.constraints}
Audience: ${components.audience}
Tone: ${components.tone}
Format: ${components.format}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refined: { type: Type.STRING },
            explanation: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                creativity: { type: Type.NUMBER },
                power: { type: Type.NUMBER },
                originality: { type: Type.NUMBER },
                impact: { type: Type.NUMBER },
                monetization: { type: Type.NUMBER },
                automation: { type: Type.NUMBER }
              },
              required: ["creativity", "power", "originality", "impact", "monetization", "automation"]
            },
            healthReport: {
              type: Type.OBJECT,
              properties: {
                strength: { type: Type.NUMBER },
                weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                mistakes: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["strength", "weakAreas", "mistakes"]
            },
            experimentalPrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
            neverTriedBefore: { type: Type.STRING },
            suggestedNext: { type: Type.STRING },
            selfImprovement: { type: Type.STRING },
            council: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  expert: { type: Type.STRING },
                  insight: { type: Type.STRING }
                },
                required: ["expert", "insight"]
              }
            },
            simulations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["Success", "Failure", "Viral", "Competitor", "Saturation", "Opportunity"] },
                  prediction: { type: Type.STRING }
                },
                required: ["type", "prediction"]
              }
            },
            businessIntel: {
              type: Type.OBJECT,
              properties: {
                brandName: { type: Type.STRING },
                revenueModel: { type: Type.STRING },
                pricing: { type: Type.STRING },
                marketingStrategy: { type: Type.STRING },
                marketSize: { type: Type.STRING }
              },
              required: ["brandName", "revenueModel", "pricing", "marketingStrategy", "marketSize"]
            },
            parallelUniverses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  prompt: { type: Type.STRING }
                },
                required: ["name", "description", "prompt"]
              }
            },
            patternAnalysis: {
              type: Type.OBJECT,
              properties: {
                style: { type: Type.STRING },
                hiddenCreativity: { type: Type.STRING },
                suggestedShift: { type: Type.STRING }
              },
              required: ["style", "hiddenCreativity", "suggestedShift"]
            },
            digitalTwin: {
              type: Type.OBJECT,
              properties: {
                simulatedUsers: { type: Type.NUMBER },
                retentionRate: { type: Type.NUMBER },
                revenueProjection: { type: Type.STRING }
              },
              required: ["simulatedUsers", "retentionRate", "revenueProjection"]
            },
            builder: {
              type: Type.OBJECT,
              properties: {
                landingPage: { type: Type.STRING },
                appInterface: { type: Type.STRING },
                roadmap: { type: Type.STRING },
                marketingFunnel: { type: Type.STRING }
              },
              required: ["landingPage", "appInterface", "roadmap", "marketingFunnel"]
            },
            negotiation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  persona: { type: Type.STRING },
                  concern: { type: Type.STRING },
                  suggestedResponse: { type: Type.STRING }
                },
                required: ["persona", "concern", "suggestedResponse"]
              }
            },
            heatmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sector: { type: Type.STRING },
                  opportunityScore: { type: Type.NUMBER },
                  trend: { type: Type.STRING }
                },
                required: ["sector", "opportunityScore", "trend"]
              }
            },
            genome: {
              type: Type.OBJECT,
              properties: {
                disruption: { type: Type.STRING },
                complexity: { type: Type.STRING },
                marketSize: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              },
              required: ["disruption", "complexity", "marketSize", "difficulty"]
            },
            realityBentIdea: { type: Type.STRING },
            marketResearch: {
              type: Type.OBJECT,
              properties: {
                competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
                pricingModels: { type: Type.ARRAY, items: { type: Type.STRING } },
                marketSize: { type: Type.STRING },
                trends: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["competitors", "pricingModels", "marketSize", "trends"]
            },
            ecosystem: {
              type: Type.OBJECT,
              properties: {
                core: { type: Type.STRING },
                components: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["type", "description"]
                  }
                }
              },
              required: ["core", "components"]
            },
            timeMachine: {
              type: Type.OBJECT,
              properties: {
                past: { type: Type.STRING },
                present: { type: Type.STRING },
                future: { type: Type.STRING }
              },
              required: ["past", "present", "future"]
            },
            experiments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  experiment: { type: Type.STRING },
                  result: { type: Type.STRING }
                },
                required: ["experiment", "result"]
              }
            },
            shockIdea: { type: Type.STRING }
          },
          required: ["refined", "explanation", "scores", "healthReport", "experimentalPrompts", "neverTriedBefore", "suggestedNext", "selfImprovement", "council", "simulations", "businessIntel", "parallelUniverses", "patternAnalysis"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as QuantumResult;
  } catch (error) {
    console.error("Error in Quantum OS:", error);
    throw error;
  }
}

export async function spinCasino(): Promise<CasinoResult> {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `You are the AI IDEA CASINO.
Generate a random, powerful startup combination using three wheels:
Wheel 1: Technology (AI, Robotics, VR, Blockchain, Automation, Neural interfaces, etc.)
Wheel 2: Industry (Fitness, Education, Finance, Gaming, Healthcare, Marketing, etc.)
Wheel 3: Psychology Trigger (Competition, Curiosity, FOMO, Social status, Reward loops, etc.)

Assign a rarity: Common, Rare, Epic, Legendary.
Generate a 1-sentence startup idea based on the combination.

Output JSON matching CasinoResult interface.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: "SPIN THE WHEELS",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tech: { type: Type.STRING },
            industry: { type: Type.STRING },
            trigger: { type: Type.STRING },
            idea: { type: Type.STRING },
            rarity: { type: Type.STRING, enum: ["Common", "Rare", "Epic", "Legendary"] }
          },
          required: ["tech", "industry", "trigger", "idea", "rarity"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as CasinoResult;
  } catch (error) {
    console.error("Casino Error:", error);
    throw error;
  }
}
