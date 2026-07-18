import { db } from './db'
import { sessions } from './db/schema'
import { eq } from 'drizzle-orm'

export async function createSession(userId: string, sessionToken: string, expiresAt: Date) {
  try {
    await db.insert(sessions).values({
      sessionToken,
      userId,
      expires: expiresAt,
    })
  } catch (error) {
    console.error('[sessions] Create error:', error)
  }
}

export async function getSession(sessionToken: string) {
  try {
    const session = await db.query.sessions.findFirst({
      where: (sessions, { eq }) => eq(sessions.sessionToken, sessionToken),
    })

    if (!session || session.expires < new Date()) {
      return null
    }

    return session
  } catch (error) {
    console.error('[sessions] Get error:', error)
    return null
  }
}

export async function deleteSession(sessionToken: string) {
  try {
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
  } catch (error) {
    console.error('[sessions] Delete error:', error)
  }
}
