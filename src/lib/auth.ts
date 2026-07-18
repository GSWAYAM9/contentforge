import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'development-secret-key'
)

export interface AuthUser {
  id: string
  email: string
  name?: string
}

export async function createSession(user: AuthUser) {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })

  return token
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) return null

    const verified = await jwtVerify(token, secret)
    return (verified.payload as any).user || null
  } catch (error) {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

// For next-auth compatibility in case we need it
export const auth = getSession
export const signOut = destroySession
