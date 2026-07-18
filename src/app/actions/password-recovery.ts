'use server'

import { db } from '@/lib/db'
import { users, verificationTokens } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import crypto from 'crypto'
import bcryptjs from 'bcryptjs'

// Note: In production, use a proper email service like SendGrid, Mailgun, or AWS SES
// This is a placeholder that logs to console
async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`
  console.log(`\n📧 PASSWORD RESET EMAIL\nTo: ${email}\nLink: ${resetLink}\n`)
  // In production:
  // await emailService.send({
  //   to: email,
  //   subject: 'Reset Your Password',
  //   html: `Click here to reset your password: <a href="${resetLink}">${resetLink}</a>`
  // })
}

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  email: z.string().email('Invalid email address'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Request password reset
export async function requestPasswordReset(input: unknown) {
  try {
    const parsed = forgotPasswordSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0].message,
      }
    }

    const { email } = parsed.data

    // Check if user exists
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (userResults.length === 0) {
      // Don't reveal if email exists for security
      return {
        success: true,
        message: 'If an account exists, a password reset link has been sent to your email',
      }
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

    // Delete old tokens
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email))

    // Save new token
    await db.insert(verificationTokens).values({
      email,
      token,
      expires: expiresAt,
    })

    // Send email
    await sendPasswordResetEmail(email, token)

    return {
      success: true,
      message: 'If an account exists, a password reset link has been sent to your email',
    }
  } catch (error) {
    console.error('[password-recovery] Error requesting reset:', error)
    return {
      success: false,
      error: 'Failed to process password reset request',
    }
  }
}

// Reset password with token
export async function resetPassword(input: unknown) {
  try {
    const parsed = resetPasswordSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0].message,
      }
    }

    const { token, email, newPassword } = parsed.data

    // Verify token
    const tokenResults = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.email, email))
      .limit(1)

    if (tokenResults.length === 0) {
      return {
        success: false,
        error: 'Invalid or expired password reset link',
      }
    }

    const tokenRecord = tokenResults[0]
    if (tokenRecord.token !== token || new Date() > tokenRecord.expires) {
      return {
        success: false,
        error: 'Invalid or expired password reset link',
      }
    }

    // Update password
    const hashedPassword = await bcryptjs.hash(newPassword, 10)
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email))

    // Delete token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email))

    return {
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    }
  } catch (error) {
    console.error('[password-recovery] Error resetting password:', error)
    return {
      success: false,
      error: 'Failed to reset password',
    }
  }
}

// Verify token
export async function verifyResetToken(token: string, email: string) {
  try {
    const tokenResults = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.email, email))
      .limit(1)

    if (tokenResults.length === 0) {
      return { valid: false, error: 'Invalid token' }
    }

    const tokenRecord = tokenResults[0]
    if (tokenRecord.token !== token) {
      return { valid: false, error: 'Invalid token' }
    }

    if (new Date() > tokenRecord.expires) {
      return { valid: false, error: 'Token has expired' }
    }

    return { valid: true }
  } catch (error) {
    console.error('[password-recovery] Error verifying token:', error)
    return { valid: false, error: 'Error verifying token' }
  }
}
