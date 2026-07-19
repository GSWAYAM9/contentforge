import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const executionId = searchParams.get('executionId')

  if (!executionId) {
    return NextResponse.json({ error: 'Missing executionId' }, { status: 400 })
  }

  try {
    const { db } = await import('@/lib/db')
    const { pipelineExecutions } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')

    const execution = await db.query.pipelineExecutions.findFirst({
      where: eq(pipelineExecutions.id, executionId),
    })

    if (!execution) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 })
    }

    const data = JSON.parse(execution.data || '{}')

    return NextResponse.json({
      executionId,
      status: execution.status,
      createdAt: execution.createdAt,
      updatedAt: execution.updatedAt,
      steps: data.steps?.map((step: any) => ({
        name: step.name,
        agentName: step.agentName,
        status: step.status,
        retries: step.retries,
        duration: step.duration,
        error: step.output?.errors?.[0],
      })),
      currentStep: data.currentStep,
      totalCost: data.totalCost,
      totalTokens: data.totalTokens,
    })
  } catch (error) {
    console.error('[v0] Debug endpoint error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Debug error' },
      { status: 500 }
    )
  }
}
