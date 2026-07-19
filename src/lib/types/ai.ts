// AI execution types
export interface AgentExecutionContext {
  projectId: string
  project: any
  website: string
  prompt: string
  targetAudience: string
  brandVoice: string
  tone: 'formal' | 'casual' | 'professional' | 'creative'
  keywords: string[]
  research: any
  previousOutputs: Map<string, any>
  memory: ProjectMemory
  userSettings: any
  language: string
  targetPlatform: string
}

export interface ProjectMemory {
  brandVoice: string
  audience: string
  writingStyle: string
  preferredCTA: string
  frequentKeywords: string[]
  successfulArticles: string[]
  internalUrls: string[]
  customInstructions: string
}

export interface AgentOutput {
  status: 'success' | 'failed' | 'warning'
  output: any
  metadata: {
    duration: number
    tokensUsed: number
    estimatedCost: number
    model: string
  }
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  logs: string[]
  errors: string[]
  version: number
  timestamp: string
}

export interface PipelineExecution {
  id: string
  projectId: string
  status: 'running' | 'paused' | 'completed' | 'failed'
  currentStep: number
  steps: PipelineStep[]
  startedAt: Date
  completedAt?: Date
  totalDuration?: number
  totalCost: number
  totalTokens: number
  events: PipelineEvent[]
  context: AgentExecutionContext
}

export interface PipelineStep {
  id: string
  name: string
  agentName: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused'
  output?: AgentOutput
  startedAt?: Date
  completedAt?: Date
  duration?: number
  retries: number
  maxRetries: number
}

export interface PipelineEvent {
  type: 'started' | 'completed' | 'failed' | 'approval_requested' | 'retry'
  stepName: string
  timestamp: Date
  data: any
}

export interface FailureReason {
  category: 'api' | 'timeout' | 'rate_limit' | 'validation' | 'unknown'
  message: string
  retryable: boolean
}

export interface UsageTracking {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCost: number
  latency: number
  model: string
  agentName: string
}
