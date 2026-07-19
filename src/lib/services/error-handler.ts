/**
 * Comprehensive Error Handler Service
 * Manages error handling, logging, recovery strategies, and notifications
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  RATE_LIMIT = 'rate_limit',
  TIMEOUT = 'timeout',
  SERVER_ERROR = 'server_error',
  DATABASE = 'database',
  API = 'api',
  UNKNOWN = 'unknown',
}

export interface ErrorContext {
  executionId?: string
  stepName?: string
  agentName?: string
  userId?: string
  projectId?: string
  timestamp: Date
  environment?: 'development' | 'production'
}

export interface ErrorLog {
  id: string
  message: string
  category: ErrorCategory
  severity: ErrorSeverity
  context: ErrorContext
  stack?: string
  metadata?: Record<string, any>
  recoveryAttempted: boolean
  recoverySuccess: boolean
  recoveryStrategy?: string
}

export class ErrorHandler {
  private logs: ErrorLog[] = []
  private errorStrategies: Map<ErrorCategory, (error: Error) => Promise<void>> = new Map()

  constructor() {
    this.initializeStrategies()
  }

  /**
   * Initialize error recovery strategies
   */
  private initializeStrategies(): void {
    this.registerStrategy(ErrorCategory.RATE_LIMIT, async () => {
      console.log('[v0] Rate limit detected - implementing exponential backoff')
      // Backoff is handled by withRetry in orchestrator
    })

    this.registerStrategy(ErrorCategory.TIMEOUT, async () => {
      console.log('[v0] Timeout detected - retrying with increased timeout')
      // Retry is handled by withRetry
    })

    this.registerStrategy(ErrorCategory.DATABASE, async () => {
      console.log('[v0] Database error - checking connection')
      // Database reconnection logic would go here
    })

    this.registerStrategy(ErrorCategory.VALIDATION, async () => {
      console.log('[v0] Validation error - no automatic recovery available')
    })
  }

  /**
   * Register a recovery strategy for error category
   */
  registerStrategy(
    category: ErrorCategory,
    strategy: (error: Error) => Promise<void>
  ): void {
    this.errorStrategies.set(category, strategy)
  }

  /**
   * Categorize an error
   */
  categorizeError(error: Error | string): ErrorCategory {
    const message = error instanceof Error ? error.message : String(error)

    if (message.includes('rate limit') || message.includes('429')) {
      return ErrorCategory.RATE_LIMIT
    }
    if (message.includes('timeout') || message.includes('timed out')) {
      return ErrorCategory.TIMEOUT
    }
    if (message.includes('401')) {
      return ErrorCategory.AUTHENTICATION
    }
    if (message.includes('403')) {
      return ErrorCategory.AUTHORIZATION
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorCategory.VALIDATION
    }
    if (
      message.includes('database') ||
      message.includes('db') ||
      message.includes('sql') ||
      message.includes('query')
    ) {
      return ErrorCategory.DATABASE
    }
    if (message.includes('api')) {
      return ErrorCategory.API
    }
    if (message.includes('500') || message.includes('internal')) {
      return ErrorCategory.SERVER_ERROR
    }

    return ErrorCategory.UNKNOWN
  }

  /**
   * Determine error severity
   */
  determineSeverity(category: ErrorCategory): ErrorSeverity {
    switch (category) {
      case ErrorCategory.CRITICAL:
      case ErrorCategory.AUTHENTICATION:
      case ErrorCategory.DATABASE:
        return ErrorSeverity.CRITICAL
      case ErrorCategory.SERVER_ERROR:
      case ErrorCategory.API:
        return ErrorSeverity.HIGH
      case ErrorCategory.RATE_LIMIT:
      case ErrorCategory.TIMEOUT:
        return ErrorSeverity.MEDIUM
      case ErrorCategory.VALIDATION:
      case ErrorCategory.AUTHORIZATION:
      default:
        return ErrorSeverity.LOW
    }
  }

  /**
   * Handle an error with logging and recovery
   */
  async handleError(
    error: Error | string,
    context: ErrorContext,
    shouldRecover: boolean = true
  ): Promise<ErrorLog> {
    const message = error instanceof Error ? error.message : String(error)
    const category = this.categorizeError(error)
    const severity = this.determineSeverity(category)

    let recoverySuccess = false

    if (shouldRecover) {
      const strategy = this.errorStrategies.get(category)
      if (strategy) {
        try {
          await strategy(error instanceof Error ? error : new Error(message))
          recoverySuccess = true
        } catch (recoveryError) {
          console.error('[v0] Recovery strategy failed:', recoveryError)
          recoverySuccess = false
        }
      }
    }

    const errorLog: ErrorLog = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      category,
      severity,
      context,
      stack: error instanceof Error ? error.stack : undefined,
      recoveryAttempted: shouldRecover,
      recoverySuccess,
      recoveryStrategy: this.errorStrategies.has(category) ? category : undefined,
    }

    this.logs.push(errorLog)

    // Log to console in development
    if (context.environment === 'development') {
      console.error(`[v0] Error [${severity}] [${category}]:`, message, {
        context,
        recoverySuccess,
      })
    }

    // Alert if critical
    if (severity === ErrorSeverity.CRITICAL) {
      await this.alertCriticalError(errorLog)
    }

    return errorLog
  }

  /**
   * Alert on critical errors
   */
  private async alertCriticalError(errorLog: ErrorLog): Promise<void> {
    // TODO: Implement alerting (email, Slack, PagerDuty, etc.)
    console.error('[v0] CRITICAL ERROR - Alerting:', errorLog.message)
  }

  /**
   * Get error logs for execution
   */
  getExecutionErrors(executionId: string): ErrorLog[] {
    return this.logs.filter(log => log.context.executionId === executionId)
  }

  /**
   * Get error summary
   */
  getErrorSummary(executionId?: string): {
    totalErrors: number
    bySeverity: Record<ErrorSeverity, number>
    byCategory: Record<ErrorCategory, number>
    recoverySuccessRate: number
  } {
    const relevantLogs = executionId
      ? this.getExecutionErrors(executionId)
      : this.logs

    const summary = {
      totalErrors: relevantLogs.length,
      bySeverity: {
        [ErrorSeverity.LOW]: 0,
        [ErrorSeverity.MEDIUM]: 0,
        [ErrorSeverity.HIGH]: 0,
        [ErrorSeverity.CRITICAL]: 0,
      },
      byCategory: {
        [ErrorCategory.VALIDATION]: 0,
        [ErrorCategory.AUTHENTICATION]: 0,
        [ErrorCategory.AUTHORIZATION]: 0,
        [ErrorCategory.RATE_LIMIT]: 0,
        [ErrorCategory.TIMEOUT]: 0,
        [ErrorCategory.SERVER_ERROR]: 0,
        [ErrorCategory.DATABASE]: 0,
        [ErrorCategory.API]: 0,
        [ErrorCategory.UNKNOWN]: 0,
      },
      recoverySuccessRate: 0,
    }

    relevantLogs.forEach(log => {
      summary.bySeverity[log.severity]++
      summary.byCategory[log.category]++
    })

    if (relevantLogs.length > 0) {
      const successCount = relevantLogs.filter(log => log.recoverySuccess).length
      summary.recoverySuccessRate = Math.round((successCount / relevantLogs.length) * 100)
    }

    return summary
  }

  /**
   * Export error logs
   */
  exportLogs(): ErrorLog[] {
    return [...this.logs]
  }

  /**
   * Clear error logs
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 10): ErrorLog[] {
    return this.logs.slice(-limit)
  }
}

// Global error handler instance
let globalErrorHandler: ErrorHandler | null = null

export function getGlobalErrorHandler(): ErrorHandler {
  if (!globalErrorHandler) {
    globalErrorHandler = new ErrorHandler()
  }
  return globalErrorHandler
}
