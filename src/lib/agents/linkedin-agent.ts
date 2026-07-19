import { BaseAgent } from './base-agent'
import { AgentExecutionContext, AgentOutput } from '../types/ai'
import { callClaude } from '../services/anthropic'
import { PROMPTS } from '../prompts'

export class LinkedInAgent extends BaseAgent {
  async execute(context: AgentExecutionContext): Promise<AgentOutput> {
    const article = context.previousOutputs.get('article') || ''
    const prompt = PROMPTS.linkedin(article, context.keywords.join(', '))
    
    const result = await callClaude({
      prompt,
      systemPrompt: `Create professional LinkedIn content. Write posts that establish thought leadership and drive engagement from professionals.`,
      maxTokens: 1000,
      temperature: 0.75,
    })

    return {
      status: 'success',
      output: {
        linkedinContent: result.text,
      },
      metadata: {
        duration: Date.now(),
        tokensUsed: result.usage.totalTokens,
        estimatedCost: result.usage.totalTokens * 0.000003,
        model: 'claude-3-5-sonnet',
      },
      usage: result.usage,
      logs: [`LinkedIn content generated`],
      errors: [],
      version: 1,
      timestamp: new Date().toISOString(),
    }
  }
}
