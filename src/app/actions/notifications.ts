'use server'

import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

const createNotificationSchema = z.object({
  type: z.enum(['project-update', 'approval', 'linkedin', 'system']),
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  actionUrl: z.string().url().optional(),
  icon: z.string().optional(),
})

const markAsReadSchema = z.object({
  notificationId: z.number(),
  read: z.boolean(),
})

// Get all notifications for current user
export async function getNotifications(limit = 20) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, session.id))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)

    return { success: true, data: userNotifications }
  } catch (error) {
    console.error('[notifications] Error fetching:', error)
    return { success: false, error: 'Failed to fetch notifications' }
  }
}

// Get unread notification count
export async function getUnreadCount() {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const result = await db.execute(`
      SELECT COUNT(*) as count 
      FROM notifications 
      WHERE "userId" = $1 AND "read" = false
    `, [session.id])

    const count = result.rows[0]?.count || 0
    return { success: true, data: count }
  } catch (error) {
    console.error('[notifications] Error counting unread:', error)
    return { success: false, error: 'Failed to get unread count' }
  }
}

// Mark notification as read/unread
export async function markNotificationAsRead(input: unknown) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const parsed = markAsReadSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const { notificationId, read } = parsed.data

    await db
      .update(notifications)
      .set({ read })
      .where(eq(notifications.id, notificationId))

    return { success: true }
  } catch (error) {
    console.error('[notifications] Error marking as read:', error)
    return { success: false, error: 'Failed to update notification' }
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, session.id))

    return { success: true }
  } catch (error) {
    console.error('[notifications] Error marking all as read:', error)
    return { success: false, error: 'Failed to update notifications' }
  }
}

// Delete notification
export async function deleteNotification(notificationId: number) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify ownership
    const notif = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notificationId))
      .limit(1)

    if (!notif.length || notif[0].userId !== session.id) {
      return { success: false, error: 'Unauthorized' }
    }

    await db
      .delete(notifications)
      .where(eq(notifications.id, notificationId))

    return { success: true }
  } catch (error) {
    console.error('[notifications] Error deleting:', error)
    return { success: false, error: 'Failed to delete notification' }
  }
}

// Create system notification (used internally)
export async function createNotification(userId: string, input: unknown) {
  try {
    const parsed = createNotificationSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const notification = await db.insert(notifications).values({
      userId,
      type: parsed.data.type,
      title: parsed.data.title,
      message: parsed.data.message,
      actionUrl: parsed.data.actionUrl,
      icon: parsed.data.icon,
      read: false,
      createdAt: new Date(),
    })

    return { success: true, data: notification }
  } catch (error) {
    console.error('[notifications] Error creating:', error)
    return { success: false, error: 'Failed to create notification' }
  }
}

// Clear all notifications
export async function clearAllNotifications() {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    await db
      .delete(notifications)
      .where(eq(notifications.userId, session.id))

    return { success: true }
  } catch (error) {
    console.error('[notifications] Error clearing:', error)
    return { success: false, error: 'Failed to clear notifications' }
  }
}
