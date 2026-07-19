import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { getPrompt } from '../prompts'

export class ResearchAgent extends BaseAgent {
  constructor() {
    super('Research')
  }

  buildPrompt(context: AgentExecutionContext): string {
    const basePrompt = getPrompt('research')
    const keywords = context.keywords.join(', ')

    return `${basePrompt}

Topic: ${context.prompt}
Keywords: ${keywords}
Target Audience: ${context.targetAudience}

${this.formatContext(context)}

Provide comprehensive research with facts, evidence, and actionable insights.`
  }
}
