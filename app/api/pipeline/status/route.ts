import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pipelineExecutions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const executionId = searchParams.get('executionId')

    if (!executionId) {
      return NextResponse.json({ error: 'Missing executionId' }, { status: 400 })
    }

    // Get execution from database
    const result = await db
      .select()
      .from(pipelineExecutions)
      .where(eq(pipelineExecutions.id, executionId))
      .limit(1)

    if (!result.length) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 })
    }

    const execution = result[0]

    return NextResponse.json({
      success: true,
      execution: {
        id: execution.id,
        status: execution.status,
        currentStep: (execution.data as any)?.currentStep || 0,
        totalSteps: (execution.data as any)?.steps?.length || 0,
        totalCost: execution.totalCost,
        totalTokens: execution.totalTokens,
        completedAt: execution.completedAt,
        steps: (execution.data as any)?.steps || [],
      },
    })
  } catch (error) {
    console.error('[v0] Pipeline status error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get pipeline status' },
      { status: 500 }
    )
  }
}
