import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

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

    const { db } = await import('@/lib/db')
    const { pipelineExecutions } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')

    // Fetch the execution
    const result = await db
      .select()
      .from(pipelineExecutions)
      .where(eq(pipelineExecutions.id, executionId))
      .limit(1)

    if (!result.length) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 })
    }

    const execution = result[0]

    // Update status to running
    await db
      .update(pipelineExecutions)
      .set({ status: 'running' })
      .where(eq(pipelineExecutions.id, executionId))

    // Trigger async pipeline execution to continue from where it paused
    // This would continue from the current step
    resumePipelineAsync(executionId, execution, session.user.id).catch(err => {
      console.error('[v0] Error resuming pipeline:', err)
    })

    return NextResponse.json({ success: true, message: 'Pipeline resumed' })
  } catch (error) {
    console.error('[v0] Pipeline resume error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to resume pipeline' },
      { status: 500 }
    )
  }
}

async function resumePipelineAsync(executionId: string, execution: any, userId: string) {
  try {
    const { ExecutionContext } = await import('@/lib/orchestrator/context')
    const { PipelineRunner } = await import('@/lib/orchestrator/runner')

    const context = new ExecutionContext(execution.data?.context || {})
    const runner = new PipelineRunner(execution, context)

    // Run from current step
    const result = await runner.run()

    const { db } = await import('@/lib/db')
    const { pipelineExecutions } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')

    // Update database with results
    await db
      .update(pipelineExecutions)
      .set({
        status: result.status as any,
        totalCost: result.totalCost,
        totalTokens: result.totalTokens,
        completedAt: result.status === 'completed' ? new Date() : null,
        data: result as any,
      })
      .where(eq(pipelineExecutions.id, executionId))
  } catch (error) {
    console.error('[v0] Error in resumePipelineAsync:', error)

    const { db } = await import('@/lib/db')
    const { pipelineExecutions } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')

    await db
      .update(pipelineExecutions)
      .set({
        status: 'failed',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error during resume',
        } as any,
      })
      .where(eq(pipelineExecutions.id, executionId))
  }
}
