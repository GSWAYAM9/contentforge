import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PipelineExecution } from '@/lib/types/ai'

export const dynamic = 'force-dynamic'

export const maxDuration = 300

async function runPipelineAsync(
  executionId: string,
  execution: PipelineExecution,
  userId: string,
  projectId: string
) {
  try {
    // Lazy imports to avoid build-time issues
    const { ExecutionContext } = await import('@/lib/orchestrator/context')
    const { PipelineRunner } = await import('@/lib/orchestrator/runner')
    const { db } = await import('@/lib/db')
    const { pipelineExecutions } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')

    const context = new ExecutionContext(execution.context)
    const runner = new PipelineRunner(execution, context)

    // Subscribe to events
    runner.subscribe((event) => {
      console.log(`[v0] Pipeline event: ${event.type} - ${event.stepName}`)
    })

    // Run the pipeline
    const result = await runner.run()

    // Update database
    await db
      .update(pipelineExecutions)
      .set({
        status: result.status as any,
        totalCost: result.totalCost,
        totalTokens: result.totalTokens,
        data: result as any,
      })
      .where(eq(pipelineExecutions.id, executionId))

    return result
  } catch (error) {
    console.error('[v0] Pipeline execution error:', error)
    try {
      const { db } = await import('@/lib/db')
      const { pipelineExecutions } = await import('@/lib/db/schema')
      const { eq } = await import('drizzle-orm')
      
      await db
        .update(pipelineExecutions)
        .set({
          status: 'failed',
          data: {
            error: error instanceof Error ? error.message : 'Unknown error',
          } as any,
        })
        .where(eq(pipelineExecutions.id, executionId))
    } catch (dbError) {
      console.error('[v0] Failed to update error status:', dbError)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { executionId } = body

    if (!executionId) {
      return NextResponse.json({ error: 'Missing executionId' }, { status: 400 })
    }

    // Lazy imports to avoid build issues
    const { db } = await import('@/lib/db')
    const { pipelineExecutions } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')

    // Get execution from database
    const result = await db
      .select()
      .from(pipelineExecutions)
      .where(eq(pipelineExecutions.id, executionId))
      .limit(1)

    if (!result.length) {
      console.error('[v0] Execution not found:', executionId)
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 })
    }

    const execution = result[0].data as PipelineExecution
    console.log('[v0] Starting pipeline execution:', executionId)

    // Run pipeline in the background
    runPipelineAsync(executionId, execution, session.user.id, execution.projectId).catch((error) => {
      console.error('[v0] Background pipeline error:', error)
    })

    return NextResponse.json({ success: true, executionId, status: 'running' })
  } catch (error) {
    console.error('[v0] Pipeline execute error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to execute pipeline' },
      { status: 500 }
    )
  }
}
