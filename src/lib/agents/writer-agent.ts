import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { getPrompt } from '../prompts'

export class WriterAgent extends BaseAgent {
  constructor() {
    super('Content Writer')
  }

  buildPrompt(context: AgentExecutionContext): string {
    const basePrompt = getPrompt('writer')
    const outline = context.previousOutputs?.get('Outline') || {}
    const research = context.previousOutputs?.get('Research') || {}

    return `${basePrompt}

Topic: ${context.prompt}
Keywords: ${context.keywords.join(', ')}

Outline:
${JSON.stringify(outline, null, 2)}

Research:
${JSON.stringify(research, null, 2)}

Memory - Writing Style: ${context.memory.writingStyle}
Memory - Preferred CTA: ${context.memory.preferredCTA}

${this.formatContext(context)}

Write the complete article in markdown format.`
  }
}
