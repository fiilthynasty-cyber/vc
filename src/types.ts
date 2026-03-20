export interface PromptComponents {
  task: string;
  context: string;
  constraints: string;
  audience: string;
  tone: string;
  format: string;
}

export interface QuantumScores {
  creativity: number;
  power: number;
  originality: number;
  impact: number;
  monetization: number;
  automation: number;
}

export interface ExpertOpinion {
  expert: string;
  insight: string;
}

export interface FutureScenario {
  type: 'Success' | 'Failure' | 'Viral' | 'Competitor' | 'Saturation' | 'Opportunity';
  prediction: string;
}

export interface BusinessIntel {
  brandName: string;
  revenueModel: string;
  pricing: string;
  marketingStrategy: string;
  marketSize: string;
}

export interface ParallelUniverse {
  name: string;
  description: string;
  prompt: string;
}

export interface DigitalTwin {
  simulatedUsers: number;
  retentionRate: number;
  revenueProjection: string;
}

export interface BuilderOutput {
  landingPage: string;
  appInterface: string;
  roadmap: string;
  marketingFunnel: string;
}

export interface NegotiationSim {
  persona: string;
  concern: string;
  suggestedResponse: string;
}

export interface InnovationSector {
  sector: string;
  opportunityScore: number;
  trend: string;
}

export interface IdeaGenome {
  disruption: string;
  complexity: string;
  marketSize: string;
  difficulty: string;
}

export interface MarketResearch {
  competitors: {
    name: string;
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
  }[];
  pricingTrends: string[];
  marketSize: string;
  futureTrends: string[];
}

export interface IdeaEcosystem {
  core: string;
  components: { type: string; description: string }[];
}

export interface TimeMachine {
  past: string;
  present: string;
  future: string;
}

export interface InnovationExperiment {
  experiment: string;
  result: string;
}

export interface FullStackBlueprint {
  concept: {
    name: string;
    description: string;
    targetAudience: string;
    monetizationStrategy: string;
    aiEnhancements: string[];
  };
  coreFeatures: { title: string; description: string; futuristic: boolean }[];
  techStack: {
    frontend: { framework: string; libraries: string[]; reason: string };
    backend: { framework: string; apis: string[]; reason: string };
    database: { type: string; reason: string };
    cloudDevOps: { provider: string; strategy: string; reason: string };
  };
  security: {
    inputValidation: string;
    rateLimiting: string;
    csrfXss: string;
    apiKeyManagement: string;
    threatDetection: string;
    deploymentSecurity: string;
  };
  buildPrompts: {
    frontend: string;
    backend: string;
    database: string;
    deployment: string;
  };
  viralGrowth: {
    referralSystem: string;
    viralHooks: string[];
    socialMediaLoop: string;
  };
  moneyEngine: {
    revenueStreams: string[];
    pricingTiers: { tier: string; price: string; features: string[] }[];
    upsells: string[];
  };
  futureProof: {
    autoUpdates: string;
    refactoringSuggestions: string;
    blockchainIntegration?: string;
    predictiveAnalytics: string;
  };
  quantumAnalysis: {
    scores: { clarity: number; originality: number; impact: number };
    weakAreas: string[];
    improvements: string[];
    marketReadiness: string;
  };
  ideaJackpotSpinOffs: { tech: string; industry: string; trigger: string; idea: string }[];
}

export interface QuantumResult {
  refined: string;
  explanation: string;
  scores: QuantumScores;
  healthReport: {
    strength: number;
    weakAreas: string[];
    mistakes: string[];
  };
  experimentalPrompts: string[];
  neverTriedBefore: string;
  suggestedNext: string;
  selfImprovement: string;
  council: ExpertOpinion[];
  simulations: FutureScenario[];
  shockIdea?: string;
  businessIntel?: BusinessIntel;
  parallelUniverses: ParallelUniverse[];
  patternAnalysis?: {
    style: string;
    hiddenCreativity: string;
    suggestedShift: string;
  };
  digitalTwin?: DigitalTwin;
  builder?: BuilderOutput;
  negotiation?: NegotiationSim[];
  heatmap?: InnovationSector[];
  genome?: IdeaGenome;
  realityBentIdea?: string;
  marketResearch?: MarketResearch;
  ecosystem?: IdeaEcosystem;
  timeMachine?: TimeMachine;
  experiments?: InnovationExperiment[];
  // Ultra-Futuristic Features (10 Years Ahead)
  neuralSynthesis?: {
    figures: string[];
    combinedInsight: string;
  };
  entanglement?: {
    trend: string;
    impact: string;
  }[];
  sentiencePath?: string;
  butterflyEffect?: string;
  ethicalParadox?: {
    dilemma: string;
    solution: string;
  };
  syntheticFocusGroup?: {
    persona: string;
    feedback: string;
  }[];
  postScarcityAdaptation?: string;
  fullStackBlueprint?: FullStackBlueprint;
  strategicBlueprint?: {
    designSystem: {
      philosophy: string;
      visualDirection: string;
      coreComponents: string[];
    };
    detailedOutline: {
      phase: string;
      objectives: string[];
      deliverables: string[];
    }[];
    predictiveMilestones: {
      timeframe: string;
      event: string;
      probability: number;
      impact: string;
    }[];
    setupPath: {
      step: number;
      action: string;
      tool: string;
      expectedResult: string;
    }[];
  };
}

export interface CasinoResult {
  type: 'Startup' | 'Viral Content' | 'Automation Business';
  tech: string;
  industry: string;
  trigger: string;
  idea: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface AutocompleteSuggestion {
  text: string;
  type: 'audience' | 'constraint' | 'context' | 'format' | 'tone';
}

export interface PromptVersion {
  id: string;
  timestamp: number;
  components: PromptComponents;
  result: QuantumResult;
}
