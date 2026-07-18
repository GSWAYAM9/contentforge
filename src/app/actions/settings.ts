'use server'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import bcryptjs from 'bcryptjs'
import { z } from 'zod'

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  image: z.string().url('Invalid image URL').optional().nullable(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Get current user profile
export async function getUserProfile() {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1)

    if (!user.length) {
      return { success: false, error: 'User not found' }
    }

    const { password, ...userWithoutPassword } = user[0]
    return { success: true, data: userWithoutPassword }
  } catch (error) {
    console.error('[settings] Error fetching profile:', error)
    return { success: false, error: 'Failed to fetch profile' }
  }
}

// Update profile
export async function updateProfile(input: unknown) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const parsed = updateProfileSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const { name, email, image } = parsed.data

    // Check if email is already in use by another user
    if (email !== session.email) {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (existingUser.length > 0) {
        return { success: false, error: 'Email already in use' }
      }
    }

    // Update user
    await db
      .update(users)
      .set({
        name,
        email,
        image: image || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.id))

    return { success: true, message: 'Profile updated successfully' }
  } catch (error) {
    console.error('[settings] Error updating profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

// Change password
export async function changePassword(input: unknown) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const parsed = changePasswordSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const { currentPassword, newPassword } = parsed.data

    // Get user with password
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1)

    if (!userResult.length) {
      return { success: false, error: 'User not found' }
    }

    const user = userResult[0]
    if (!user.password) {
      return { success: false, error: 'This account does not have a password set' }
    }

    // Verify current password
    const isCurrentPasswordValid = await bcryptjs.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return { success: false, error: 'Current password is incorrect' }
    }

    // Hash new password
    const hashedNewPassword = await bcryptjs.hash(newPassword, 10)

    // Update password
    await db
      .update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, session.id))

    return { success: true, message: 'Password changed successfully' }
  } catch (error) {
    console.error('[settings] Error changing password:', error)
    return { success: false, error: 'Failed to change password' }
  }
}

// Delete account
export async function deleteAccount(password: string) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get user with password
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1)

    if (!userResult.length) {
      return { success: false, error: 'User not found' }
    }

    const user = userResult[0]
    if (!user.password) {
      return { success: false, error: 'This account does not have a password set' }
    }

    // Verify password before deletion
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      return { success: false, error: 'Password is incorrect' }
    }

    // Delete user (cascade will delete related data)
    await db.delete(users).where(eq(users.id, session.id))

    return { success: true, message: 'Account deleted successfully' }
  } catch (error) {
    console.error('[settings] Error deleting account:', error)
    return { success: false, error: 'Failed to delete account' }
  }
}
