import { AgentOutput, AgentExecutionContext } from '../types/ai'
import { callClaude, estimateCost } from '../services/anthropic'
import { getPrompt, getSystemPrompt } from '../prompts'
import { getGlobalTracker } from '../services/usage-tracking'

export abstract class BaseAgent {
  protected agentName: string
  protected model: string = 'claude-3-5-sonnet-20241022'

  constructor(agentName: string) {
    this.agentName = agentName
  }

  abstract buildPrompt(context: AgentExecutionContext): string

  async execute(context: AgentExecutionContext): Promise<AgentOutput> {
    const startTime = Date.now()
    const logs: string[] = []
    const errors: string[] = []

    try {
      console.log(`[v0-agent] ${this.agentName} execute() called with context:`, {
        prompt: context.prompt?.substring(0, 50),
        projectId: context.projectId,
        keywords: context.keywords,
        tone: context.tone,
      })
      logs.push(`[${this.agentName}] Starting execution`)

      const prompt = this.buildPrompt(context)
      console.log(`[v0-agent] ${this.agentName} buildPrompt() returned:`, prompt.substring(0, 100))
      logs.push(`[${this.agentName}] Built prompt (${prompt.length} chars)`)
      
      const systemPrompt = getSystemPrompt(this.agentName, context.brandVoice, context.tone)
      console.log(`[v0-agent] ${this.agentName} systemPrompt:`, systemPrompt)
      logs.push(`[${this.agentName}] Calling Claude API`)

      console.log(`[v0-agent] ${this.agentName} calling callClaude()`)
      const response = await callClaude({
        prompt,
        systemPrompt,
        maxTokens: 4096,
        temperature: 0.7,
      })

      console.log(`[v0-agent] ${this.agentName} response received:`, {
        tokens: response.usage.totalTokens,
        promptTokens: response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
      })
      logs.push(`[${this.agentName}] Received response from Claude`)

      const duration = Date.now() - startTime
      const cost = estimateCost(response.usage.promptTokens, response.usage.completionTokens)

      // Track usage globally
      const tracker = getGlobalTracker()
      const executionId = context.projectId || 'unknown'
      tracker.recordUsage({
        executionId,
        stepName: this.agentName,
        agentName: this.agentName,
        model: this.model,
        promptTokens: response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
        totalTokens: response.usage.totalTokens,
        timestamp: new Date(),
        duration,
      })

      logs.push(`[${this.agentName}] Tracked usage: ${response.usage.totalTokens} tokens, $${cost.toFixed(4)}`)

      let output: any = response.text

      // Try to parse JSON if the response looks like JSON
      if (response.text.trim().startsWith('{')) {
        try {
          output = JSON.parse(response.text)
          logs.push(`[${this.agentName}] Parsed JSON response`)
        } catch {
          logs.push(`[${this.agentName}] Could not parse JSON, keeping raw response`)
        }
      }

      return {
        status: 'success',
        output,
        metadata: {
          duration,
          tokensUsed: response.usage.totalTokens,
          estimatedCost: cost,
          model: this.model,
        },
        usage: response.usage,
        logs,
        errors: [],
        version: 1,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      errors.push(errorMessage)
      logs.push(`[${this.agentName}] Error: ${errorMessage}`)

      return {
        status: 'failed',
        output: null,
        metadata: {
          duration,
          tokensUsed: 0,
          estimatedCost: 0,
          model: this.model,
        },
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
        logs,
        errors,
        version: 1,
        timestamp: new Date().toISOString(),
      }
    }
  }

  protected formatContext(context: AgentExecutionContext): string {
    return `
Project: ${context.project?.name || 'Unknown'}
Website: ${context.website}
Target Audience: ${context.targetAudience}
Brand Voice: ${context.brandVoice}
Tone: ${context.tone}
Keywords: ${context.keywords.join(', ')}
Language: ${context.language}
Platform: ${context.targetPlatform}
`.trim()
  }
}
