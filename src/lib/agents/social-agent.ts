import { BaseAgent } from './base-agent'
import { AgentExecutionContext, AgentOutput } from '../types/ai'
import { callClaude } from '../services/anthropic'
import { PROMPTS } from '../prompts'

export class SocialAgent extends BaseAgent {
  async execute(context: AgentExecutionContext): Promise<AgentOutput> {
    const article = context.previousOutputs.get('article') || ''
    const prompt = PROMPTS.social(article, context.keywords.join(', '))
    
    const result = await callClaude({
      prompt,
      systemPrompt: `Create engaging social media posts. Write multiple variations for Twitter, LinkedIn, Instagram, and Facebook that drive engagement.`,
      maxTokens: 1500,
      temperature: 0.9,
    })

    return {
      status: 'success',
      output: {
        socialPosts: result.text,
        twitter: [],
        linkedin: [],
        instagram: [],
      },
      metadata: {
        duration: Date.now(),
        tokensUsed: result.usage.totalTokens,
        estimatedCost: result.usage.totalTokens * 0.000003,
        model: 'claude-3-5-sonnet',
      },
      usage: result.usage,
      logs: [`Social media posts generated`],
      errors: [],
      version: 1,
      timestamp: new Date().toISOString(),
    }
  }
}
