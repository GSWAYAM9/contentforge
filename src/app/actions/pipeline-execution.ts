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

    console.log('[v0] executePipeline: Creating pipeline for project', projectId)

    // Call the orchestration engine via API
    const startResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/pipeline/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId: projectId.toString(),
        prompt: input.topic || project[0].topic || 'Untitled Article',
        keywords: input.keywords || [],
        brandVoice: project[0].description || '',
        targetAudience: project[0].description || '',
        tone: input.tone || 'professional',
      }),
    })

    if (!startResponse.ok) {
      const error = await startResponse.json()
      throw new Error(`Failed to start pipeline: ${error.error}`)
    }

    const startData = await startResponse.json()
    const executionId = startData.executionId

    console.log('[v0] executePipeline: Pipeline created with ID', executionId)

    // Now trigger the execution
    const executeResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/pipeline/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        executionId,
      }),
    })

    if (!executeResponse.ok) {
      const error = await executeResponse.json()
      throw new Error(`Failed to execute pipeline: ${error.error}`)
    }

    console.log('[v0] executePipeline: Pipeline execution triggered')

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
