import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { getPrompt } from '../prompts'

export class LearningAgent extends BaseAgent {
  constructor() {
    super('Learning System')
  }

  buildPrompt(context: AgentExecutionContext): string {
    const basePrompt = getPrompt('learning')
    const article = context.previousOutputs?.get('Content Writer') || context.prompt
    const seoData = context.previousOutputs?.get('SEO') || {}

    return `${basePrompt}

Article:
${article}

SEO Optimization Data:
${JSON.stringify(seoData, null, 2)}

Topic: ${context.prompt}
Keywords: ${context.keywords.join(', ')}
Target Audience: ${context.targetAudience}

Memory - Previous Topics: ${JSON.stringify(context.memory.previousTopics || [])}
Memory - Successful Patterns: ${JSON.stringify(context.memory.successfulPatterns || [])}

${this.formatContext(context)}

Extract insights from this article production: successful keywords, writing patterns, publishing recommendations, and content opportunities.`
  }
}
