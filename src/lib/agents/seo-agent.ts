import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { getPrompt } from '../prompts'

export class SEOAgent extends BaseAgent {
  constructor() {
    super('SEO Optimizer')
  }

  buildPrompt(context: AgentExecutionContext): string {
    const basePrompt = getPrompt('seo')
    const article = context.previousOutputs?.get('Writer') || ''
    const keywords = context.keywords

    return `${basePrompt}

Article Title/Topic: ${context.prompt}
Target Keywords: ${keywords.join(', ')}

Article Content:
${article}

${this.formatContext(context)}

Provide SEO optimization recommendations including title, meta description, and schema markup.`
  }
}
