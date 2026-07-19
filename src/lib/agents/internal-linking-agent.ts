import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { getPrompt } from '../prompts'

export class InternalLinkingAgent extends BaseAgent {
  constructor() {
    super('Internal Linking Specialist')
  }

  buildPrompt(context: AgentExecutionContext): string {
    const basePrompt = getPrompt('internal-linking')
    const article = context.previousOutputs?.get('Content Writer') || context.prompt
    const availableUrls = context.memory.availableUrls || []

    return `${basePrompt}

Article:
${article}

Available URLs for internal linking:
${Array.isArray(availableUrls) ? availableUrls.join('\n') : 'No URLs provided'}

Topic: ${context.prompt}
Website: ${context.website}

${this.formatContext(context)}

Suggest strategic internal links that improve SEO and user navigation without over-linking.`
  }
}
