import { BaseAgent } from './base-agent'
import { AgentExecutionContext, AgentOutput } from '../types/ai'
import { callClaude } from '../services/anthropic'
import { PROMPTS } from '../prompts'

export class OutlineAgent extends BaseAgent {
  async execute(context: AgentExecutionContext): Promise<AgentOutput> {
    const research = context.previousOutputs.get('research') || ''
    const prompt = PROMPTS.outline(context.topic, research, context.tone)
    
    const result = await callClaude({
      prompt,
      systemPrompt: `You are an excellent content strategist. Create a compelling outline that flows naturally and engages the audience.`,
      maxTokens: 2000,
      temperature: 0.8,
    })

    return {
      status: 'success',
      output: {
        outline: result.text,
        sections: result.text.split('\n').filter(l => l.trim().startsWith('-')),
      },
      metadata: {
        duration: Date.now(),
        tokensUsed: result.usage.totalTokens,
        estimatedCost: result.usage.totalTokens * 0.000003,
        model: 'claude-3-5-sonnet',
      },
      usage: result.usage,
      logs: [`Outline created with ${result.text.split('\n').length} sections`],
      errors: [],
      version: 1,
      timestamp: new Date().toISOString(),
    }
  }
}
