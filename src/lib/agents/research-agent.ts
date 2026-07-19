import { BaseAgent } from './base-agent'
import { AgentExecutionContext, AgentOutput } from '../types/ai'
import { callClaude } from '../services/anthropic'
import { PROMPTS } from '../prompts'

export class ResearchAgent extends BaseAgent {
  async execute(context: AgentExecutionContext): Promise<AgentOutput> {
    const prompt = PROMPTS.research(context.topic, context.keywords.join(', '), context.targetAudience)
    
    const result = await callClaude({
      prompt,
      systemPrompt: `You are a research specialist. Conduct thorough research on the given topic and provide well-sourced insights.`,
      maxTokens: 3000,
      temperature: 0.7,
    })

    return {
      status: 'success',
      output: {
        research: result.text,
        keyFindings: result.text.split('\n').slice(0, 5),
      },
      metadata: {
        duration: Date.now(),
        tokensUsed: result.usage.totalTokens,
        estimatedCost: result.usage.totalTokens * 0.000003,
        model: 'claude-3-5-sonnet',
      },
      usage: result.usage,
      logs: [`Research completed for topic: ${context.topic}`],
      errors: [],
      version: 1,
      timestamp: new Date().toISOString(),
    }
  }
}
