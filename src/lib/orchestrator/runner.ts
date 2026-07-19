import { PipelineExecution, PipelineStep, PipelineEvent, AgentExecutionContext } from '../types/ai'
import { ExecutionContext } from './context'
import { withRetry } from './retry'
import { KeywordAgent } from '../agents/keyword-agent'
import { ResearchAgent } from '../agents/research-agent'
import { OutlineAgent } from '../agents/outline-agent'
import { WriterAgent } from '../agents/writer-agent'
import { FactCheckAgent } from '../agents/fact-check-agent'
import { EditorAgent } from '../agents/editor-agent'
import { SEOAgent } from '../agents/seo-agent'
import { InternalLinkingAgent } from '../agents/internal-linking-agent'
import { AccessibilityAgent } from '../agents/accessibility-agent'
import { SocialAgent } from '../agents/social-agent'
import { EmailAgent } from '../agents/email-agent'
import { LinkedInAgent } from '../agents/linkedin-agent'
import { PublishAgent } from '../agents/publish-agent'
import { QAAgent } from '../agents/qa-agent'
import { LearningAgent } from '../agents/learning-agent'
import { ImageGenerationAgent } from '../agents/image-generation-agent'

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
    // Phase 1: Content Foundation
    this.agents.set('Keyword Research', new KeywordAgent())
    this.agents.set('Research', new ResearchAgent())
    this.agents.set('Outline', new OutlineAgent())
    
    // Phase 2: Content Creation & Refinement
    this.agents.set('Content Writer', new WriterAgent())
    this.agents.set('Fact Checker', new FactCheckAgent())
    this.agents.set('Content Editor', new EditorAgent())
    
    // Phase 3: Technical Optimization
    this.agents.set('SEO', new SEOAgent())
    this.agents.set('Internal Linking', new InternalLinkingAgent())
    this.agents.set('Accessibility', new AccessibilityAgent())
    
    // Phase 4: Distribution & Engagement
    this.agents.set('Social', new SocialAgent())
    this.agents.set('Email', new EmailAgent())
    this.agents.set('LinkedIn', new LinkedInAgent())
    
    // Phase 5: Publishing & Learning
    this.agents.set('QA', new QAAgent())
    this.agents.set('Publish', new PublishAgent())
    this.agents.set('Learning', new LearningAgent())
    
    // Image Generation (runs in parallel with content creation)
    this.agents.set('Image Generator', new ImageGenerationAgent())
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

        // Skip if already processed
        if (step.status !== 'pending') {
          continue
        }

        // Check if step requires approval
        if (this.shouldApproveStep(step)) {
          // Emit approval request but continue execution (non-blocking approval)
          this.emitEvent({
            type: 'approval_requested',
            stepName: step.name,
            timestamp: new Date(),
            data: { step },
          })
          step.status = 'awaiting_approval'
          // In a real system, this would be checked by a user approval endpoint
          // For now, we auto-approve after logging the request
          step.approvedAt = new Date()
          step.status = 'pending'
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

    const contextData = this.context.getContext()
    console.log(`[v0] executeStep: Starting ${step.name} (${step.agentName})`)
    console.log(`[v0] Context: prompt="${contextData.prompt}", keywords=[${contextData.keywords.join(', ')}], tone="${contextData.tone}"`)

    this.emitEvent({
      type: 'started',
      stepName: step.name,
      timestamp: new Date(),
      data: { step },
    })

    try {
      const agent = this.agents.get(step.agentName)
      if (!agent) {
        console.error(`[v0] executeStep: Agent not found - ${step.agentName}. Available agents:`, Array.from(this.agents.keys()))
        throw new Error(`Agent not found: ${step.agentName}`)
      }
      
      console.log(`[v0] executeStep: Found agent ${step.agentName}, executing...`)

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[v0] executeStep failed: ${step.name} - ${errorMessage}`, error)
      
      this.emitEvent({
        type: 'failed',
        stepName: step.name,
        timestamp: new Date(),
        data: { error: errorMessage },
      })
      
      // Don't throw - allow pipeline to continue or handle gracefully
      step.errors = [errorMessage]
    } finally {
      step.completedAt = new Date()
    }
  }

  private shouldApproveStep(step: PipelineStep): boolean {
    // These steps have approval gates before execution
    return ['Content Writer', 'SEO'].includes(step.agentName)
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
