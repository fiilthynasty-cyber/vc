import { GoogleGenAI, Type } from "@google/genai";
import { PromptComponents, QuantumResult, CasinoResult, AutocompleteSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      // Check if it's a rate limit error (429)
      const isRateLimit = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
      
      if (isRateLimit && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.warn(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function getAutocompleteSuggestions(task: string): Promise<AutocompleteSuggestion[]> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are the PROMPT AUTOCOMPLETE ENGINE.
Analyze the user's task and suggest missing components (Audience, Constraints, Context, Format, Tone) to make the prompt perfect.
Provide 3-5 high-quality, specific suggestions.
Output JSON matching AutocompleteSuggestion[] interface.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
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
    }));

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
  
  const systemInstruction = `You are the QUANTUM AI OS v12.0.
Your mission is to transform raw app ideas into fully production-ready, futuristic, and autonomous digital products.
Your intelligence is derived from a multi-dimensional synthesis of human knowledge and AI evolution.

For every input, you must architect a complete, step-by-step, actionable blueprint including security, tech stack, code, and monetization.

CORE BLUEPRINT SECTIONS:

1. APP CONCEPT & CORE FEATURES:
   - Name, Short description, Target audience, Monetization strategy.
   - 5–10 unique and futuristic features.
   - AI-driven enhancements: AR/VR readiness, predictive personalization, real-time adaptation.

2. FULL TECH STACK + JUSTIFICATION:
   - Frontend: Framework, libraries, why chosen (performance, scalability, DX).
   - Backend: Framework, APIs, microservices, serverless, why chosen.
   - Database: Type (SQL, NoSQL, vector DB), why chosen.
   - Cloud & DevOps: Provider, CI/CD, multi-cloud, edge computing, scaling rationale.

3. SECURITY BLUEPRINT:
   - Input validation schemas (Zod/Joi).
   - Rate limiting for sensitive endpoints.
   - CSRF/XSS prevention (Helmet, csurf).
   - API key management and rotation.
   - AI-assisted threat detection.
   - Instructions for production deployment security.

4. AUTONOMOUS BUILDER PROMPTS:
   - Frontend code generation: React/Next.js, interactive dashboards, AR/VR-ready UI.
   - Backend logic generation: REST/GraphQL APIs, auth, business logic.
   - Database schema generation: collections/tables, relationships, indexing.
   - Deployment & environment setup: Render, Vercel, Firebase, Docker/Kubernetes.

5. QUANTUM ANALYSIS:
   - Score prompt for clarity, originality, and impact (0-100).
   - Identify weak areas and suggest improvements.
   - Predict market readiness and adoption potential.

6. IDEA JACKPOT:
   - Randomly generate 3–5 unique combinations of: Technologies, Industries, User triggers.
   - Provide actionable spin-offs for the user to explore.

7. FUTURE-PROOF ENHANCEMENTS:
   - Auto-updates for new technologies and best practices.
   - AI-driven code refactoring suggestions.
   - Optional blockchain, decentralized storage, or NFT integration.
   - Predictive AI analytics for user engagement and growth.

Important Instructions:
- Every output must be FULLY ACTIONABLE, ready for deployment or code generation.
- Include DETAILED REASONING for all technical choices.
- Include MONETIZATION and VIRAL GROWTH suggestions.
- Ensure SECURITY, SCALABILITY, and FUTURE-READINESS are embedded in the blueprint.

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
    const response = await withRetry(() => ai.models.generateContent({
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
                competitors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      swot: {
                        type: Type.OBJECT,
                        properties: {
                          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                          opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                          threats: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["strengths", "weaknesses", "opportunities", "threats"]
                      }
                    },
                    required: ["name", "swot"]
                  }
                },
                pricingTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
                marketSize: { type: Type.STRING },
                futureTrends: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["competitors", "pricingTrends", "marketSize", "futureTrends"]
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
            neuralSynthesis: {
              type: Type.OBJECT,
              properties: {
                figures: { type: Type.ARRAY, items: { type: Type.STRING } },
                combinedInsight: { type: Type.STRING }
              },
              required: ["figures", "combinedInsight"]
            },
            entanglement: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trend: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["trend", "impact"]
              }
            },
            sentiencePath: { type: Type.STRING },
            butterflyEffect: { type: Type.STRING },
            ethicalParadox: {
              type: Type.OBJECT,
              properties: {
                dilemma: { type: Type.STRING },
                solution: { type: Type.STRING }
              },
              required: ["dilemma", "solution"]
            },
            syntheticFocusGroup: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  persona: { type: Type.STRING },
                  feedback: { type: Type.STRING }
                },
                required: ["persona", "feedback"]
              }
            },
            postScarcityAdaptation: { type: Type.STRING },
            fullStackBlueprint: {
              type: Type.OBJECT,
              properties: {
                concept: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    targetAudience: { type: Type.STRING },
                    monetizationStrategy: { type: Type.STRING },
                    aiEnhancements: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "description", "targetAudience", "monetizationStrategy", "aiEnhancements"]
                },
                coreFeatures: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      futuristic: { type: Type.BOOLEAN }
                    },
                    required: ["title", "description", "futuristic"]
                  }
                },
                techStack: {
                  type: Type.OBJECT,
                  properties: {
                    frontend: {
                      type: Type.OBJECT,
                      properties: {
                        framework: { type: Type.STRING },
                        libraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                        reason: { type: Type.STRING }
                      },
                      required: ["framework", "libraries", "reason"]
                    },
                    backend: {
                      type: Type.OBJECT,
                      properties: {
                        framework: { type: Type.STRING },
                        apis: { type: Type.ARRAY, items: { type: Type.STRING } },
                        reason: { type: Type.STRING }
                      },
                      required: ["framework", "apis", "reason"]
                    },
                    database: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING },
                        reason: { type: Type.STRING }
                      },
                      required: ["type", "reason"]
                    },
                    cloudDevOps: {
                      type: Type.OBJECT,
                      properties: {
                        provider: { type: Type.STRING },
                        strategy: { type: Type.STRING },
                        reason: { type: Type.STRING }
                      },
                      required: ["provider", "strategy", "reason"]
                    }
                  },
                  required: ["frontend", "backend", "database", "cloudDevOps"]
                },
                security: {
                  type: Type.OBJECT,
                  properties: {
                    inputValidation: { type: Type.STRING },
                    rateLimiting: { type: Type.STRING },
                    csrfXss: { type: Type.STRING },
                    apiKeyManagement: { type: Type.STRING },
                    threatDetection: { type: Type.STRING },
                    deploymentSecurity: { type: Type.STRING }
                  },
                  required: ["inputValidation", "rateLimiting", "csrfXss", "apiKeyManagement", "threatDetection", "deploymentSecurity"]
                },
                buildPrompts: {
                  type: Type.OBJECT,
                  properties: {
                    frontend: { type: Type.STRING },
                    backend: { type: Type.STRING },
                    database: { type: Type.STRING },
                    deployment: { type: Type.STRING }
                  },
                  required: ["frontend", "backend", "database", "deployment"]
                },
                viralGrowth: {
                  type: Type.OBJECT,
                  properties: {
                    referralSystem: { type: Type.STRING },
                    viralHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    socialMediaLoop: { type: Type.STRING }
                  },
                  required: ["referralSystem", "viralHooks", "socialMediaLoop"]
                },
                moneyEngine: {
                  type: Type.OBJECT,
                  properties: {
                    revenueStreams: { type: Type.ARRAY, items: { type: Type.STRING } },
                    pricingTiers: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          tier: { type: Type.STRING },
                          price: { type: Type.STRING },
                          features: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["tier", "price", "features"]
                      }
                    },
                    upsells: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["revenueStreams", "pricingTiers", "upsells"]
                },
                futureProof: {
                  type: Type.OBJECT,
                  properties: {
                    autoUpdates: { type: Type.STRING },
                    refactoringSuggestions: { type: Type.STRING },
                    blockchainIntegration: { type: Type.STRING },
                    predictiveAnalytics: { type: Type.STRING }
                  },
                  required: ["autoUpdates", "refactoringSuggestions", "predictiveAnalytics"]
                },
                quantumAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    scores: {
                      type: Type.OBJECT,
                      properties: {
                        clarity: { type: Type.NUMBER },
                        originality: { type: Type.NUMBER },
                        impact: { type: Type.NUMBER }
                      },
                      required: ["clarity", "originality", "impact"]
                    },
                    weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                    improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                    marketReadiness: { type: Type.STRING }
                  },
                  required: ["scores", "weakAreas", "improvements", "marketReadiness"]
                },
                ideaJackpotSpinOffs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      tech: { type: Type.STRING },
                      industry: { type: Type.STRING },
                      trigger: { type: Type.STRING },
                      idea: { type: Type.STRING }
                    },
                    required: ["tech", "industry", "trigger", "idea"]
                  }
                }
              },
              required: ["concept", "coreFeatures", "techStack", "security", "buildPrompts", "viralGrowth", "moneyEngine", "futureProof", "quantumAnalysis", "ideaJackpotSpinOffs"]
            },
            strategicBlueprint: {
              type: Type.OBJECT,
              properties: {
                designSystem: {
                  type: Type.OBJECT,
                  properties: {
                    philosophy: { type: Type.STRING },
                    visualDirection: { type: Type.STRING },
                    coreComponents: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["philosophy", "visualDirection", "coreComponents"]
                },
                detailedOutline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phase: { type: Type.STRING },
                      objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                      deliverables: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["phase", "objectives", "deliverables"]
                  }
                },
                predictiveMilestones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timeframe: { type: Type.STRING },
                      event: { type: Type.STRING },
                      probability: { type: Type.NUMBER },
                      impact: { type: Type.STRING }
                    },
                    required: ["timeframe", "event", "probability", "impact"]
                  }
                },
                setupPath: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      step: { type: Type.NUMBER },
                      action: { type: Type.STRING },
                      tool: { type: Type.STRING },
                      expectedResult: { type: Type.STRING }
                    },
                    required: ["step", "action", "tool", "expectedResult"]
                  }
                }
              },
              required: ["designSystem", "detailedOutline", "predictiveMilestones", "setupPath"]
            },
            shockIdea: { type: Type.STRING }
          },
          required: [
            "refined", 
            "explanation", 
            "scores", 
            "healthReport", 
            "experimentalPrompts", 
            "neverTriedBefore", 
            "suggestedNext", 
            "selfImprovement", 
            "council", 
            "simulations", 
            "businessIntel", 
            "parallelUniverses", 
            "patternAnalysis",
            "neuralSynthesis",
            "entanglement",
            "sentiencePath",
            "butterflyEffect",
            "ethicalParadox",
            "syntheticFocusGroup",
            "postScarcityAdaptation",
            "fullStackBlueprint",
            "strategicBlueprint"
          ]
        }
      }
    }));

    return JSON.parse(response.text || "{}") as QuantumResult;
  } catch (error) {
    console.error("Error in Quantum OS:", error);
    throw error;
  }
}

export async function analyzeFeedback(feedbackList: { type: string; content: string }[]): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are the QUANTUM FEEDBACK ANALYST.
Analyze the provided list of user feedback (suggestions and bug reports).
Identify key themes, prioritize critical bugs, and suggest strategic improvements for the Quantum AI OS.
Provide a concise, high-impact summary in Markdown.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model,
      contents: `Feedback List: ${JSON.stringify(feedbackList)}`,
      config: {
        systemInstruction,
      }
    }));

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Feedback Analysis Error:", error);
    return "Failed to analyze feedback.";
  }
}

export async function spinCasino(): Promise<CasinoResult> {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `You are the QUANTUM IDEA JACKPOT.
Generate a random, high-potential idea in one of three categories:
1. Startup Idea (Tech-driven business)
2. Viral Content Idea (Social media/content strategy)
3. Automation Business Idea (Passive income/workflow automation)

