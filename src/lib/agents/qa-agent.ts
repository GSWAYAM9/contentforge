import { BaseAgent } from './base-agent'
import { AgentExecutionContext, AgentOutput } from '../types/ai'
import { callClaude } from '../services/anthropic'
import { PROMPTS } from '../prompts'

export class QAAgent extends BaseAgent {
  async execute(context: AgentExecutionContext): Promise<AgentOutput> {
    const content = context.previousOutputs.get('article') || ''
    const prompt = PROMPTS.qa(content, context.keywords.join(', '))
    
    const result = await callClaude({
      prompt,
      systemPrompt: `You are a quality assurance expert. Review the content for accuracy, clarity, engagement, and SEO optimization. Provide constructive feedback.`,
      maxTokens: 2000,
      temperature: 0.5,
    })

    return {
      status: 'success',
      output: {
        feedback: result.text,
        issues: result.text.split('\n').filter(l => l.includes('issue') || l.includes('error')),
        passed: !result.text.toLowerCase().includes('critical'),
      },
      metadata: {
        duration: Date.now(),
        tokensUsed: result.usage.totalTokens,
        estimatedCost: result.usage.totalTokens * 0.000003,
        model: 'claude-3-5-sonnet',
      },
      usage: result.usage,
      logs: [`QA review completed`],
      errors: [],
      version: 1,
      timestamp: new Date().toISOString(),
    }
  }
}
