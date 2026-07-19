import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { getPrompt } from '../prompts'

export class KeywordAgent extends BaseAgent {
  constructor() {
    super('Keyword Research')
  }

  buildPrompt(context: AgentExecutionContext): string {
    const basePrompt = getPrompt('keyword-research')

    return `${basePrompt}

Topic: ${context.prompt}
Website: ${context.website}
Target Audience: ${context.targetAudience}
Current Keywords: ${context.keywords.join(', ')}

${this.formatContext(context)}`
  }
}
