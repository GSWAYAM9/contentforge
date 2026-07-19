import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const session = await getSession()
  if (!session?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const executionId = searchParams.get('executionId')

  if (!executionId) {
    return new Response('Missing executionId', { status: 400 })
  }

  // Set up SSE headers
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  }

  const responseStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      try {
        // Lazy import to avoid build-time db access
        const { db } = await import('@/lib/db')
        const { pipelineExecutions } = await import('@/lib/db/schema')
        const { eq } = await import('drizzle-orm')

        // Fetch initial execution data
        const execution = await db.query.pipelineExecutions.findFirst({
          where: eq(pipelineExecutions.id, executionId),
        })

        if (!execution) {
          controller.enqueue(encoder.encode('data: {"error": "Execution not found"}\n\n'))
          controller.close()
          return
        }

        // Send current status
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({
            type: 'status',
            status: execution.status,
            data: JSON.parse(execution.data || '{}'),
          })}\n\n`)
        )

        // Poll for updates every 2 seconds
        const pollInterval = setInterval(async () => {
          try {
            const updated = await db.query.pipelineExecutions.findFirst({
              where: eq(pipelineExecutions.id, executionId),
            })

            if (updated) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({
                  type: 'update',
                  status: updated.status,
                  data: JSON.parse(updated.data || '{}'),
                })}\n\n`)
              )

              // Close stream when execution is completed or failed
              if (updated.status === 'completed' || updated.status === 'failed') {
                controller.enqueue(encoder.encode('data: {"type": "done"}\n\n'))
                clearInterval(pollInterval)
                controller.close()
              }
            }
          } catch (error) {
            console.error('Error polling execution:', error)
            clearInterval(pollInterval)
            controller.close()
          }
        }, 2000)

        // Clean up on client disconnect
        req.signal.addEventListener('abort', () => {
          clearInterval(pollInterval)
          controller.close()
        })
      } catch (error) {
        console.error('Error in SSE stream:', error)
        controller.enqueue(encoder.encode('data: {"error": "Stream error"}\n\n'))
        controller.close()
      }
    },
  })

  return new Response(responseStream, { headers })
}
