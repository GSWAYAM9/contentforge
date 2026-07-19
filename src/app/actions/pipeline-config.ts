'use server'

import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getSession } from '@/lib/auth'

export interface PipelineConfig {
  tone: 'formal' | 'casual' | 'professional' | 'creative'
  wordCount: number
  targetAudience: string
  keywords: string[]
  enableOutlineApproval: boolean
  enableQAApproval: boolean
  autoPublish: boolean
  selectedPlatforms: string[]
  modelPreference: string
  temperature: number
  maxTokens: number
  customInstructions: string
}

export async function savePipelineConfig(projectId: string, config: PipelineConfig) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const result = await db
      .update(projects)
      .set({
        metadata: JSON.stringify({
          ...config,
          configuredAt: new Date().toISOString(),
        }),
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, parseInt(projectId)), eq(projects.userId, session.id)))
      .returning()

    return { success: true, data: result[0], message: 'Pipeline configuration saved' }
  } catch (error) {
    console.error('Error saving pipeline config:', error)
    return { success: false, error: 'Failed to save configuration' }
  }
}

export async function getPipelineConfig(projectId: string) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, parseInt(projectId)), eq(projects.userId, session.id)),
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const config = project.metadata ? JSON.parse(project.metadata) : null

    return {
      success: true,
      data: config,
    }
  } catch (error) {
    console.error('Error getting pipeline config:', error)
    return { success: false, error: 'Failed to get configuration' }
  }
}
