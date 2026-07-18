'use server'

import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255),
  description: z.string().max(1000).optional(),
  topic: z.string().max(255).optional(),
  channels: z.array(z.string()).default([]),
})

async function getUserId() {
  const session = await auth()
  if (!session?.id) {
    throw new Error('Unauthorized: User not found')
  }
  return session.id
}

export async function createProject(input: unknown) {
  try {
    const userId = await getUserId()
    const parsed = createProjectSchema.safeParse(input)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0].message,
      }
    }

    const result = await db
      .insert(projects)
      .values({
        userId,
        name: parsed.data.name,
        description: parsed.data.description,
        topic: parsed.data.topic,
        channels: JSON.stringify(parsed.data.channels),
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return {
      success: true,
      project: result[0],
    }
  } catch (error) {
    console.error('[projects] Create error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create project. Please try again.',
    }
  }
}

export async function getProjects() {
  try {
    const userId = await getUserId()

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt))

    return {
      success: true,
      projects: userProjects,
    }
  } catch (error) {
    console.error('[projects] Get error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch projects. Please try again.',
    }
  }
}

export async function updateProject(
  projectId: number,
  input: { name?: string; description?: string; status?: string }
) {
  try {
    const userId = await getUserId()

    const updated = await db
      .update(projects)
      .set({
        name: input.name,
        description: input.description,
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId) && eq(projects.userId, userId))
      .returning()

    if (updated.length === 0) {
      return {
        success: false,
        error: 'Project not found or you do not have permission',
      }
    }

    return {
      success: true,
      project: updated[0],
    }
  } catch (error) {
    console.error('[projects] Update error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update project. Please try again.',
    }
  }
}

export async function deleteProject(projectId: number) {
  try {
    const userId = await getUserId()

    const deleted = await db
      .delete(projects)
      .where(eq(projects.id, projectId) && eq(projects.userId, userId))
      .returning()

    if (deleted.length === 0) {
      return {
        success: false,
        error: 'Project not found or you do not have permission',
      }
    }

    return {
      success: true,
      message: 'Project deleted successfully',
    }
  } catch (error) {
    console.error('[projects] Delete error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete project. Please try again.',
    }
  }
}
