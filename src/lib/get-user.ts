import { getSession } from '@/lib/auth'

export async function getCurrentUser() {
  const user = await getSession()
  return user || null
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized: User not found')
  }
  return user
}