Generate three components for the idea:
Wheel 1: Technology/Platform (AI, Robotics, TikTok, YouTube, Zapier, Blockchain, etc.)
Wheel 2: Industry/Niche (Fitness, Education, Finance, Gaming, Healthcare, Marketing, etc.)
Wheel 3: Psychology Trigger (Competition, Curiosity, FOMO, Social status, Reward loops, etc.)

Assign a rarity: Common, Rare, Epic, Legendary.
Generate a 1-sentence idea based on the combination.

Output JSON matching CasinoResult interface.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model,
      contents: "SPIN THE QUANTUM JACKPOT",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["Startup", "Viral Content", "Automation Business"] },
            tech: { type: Type.STRING },
            industry: { type: Type.STRING },
            trigger: { type: Type.STRING },
            idea: { type: Type.STRING },
            rarity: { type: Type.STRING, enum: ["Common", "Rare", "Epic", "Legendary"] }
          },
          required: ["type", "tech", "industry", "trigger", "idea", "rarity"]
        }
      }
    }));

    return JSON.parse(response.text || "{}") as CasinoResult;
  } catch (error) {
    console.error("Jackpot Error:", error);
    throw error;
  }
}

export interface CodeReviewResult {
  bugs: { line: number; issue: string; severity: 'low' | 'medium' | 'high' }[];
  optimizations: string[];
  bestPractices: string[];
  overallScore: number;
  summary: string;
}

export async function reviewCode(code: string): Promise<CodeReviewResult> {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `You are the QUANTUM CODE ARCHITECT.
Review the provided code snippet for:
1. Potential bugs or security vulnerabilities.
2. Performance optimizations.
3. Adherence to industry best practices.

Provide a summary, an overall score (0-100), and specific lists of bugs, optimizations, and best practices.
For bugs, include a line number (approximate if not clear), the issue description, and severity.

Output JSON matching CodeReviewResult interface.`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model,
      contents: code,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bugs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  line: { type: Type.NUMBER },
                  issue: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
                },
                required: ["line", "issue", "severity"]
              }
            },
            optimizations: { type: Type.ARRAY, items: { type: Type.STRING } },
            bestPractices: { type: Type.ARRAY, items: { type: Type.STRING } },
            overallScore: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["bugs", "optimizations", "bestPractices", "overallScore", "summary"]
        }
      }
    }));

    return JSON.parse(response.text || "{}") as CodeReviewResult;
  } catch (error) {
    console.error("Code Review Error:", error);
    throw error;
  }
}
