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
  competitors: string[];
  pricingModels: string[];
  marketSize: string;
  trends: string[];
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
  // Futuristic Features
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
}

export interface CasinoResult {
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
