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

    // Update execution status to paused
    await db
      .update(pipelineExecutions)
      .set({ status: 'paused' })
      .where(eq(pipelineExecutions.id, executionId))

    return NextResponse.json({ success: true, message: 'Pipeline paused' })
  } catch (error) {
    console.error('[v0] Pipeline pause error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to pause pipeline' },
      { status: 500 }
    )
  }
}
