import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { getPrompt } from '../prompts'

export class FactCheckAgent extends BaseAgent {
  constructor() {
    super('Fact Checker')
  }

  buildPrompt(context: AgentExecutionContext): string {
    const basePrompt = getPrompt('fact-check')
    const article = context.previousOutputs?.get('Content Writer') || context.prompt

    return `${basePrompt}

Article to verify:
${article}

Topic: ${context.prompt}
Keywords: ${context.keywords.join(', ')}

${this.formatContext(context)}

Review the article for accuracy, verify claims, statistics, and dates. Provide detailed findings.`
  }
}
