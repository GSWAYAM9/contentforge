'use server'

import { db } from '@/lib/db'
import { projects, pipelineSteps } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'

interface ExecutePipelineInput {
  projectId: string | number
  topic?: string
  keywords?: string[]
  contentLength?: 'short' | 'medium' | 'long'
  tone?: string
}

export async function executePipeline(input: ExecutePipelineInput) {
  try {
    const session = await auth()
    if (!session?.id) {
      throw new Error('Unauthorized')
    }

    const projectId = typeof input.projectId === 'string' ? parseInt(input.projectId) : input.projectId

    // Verify project exists and belongs to user
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (!project || project.length === 0) {
      throw new Error('Project not found')
    }

    if (project[0].userId !== session.id) {
      throw new Error('Unauthorized: Project belongs to different user')
    }

    // Create execution ID
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Insert initial pipeline steps for tracking
    const agents = [
      'Keyword Research',
      'Research & Analysis',
      'Content Outlining',
      'Article Writing',
      'SEO Optimization',
      'Social Media Content',
      'Email Marketing Copy',
      'LinkedIn Content',
      'Quality Assurance',
      'Image Generation'
    ]

    for (const agent of agents) {
      await db.insert(pipelineSteps).values({
        projectId,
        userId: session.id,
        stepName: agent,
        agent,
        status: 'pending',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Return execution ID for SSE stream
    return {
      success: true,
      executionId,
      projectId,
      message: 'Pipeline execution started',
    }
  } catch (error) {
    console.error('[pipeline-execution] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to execute pipeline',
    }
  }
}

export async function getPipelineExecution(executionId: string) {
  try {
    const session = await auth()
    if (!session?.id) {
      throw new Error('Unauthorized')
    }

    // This would query execution details
    // For now, return mock data
    return {
      success: true,
      execution: {
        id: executionId,
        status: 'completed',
        progress: 100,
        currentStep: 10,
        totalSteps: 10,
        startedAt: new Date(),
        completedAt: new Date(),
        results: {
          article: 'Generated article content...',
          keywords: ['keyword1', 'keyword2', 'keyword3'],
          seoTitle: 'SEO Optimized Title',
          seoDescription: 'Meta description for SEO',
          socialPosts: {
            twitter: 'Twitter post content',
            linkedin: 'LinkedIn post content',
          },
          emailCopy: 'Email marketing copy...',
          costBreakdown: {
            promptTokens: 2500,
            completionTokens: 1200,
            totalCost: 0.0234,
          }
        }
      }
    }
  } catch (error) {
    console.error('[get-pipeline-execution] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get execution',
    }
  }
}
