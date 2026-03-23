export type ProjectType = 'software' | 'startup' | 'creative' | 'learning'
export type ProjectStatus = 'planning' | 'in-progress' | 'completed'

export interface Step {
  id: string
  number: number
  title: string
  description: string
  instructions: string
  requirements: string[]
  successCriteria: string
  estimatedTime: number
  notes: string
  completed: boolean
  completedAt?: string
}

export interface Program {
  id: string
  name: string
  description: string
  downloadUrl: string
  requiredVersion?: string
  installed: boolean
  notes: string
}

export interface Account {
  id: string
  service: string
  description: string
  loginUrl?: string
  created: boolean
  notes: string
}

export interface ResourceLink {
  id: string
  title: string
  url: string
  category: string
}

export interface Resources {
  programs: Program[]
  accounts: Account[]
  links: ResourceLink[]
}

export interface Project {
  id: string
  name: string
  type: ProjectType
  goal: string
  createdAt: string
  updatedAt: string
  steps: Step[]
  resources: Resources
  currentStepIndex: number
  status: ProjectStatus
}
