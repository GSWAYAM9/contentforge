import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { getPrompt } from '../prompts'

export class EditorAgent extends BaseAgent {
  constructor() {
    super('Content Editor')
  }

  buildPrompt(context: AgentExecutionContext): string {
    const basePrompt = getPrompt('editor')
    const article = context.previousOutputs?.get('Content Writer') || context.prompt

    return `${basePrompt}

Article to edit:
${article}

Topic: ${context.prompt}
Brand Voice: ${context.brandVoice}
Tone: ${context.tone}

Memory - Writing Style: ${context.memory.writingStyle || 'professional'}
Memory - Grammar Preferences: ${context.memory.grammarPreferences || 'standard'}

${this.formatContext(context)}

Improve the article for grammar, flow, tone consistency, readability, and engagement while maintaining the original structure.`
  }
}
