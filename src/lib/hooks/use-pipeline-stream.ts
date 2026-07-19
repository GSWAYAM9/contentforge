'use client'

import { useEffect, useState } from 'react'

export interface PipelineEvent {
  type: 'status' | 'update' | 'done' | 'error'
  status?: string
  data?: any
  error?: string
}

export function usePipelineStream(executionId: string) {
  const [event, setEvent] = useState<PipelineEvent | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!executionId) return

    let eventSource: EventSource | null = null

    try {
      eventSource = new EventSource(`/api/pipeline/stream?executionId=${executionId}`)

      eventSource.onopen = () => {
        setIsConnected(true)
        setError(null)
      }

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)
          setEvent(data)

          if (data.type === 'done' || data.type === 'error') {
            eventSource?.close()
            setIsConnected(false)
          }
        } catch (err) {
          console.error('Error parsing SSE data:', err)
        }
      }

      eventSource.onerror = () => {
        setIsConnected(false)
        setError('Connection lost')
        eventSource?.close()
      }
    } catch (err) {
      setError('Failed to connect to stream')
      console.error('Error creating EventSource:', err)
    }

    return () => {
      eventSource?.close()
    }
  }, [executionId])

  return { event, isConnected, error }
}
