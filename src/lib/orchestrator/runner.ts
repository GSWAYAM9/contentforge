import { PipelineExecution, PipelineStep, PipelineEvent, AgentExecutionContext } from '../types/ai'
import { ExecutionContext } from './context'
import { withRetry } from './retry'
import { KeywordAgent } from '../agents/keyword-agent'
import { WriterAgent } from '../agents/writer-agent'
import { SEOAgent } from '../agents/seo-agent'

export type PipelineEventListener = (event: PipelineEvent) => void

export class PipelineRunner {
  private execution: PipelineExecution
  private context: ExecutionContext
  private eventListeners: PipelineEventListener[] = []
  private agents: Map<string, any> = new Map()

  constructor(execution: PipelineExecution, context: ExecutionContext) {
    this.execution = execution
    this.context = context
    this.initializeAgents()
  }

  private initializeAgents(): void {
    this.agents.set('Keyword Research', new KeywordAgent())
    this.agents.set('Writer', new WriterAgent())
    this.agents.set('SEO', new SEOAgent())
    // More agents will be added here
  }

  subscribe(listener: PipelineEventListener): void {
    this.eventListeners.push(listener)
  }

  private emitEvent(event: PipelineEvent): void {
    this.eventListeners.forEach((listener) => listener(event))
  }

  async run(): Promise<PipelineExecution> {
    this.emitEvent({
      type: 'started',
      stepName: 'Pipeline',
      timestamp: new Date(),
      data: { totalSteps: this.execution.steps.length },
    })

    try {
      for (let i = 0; i < this.execution.steps.length; i++) {
        const step = this.execution.steps[i]
        this.execution.currentStep = i

        // Check if step requires approval
        if (step.status === 'pending' && this.shouldApproveStep(step)) {
          this.emitEvent({
            type: 'approval_requested',
            stepName: step.name,
            timestamp: new Date(),
            data: { step },
          })
          // Wait for approval (in real implementation, this would pause execution)
          continue
        }

        await this.executeStep(step)
      }

      this.execution.status = 'completed'
      this.execution.completedAt = new Date()
      this.execution.totalDuration = new Date().getTime() - this.execution.startedAt.getTime()

      this.emitEvent({
        type: 'completed',
        stepName: 'Pipeline',
        timestamp: new Date(),
        data: { execution: this.execution },
      })
    } catch (error) {
      this.execution.status = 'failed'
      this.emitEvent({
        type: 'failed',
        stepName: 'Pipeline',
        timestamp: new Date(),
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
      })
      throw error
    }

    return this.execution
  }

  private async executeStep(step: PipelineStep): Promise<void> {
    step.status = 'running'
    step.startedAt = new Date()

    this.emitEvent({
      type: 'started',
      stepName: step.name,
      timestamp: new Date(),
      data: { step },
    })

    try {
      const agent = this.agents.get(step.agentName)
      if (!agent) {
        throw new Error(`Agent not found: ${step.agentName}`)
      }

      const output = await withRetry(
        () => agent.execute(this.context.getContext()),
        undefined,
        (attempt, reason) => {
          console.log(`[v0] Retrying ${step.name} (attempt ${attempt}): ${reason.message}`)
          step.retries = attempt
        }
      )

      this.context.addPreviousOutput(step.agentName, output.output)

      step.output = output
      step.status = output.status === 'success' ? 'completed' : 'failed'
      step.duration = output.metadata.duration

      this.execution.totalCost += output.metadata.estimatedCost
      this.execution.totalTokens += output.metadata.tokensUsed

      if (output.status === 'success') {
        this.emitEvent({
          type: 'completed',
          stepName: step.name,
          timestamp: new Date(),
          data: { output, tokensUsed: output.metadata.tokensUsed },
        })
      } else {
        throw new Error(`Agent failed: ${output.errors.join(', ')}`)
      }
    } catch (error) {
      step.status = 'failed'
      this.emitEvent({
        type: 'failed',
        stepName: step.name,
        timestamp: new Date(),
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
      })
      throw error
    } finally {
      step.completedAt = new Date()
    }
  }

  private shouldApproveStep(step: PipelineStep): boolean {
    return ['Writer', 'SEO'].includes(step.agentName)
  }

  getExecution(): PipelineExecution {
    return this.execution
  }

  pause(): void {
    this.execution.status = 'paused'
  }

  resume(): void {
    this.execution.status = 'running'
  }
}
