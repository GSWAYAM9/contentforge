import { AgentExecutionContext, ProjectMemory } from '../types/ai'

export class ExecutionContext {
  private context: AgentExecutionContext

  constructor(baseContext: Partial<AgentExecutionContext>) {
    // Convert plain object to Map if needed
    let previousOutputs: Map<string, any> = new Map()
    if (baseContext.previousOutputs) {
      if (baseContext.previousOutputs instanceof Map) {
        previousOutputs = baseContext.previousOutputs
      } else {
        // Convert plain object to Map
        previousOutputs = new Map(Object.entries(baseContext.previousOutputs as Record<string, any>))
      }
    }

    this.context = {
      projectId: baseContext.projectId || '',
      project: baseContext.project || {},
      website: baseContext.website || '',
      prompt: baseContext.prompt || '',
      targetAudience: baseContext.targetAudience || '',
      brandVoice: baseContext.brandVoice || '',
      tone: baseContext.tone || 'professional',
      keywords: baseContext.keywords || [],
      research: baseContext.research || {},
      previousOutputs,
      memory: baseContext.memory || this.createEmptyMemory(),
      userSettings: baseContext.userSettings || {},
      language: baseContext.language || 'en',
      targetPlatform: baseContext.targetPlatform || 'blog',
    }
  }

  private createEmptyMemory(): ProjectMemory {
    return {
      brandVoice: '',
      audience: '',
      writingStyle: '',
      preferredCTA: '',
      frequentKeywords: [],
      successfulArticles: [],
      internalUrls: [],
      customInstructions: '',
    }
  }

  getContext(): AgentExecutionContext {
    return this.context
  }

  updateMemory(memory: Partial<ProjectMemory>): void {
    this.context.memory = {
      ...this.context.memory,
      ...memory,
    }
  }

  addPreviousOutput(agentName: string, output: any): void {
    this.context.previousOutputs.set(agentName, output)
  }

  getPreviousOutput(agentName: string): any {
    return this.context.previousOutputs.get(agentName)
  }

  getAllPreviousOutputs(): { [key: string]: any } {
    const result: { [key: string]: any } = {}
    this.context.previousOutputs.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  updateKeywords(keywords: string[]): void {
    this.context.keywords = keywords
  }

  updateTone(tone: 'formal' | 'casual' | 'professional' | 'creative'): void {
    this.context.tone = tone
  }

  setResearch(research: any): void {
    this.context.research = research
  }

  toJSON(): AgentExecutionContext {
    return {
      ...this.context,
      previousOutputs: this.getAllPreviousOutputs() as any,
    }
  }
}
