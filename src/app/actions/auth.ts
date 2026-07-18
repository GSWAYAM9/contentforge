'use server'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { signUpSchema, signInSchema } from '@/lib/schemas/auth'
import { createSession } from '@/lib/auth'
import bcryptjs from 'bcryptjs'
import { eq } from 'drizzle-orm'

export async function registerUser(input: unknown) {
  try {
    const parsed = signUpSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0].message,
      }
    }

    const { name, email, password } = parsed.data

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return {
        success: false,
        error: 'Email already in use',
      }
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await db.insert(users).values({
      id: userId,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    // Create session
    await createSession({
      id: userId,
      email,
      name,
    })

    return {
      success: true,
      message: 'Account created successfully',
    }
  } catch (error) {
    console.error('[auth] Register error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create account. Please try again.',
    }
  }
}

export async function loginUser(input: unknown) {
  try {
    const parsed = signInSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0].message,
      }
    }

    const { email, password } = parsed.data

    // Verify user exists
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    const user = userResults[0]

    if (!user) {
      return {
        success: false,
        error: 'Email not found. Please check or sign up for a new account.',
      }
    }

    if (!user.password) {
      return {
        success: false,
        error: 'User account has no password set',
      }
    }

    // Verify password
    const passwordValid = await bcryptjs.compare(password, user.password)
    if (!passwordValid) {
      return {
        success: false,
        error: 'Incorrect password',
      }
    }

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    return {
      success: true,
      message: 'Signed in successfully',
    }
  } catch (error) {
    console.error('[auth] Login error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to sign in. Please try again.',
    }
  }
}
