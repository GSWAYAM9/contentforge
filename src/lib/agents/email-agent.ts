import { BaseAgent } from './base-agent'
import { AgentExecutionContext, AgentOutput } from '../types/ai'
import { callClaude } from '../services/anthropic'
import { PROMPTS } from '../prompts'

export class EmailAgent extends BaseAgent {
  async execute(context: AgentExecutionContext): Promise<AgentOutput> {
    const article = context.previousOutputs.get('article') || ''
    const prompt = PROMPTS.email(article, context.targetAudience)
    
    const result = await callClaude({
      prompt,
      systemPrompt: `Create compelling email copy. Write subject lines and email bodies that drive opens and clicks.`,
      maxTokens: 1200,
      temperature: 0.85,
    })

    return {
      status: 'success',
      output: {
        emailCopy: result.text,
        subject: result.text.split('\n')[0],
      },
      metadata: {
        duration: Date.now(),
        tokensUsed: result.usage.totalTokens,
        estimatedCost: result.usage.totalTokens * 0.000003,
        model: 'claude-3-5-sonnet',
      },
      usage: result.usage,
      logs: [`Email copy generated`],
      errors: [],
      version: 1,
      timestamp: new Date().toISOString(),
    }
  }
}
