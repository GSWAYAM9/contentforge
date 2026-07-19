import { FailureReason } from '../types/ai'

export interface RetryConfig {
  maxRetries: number
  initialDelay: number
  maxDelay: number
  backoffMultiplier: number
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
}

export function categorizeError(error: any): FailureReason {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('rate limit') || message.includes('429')) {
    return {
      category: 'rate_limit',
      message: 'API rate limit exceeded',
      retryable: true,
    }
  }

  if (message.includes('timeout') || message.includes('timed out')) {
    return {
      category: 'timeout',
      message: 'Request timed out',
      retryable: true,
    }
  }

  if (
    message.includes('401') ||
    message.includes('403') ||
    message.includes('invalid') ||
    message.includes('validation')
  ) {
    return {
      category: 'validation',
      message: 'Invalid input or authentication failed',
      retryable: false,
    }
  }

  if (message.includes('API') || message.includes('server')) {
    return {
      category: 'api',
      message: 'API error occurred',
      retryable: true,
    }
  }

  return {
    category: 'unknown',
    message: message || 'Unknown error',
    retryable: false,
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onRetry?: (attempt: number, error: FailureReason) => void
): Promise<T> {
  let lastError: FailureReason | null = null

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = categorizeError(error)

      if (!lastError.retryable || attempt === config.maxRetries) {
        throw error
      }

      const delay = Math.min(
        config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
        config.maxDelay
      )

      onRetry?.(attempt + 1, lastError)
      console.log(`[v0] Retry attempt ${attempt + 1}/${config.maxRetries} after ${delay}ms`)

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error('Max retries exceeded')
}

export function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  return Math.min(
    config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
    config.maxDelay
  )
}
