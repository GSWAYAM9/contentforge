import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pipelineExecutions } from '@/lib/db/schema'
import { PipelineExecution, PipelineStep } from '@/lib/types/ai'
import { ExecutionContext } from '@/lib/orchestrator/context'
import { PipelineRunner } from '@/lib/orchestrator/runner'

export const maxDuration = 300

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, prompt, keywords = [], brandVoice = '', targetAudience = '', tone = 'professional' } = body

    if (!projectId || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create pipeline execution
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const steps: PipelineStep[] = [
      { id: 'step_1', name: 'Keyword Research', agentName: 'Keyword Research', status: 'pending', retries: 0, maxRetries: 3 },
      { id: 'step_2', name: 'Research', agentName: 'Research', status: 'pending', retries: 0, maxRetries: 3 },
      { id: 'step_3', name: 'Outline', agentName: 'Outline', status: 'pending', retries: 0, maxRetries: 3 },
      { id: 'step_4', name: 'Writer', agentName: 'Writer', status: 'pending', retries: 0, maxRetries: 3 },
      { id: 'step_5', name: 'SEO', agentName: 'SEO', status: 'pending', retries: 0, maxRetries: 3 },
    ]

    const execution: PipelineExecution = {
      id: executionId,
      projectId,
      status: 'running',
      currentStep: 0,
      steps,
      startedAt: new Date(),
      totalCost: 0,
      totalTokens: 0,
      events: [],
      context: {
        projectId,
        project: { id: projectId },
        website: 'example.com',
        prompt,
        targetAudience,
        brandVoice,
        tone: tone as any,
        keywords,
        research: {},
        previousOutputs: new Map(),
        memory: {
          brandVoice,
          audience: targetAudience,
          writingStyle: '',
          preferredCTA: '',
          frequentKeywords: keywords,
          successfulArticles: [],
          internalUrls: [],
          customInstructions: '',
        },
        userSettings: {},
        language: 'en',
        targetPlatform: 'blog',
      },
    }

    // Save to database
    await db.insert(pipelineExecutions).values({
      id: executionId,
      projectId,
      userId: session.user.id,
      status: 'running',
      totalCost: 0,
      totalTokens: 0,
      data: execution,
    } as any)

    return NextResponse.json({ success: true, executionId, execution })
  } catch (error) {
    console.error('[v0] Pipeline start error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start pipeline' },
      { status: 500 }
    )
  }
}
