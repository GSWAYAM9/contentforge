/**
 * Usage and Cost Tracking Service
 * Tracks AI model usage, calculates costs, and maintains usage analytics
 */

export interface UsageRecord {
  executionId: string
  stepName: string
  agentName: string
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  inputCost: number
  outputCost: number
  totalCost: number
  timestamp: Date
  duration: number // milliseconds
}

export interface CostBreakdown {
  model: string
  inputTokens: number
  outputTokens: number
  inputCost: number
  outputCost: number
  totalCost: number
}

// Pricing per 1M tokens (as of July 2024)
export const PRICING = {
  'claude-3-5-sonnet-20241022': {
    input: 3, // $3 per 1M input tokens
    output: 15, // $15 per 1M output tokens
  },
  'dall-e-3-standard': {
    // Per image, not per token
    cost: 0.04,
  },
  'dall-e-3-hd': {
    // Per image, not per token
    cost: 0.08,
  },
}

export class UsageTracker {
  private records: UsageRecord[] = []
  private executionUsage: Map<string, UsageRecord[]> = new Map()

  /**
   * Record token usage from an agent call
   */
  recordUsage(record: Omit<UsageRecord, 'totalCost' | 'inputCost' | 'outputCost'>): UsageRecord {
    const costs = this.calculateCosts(record.model, record.promptTokens, record.completionTokens)

    const fullRecord: UsageRecord = {
      ...record,
      ...costs,
    }

    this.records.push(fullRecord)

    // Track by execution
    if (!this.executionUsage.has(record.executionId)) {
      this.executionUsage.set(record.executionId, [])
    }
    this.executionUsage.get(record.executionId)!.push(fullRecord)

    return fullRecord
  }

  /**
   * Calculate costs for token usage
   */
  calculateCosts(
    model: string,
    promptTokens: number,
    completionTokens: number
  ): { inputCost: number; outputCost: number; totalCost: number } {
    const pricing = (PRICING as any)[model]

    if (!pricing) {
      console.warn(`[v0] Unknown model for pricing: ${model}`)
      return { inputCost: 0, outputCost: 0, totalCost: 0 }
    }

    const inputCost = (promptTokens / 1000000) * pricing.input
    const outputCost = (completionTokens / 1000000) * pricing.output
    const totalCost = inputCost + outputCost

    return {
      inputCost: Math.round(inputCost * 10000) / 10000, // Round to 4 decimals
      outputCost: Math.round(outputCost * 10000) / 10000,
      totalCost: Math.round(totalCost * 10000) / 10000,
    }
  }

  /**
   * Get usage for specific execution
   */
  getExecutionUsage(executionId: string): UsageRecord[] {
    return this.executionUsage.get(executionId) || []
  }

  /**
   * Get total cost for execution
   */
  getExecutionTotalCost(executionId: string): number {
    const records = this.getExecutionUsage(executionId)
    return records.reduce((sum, record) => sum + record.totalCost, 0)
  }

  /**
   * Get total tokens for execution
   */
  getExecutionTotalTokens(executionId: string): number {
    const records = this.getExecutionUsage(executionId)
    return records.reduce((sum, record) => sum + record.totalTokens, 0)
  }

  /**
   * Get cost breakdown by model for execution
   */
  getExecutionCostBreakdown(executionId: string): CostBreakdown[] {
    const records = this.getExecutionUsage(executionId)
    const breakdown = new Map<string, CostBreakdown>()

    records.forEach(record => {
      if (!breakdown.has(record.model)) {
        breakdown.set(record.model, {
          model: record.model,
          inputTokens: 0,
          outputTokens: 0,
          inputCost: 0,
          outputCost: 0,
          totalCost: 0,
        })
      }

      const current = breakdown.get(record.model)!
      current.inputTokens += record.promptTokens
      current.outputTokens += record.completionTokens
      current.inputCost += record.inputCost
      current.outputCost += record.outputCost
      current.totalCost += record.totalCost
    })

    return Array.from(breakdown.values())
  }

  /**
   * Get average cost per agent type
   */
  getAverageCostPerAgent(executionId: string): Map<string, number> {
    const records = this.getExecutionUsage(executionId)
    const agentCosts = new Map<string, { total: number; count: number }>()

    records.forEach(record => {
      if (!agentCosts.has(record.agentName)) {
        agentCosts.set(record.agentName, { total: 0, count: 0 })
      }
      const current = agentCosts.get(record.agentName)!
      current.total += record.totalCost
      current.count += 1
    })

    const averages = new Map<string, number>()
    agentCosts.forEach((value, key) => {
      averages.set(key, Math.round((value.total / value.count) * 10000) / 10000)
    })

    return averages
  }

  /**
   * Get usage statistics
   */
  getStatistics(executionId?: string): {
    totalRecords: number
    totalTokens: number
    totalCost: number
    averageTokensPerAgent: number
    averageCostPerAgent: number
    modelBreakdown: { model: string; usage: number; cost: number }[]
  } {
    const records = executionId
      ? this.getExecutionUsage(executionId)
      : this.records

    const totalTokens = records.reduce((sum, r) => sum + r.totalTokens, 0)
    const totalCost = records.reduce((sum, r) => sum + r.totalCost, 0)

    const modelMap = new Map<string, { usage: number; cost: number }>()
    records.forEach(record => {
      if (!modelMap.has(record.model)) {
        modelMap.set(record.model, { usage: 0, cost: 0 })
      }
      const current = modelMap.get(record.model)!
      current.usage += record.totalTokens
      current.cost += record.totalCost
    })

    const modelBreakdown = Array.from(modelMap.entries()).map(([model, data]) => ({
      model,
      usage: data.usage,
      cost: Math.round(data.cost * 10000) / 10000,
    }))

    return {
      totalRecords: records.length,
      totalTokens,
      totalCost: Math.round(totalCost * 10000) / 10000,
      averageTokensPerAgent: records.length > 0 ? Math.round(totalTokens / records.length) : 0,
      averageCostPerAgent:
        records.length > 0 ? Math.round((totalCost / records.length) * 10000) / 10000 : 0,
      modelBreakdown,
    }
  }

  /**
   * Export all records
   */
  exportRecords(): UsageRecord[] {
    return [...this.records]
  }

  /**
   * Clear records (useful for testing)
   */
  clearRecords(): void {
    this.records = []
    this.executionUsage.clear()
  }
}

// Global tracker instance
let globalTracker: UsageTracker | null = null

export function getGlobalTracker(): UsageTracker {
  if (!globalTracker) {
    globalTracker = new UsageTracker()
  }
  return globalTracker
}
