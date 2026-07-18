'use server'

import { db } from '@/lib/db'
import { auditLogs } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

const createActivitySchema = z.object({
  action: z.string().min(1).max(255),
  category: z.enum(['auth', 'project', 'profile', 'settings', 'integration', 'content']).optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
})

// Get activity logs for current user
export async function getActivityLogs(limit = 50, offset = 0) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, session.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset)

    const total = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, session.id))

    return { 
      success: true, 
      data: logs,
      total: total.length,
    }
  } catch (error) {
    console.error('[activity-logs] Error fetching:', error)
    return { success: false, error: 'Failed to fetch activity logs' }
  }
}

// Create activity log entry
export async function createActivityLog(input: unknown) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const parsed = createActivitySchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const log = await db.insert(auditLogs).values({
      userId: session.id,
      action: parsed.data.action,
      category: parsed.data.category || 'system',
      description: parsed.data.description,
      metadata: parsed.data.metadata ? JSON.stringify(parsed.data.metadata) : null,
      ipAddress: parsed.data.ipAddress,
      userAgent: parsed.data.userAgent,
      createdAt: new Date(),
    })

    return { success: true, data: log }
  } catch (error) {
    console.error('[activity-logs] Error creating:', error)
    return { success: false, error: 'Failed to create activity log' }
  }
}

// Get logs by category
export async function getActivityLogsByCategory(category: string, limit = 50) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, session.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)

    return { success: true, data: logs }
  } catch (error) {
    console.error('[activity-logs] Error fetching by category:', error)
    return { success: false, error: 'Failed to fetch activity logs' }
  }
}

// Get activity summary (for dashboard)
export async function getActivitySummary() {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, session.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(100)

    // Group by category and count
    const summary: Record<string, number> = {}
    logs.forEach((log) => {
      const category = log.category || 'system'
      summary[category] = (summary[category] || 0) + 1
    })

    // Get last activity
    const lastActivity = logs[0] || null

    return { 
      success: true, 
      data: {
        summary,
        lastActivity,
        totalLogs: logs.length,
      }
    }
  } catch (error) {
    console.error('[activity-logs] Error getting summary:', error)
    return { success: false, error: 'Failed to get activity summary' }
  }
}

// Log specific actions (helper functions)
export async function logProjectCreation(projectName: string) {
  return createActivityLog({
    action: `Created project: ${projectName}`,
    category: 'project',
    description: `New project "${projectName}" was created`,
  })
}

export async function logProjectUpdate(projectName: string, changes: string) {
  return createActivityLog({
    action: `Updated project: ${projectName}`,
    category: 'project',
    description: changes,
  })
}

export async function logProjectDelete(projectName: string) {
  return createActivityLog({
    action: `Deleted project: ${projectName}`,
    category: 'project',
    description: `Project "${projectName}" was permanently deleted`,
  })
}

export async function logProfileUpdate(changes: string) {
  return createActivityLog({
    action: 'Updated profile',
    category: 'profile',
    description: changes,
  })
}

export async function logPasswordChange() {
  return createActivityLog({
    action: 'Changed password',
    category: 'auth',
    description: 'User password was changed',
  })
}

export async function logLogin() {
  return createActivityLog({
    action: 'Logged in',
    category: 'auth',
    description: 'User successfully logged in',
  })
}

export async function logLogout() {
  return createActivityLog({
    action: 'Logged out',
    category: 'auth',
    description: 'User logged out',
  })
}

export async function logIntegration(integration: string, action: string) {
  return createActivityLog({
    action: `${action}: ${integration}`,
    category: 'integration',
    description: `${integration} integration was ${action.toLowerCase()}`,
  })
}
