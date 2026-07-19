import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

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

    // Check if execution exists
    const result = await db
      .select()
      .from(pipelineExecutions)
      .where(eq(pipelineExecutions.id, executionId))
      .limit(1)

    if (!result.length) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 })
    }

    const execution = result[0]

    // Can only cancel if running or paused
    if (execution.status !== 'running' && execution.status !== 'paused') {
      return NextResponse.json(
        { error: `Cannot cancel execution with status: ${execution.status}` },
        { status: 400 }
      )
    }

    // Update status to cancelled and set completed time
    await db
      .update(pipelineExecutions)
      .set({
        status: 'cancelled',
        completedAt: new Date(),
      })
      .where(eq(pipelineExecutions.id, executionId))

    return NextResponse.json({ success: true, message: 'Pipeline cancelled' })
  } catch (error) {
    console.error('[v0] Pipeline cancel error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to cancel pipeline' },
      { status: 500 }
    )
  }
}
