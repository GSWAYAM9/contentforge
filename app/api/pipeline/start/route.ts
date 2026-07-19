import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

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

    // Lazy import to avoid build-time db access
    const { db } = await import('@/lib/db')
    const { pipelineExecutions } = await import('@/lib/db/schema')

    // Create pipeline execution
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const steps: any[] = [
      // Phase 1: Content Foundation
      { id: 'step_1', name: 'Keyword Research', agentName: 'Keyword Research', status: 'pending', retries: 0, maxRetries: 3, phase: 'foundation' },
      { id: 'step_2', name: 'Research', agentName: 'Research', status: 'pending', retries: 0, maxRetries: 3, phase: 'foundation' },
      { id: 'step_3', name: 'Outline', agentName: 'Outline', status: 'pending', retries: 0, maxRetries: 3, phase: 'foundation' },
      
      // Phase 2: Content Creation & Refinement
      { id: 'step_4', name: 'Content Writer', agentName: 'Content Writer', status: 'pending', retries: 0, maxRetries: 3, phase: 'creation' },
      { id: 'step_5', name: 'Fact Checker', agentName: 'Fact Checker', status: 'pending', retries: 0, maxRetries: 3, phase: 'creation' },
      { id: 'step_6', name: 'Content Editor', agentName: 'Content Editor', status: 'pending', retries: 0, maxRetries: 3, phase: 'creation' },
      
      // Phase 3: Technical Optimization
      { id: 'step_7', name: 'SEO', agentName: 'SEO', status: 'pending', retries: 0, maxRetries: 3, phase: 'optimization' },
      { id: 'step_8', name: 'Internal Linking', agentName: 'Internal Linking', status: 'pending', retries: 0, maxRetries: 3, phase: 'optimization' },
      { id: 'step_9', name: 'Accessibility', agentName: 'Accessibility', status: 'pending', retries: 0, maxRetries: 3, phase: 'optimization' },
      
      // Phase 4: Distribution & Engagement
      { id: 'step_10', name: 'Social', agentName: 'Social', status: 'pending', retries: 0, maxRetries: 3, phase: 'distribution' },
      { id: 'step_11', name: 'Email', agentName: 'Email', status: 'pending', retries: 0, maxRetries: 3, phase: 'distribution' },
      { id: 'step_12', name: 'LinkedIn', agentName: 'LinkedIn', status: 'pending', retries: 0, maxRetries: 3, phase: 'distribution' },
      
      // Phase 5: Publishing & Learning
      { id: 'step_13', name: 'QA', agentName: 'QA', status: 'pending', retries: 0, maxRetries: 3, phase: 'finalization' },
      { id: 'step_14', name: 'Publish', agentName: 'Publish', status: 'pending', retries: 0, maxRetries: 3, phase: 'finalization' },
      { id: 'step_15', name: 'Learning', agentName: 'Learning', status: 'pending', retries: 0, maxRetries: 3, phase: 'finalization' },
    ]

    const execution: any = {
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
