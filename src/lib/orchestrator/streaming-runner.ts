import { PipelineExecution, PipelineStep, PipelineEvent, AgentExecutionContext } from '../types/ai'
import { PipelineRunner } from './runner'

export class StreamingPipelineRunner extends PipelineRunner {
  private responseWriter: WritableStreamDefaultWriter<Uint8Array> | null = null

  setResponseWriter(writer: WritableStreamDefaultWriter<Uint8Array>): void {
    this.responseWriter = writer
  }

  private async sendSSEEvent(event: PipelineEvent): Promise<void> {
    if (!this.responseWriter) return

    const sseMessage = `data: ${JSON.stringify(event)}\n\n`
    const encoded = new TextEncoder().encode(sseMessage)

    try {
      await this.responseWriter.write(encoded)
    } catch (error) {
      console.error('[v0] Error writing SSE event:', error)
    }
  }

  async runWithStreaming(): Promise<PipelineExecution> {
    // Override event listeners to stream events
    const originalSubscribe = this.subscribe.bind(this)
    
    // Subscribe to events and stream them
    originalSubscribe((event: PipelineEvent) => {
      this.sendSSEEvent(event).catch(err => {
        console.error('[v0] Streaming error:', err)
      })
    })

    // Run the pipeline normally
    return this.run()
  }

  // Helper to close the stream gracefully
  async closeStream(): Promise<void> {
    if (this.responseWriter) {
      try {
        await this.responseWriter.close()
      } catch (error) {
        console.error('[v0] Error closing stream:', error)
      }
    }
  }
}
