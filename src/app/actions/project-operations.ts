'use server'

import { db } from '@/lib/db'
import { projects, pipelineSteps, approvals } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

// Validation schemas
const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  topic: z.string().max(255).optional(),
  status: z.enum(['draft', 'in_progress', 'completed', 'archived']).optional(),
})

const runPipelineSchema = z.object({
  projectId: z.string(),
  stepName: z.string(),
  prompt: z.string(),
})

const updateStepSchema = z.object({
  stepId: z.number(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed', 'waiting']),
  content: z.string().optional(),
})

// Update project
export async function updateProject(projectId: string, data: z.infer<typeof updateProjectSchema>) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const parsed = updateProjectSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: 'Invalid data' }
    }

    const updateData = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined)
    )

    const result = await db
      .update(projects)
      .set({ ...updateData, updatedAt: new Date() })
      .where(and(eq(projects.id, parseInt(projectId)), eq(projects.userId, session.id)))
      .returning()

    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error updating project:', error)
    return { success: false, error: 'Failed to update project' }
  }
}

// Run pipeline step
export async function runPipelineStep(projectId: string, stepName: string, stepId: number, content: string) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Update step to in_progress
    await db
      .update(pipelineSteps)
      .set({ status: 'in_progress', updatedAt: new Date() })
      .where(eq(pipelineSteps.id, stepId))

    // Simulate execution and update content
    const executedContent = {
      output: content,
      tokensUsed: Math.floor(Math.random() * 1000),
      cost: (Math.random() * 0.05).toFixed(4),
      duration: `${Math.floor(Math.random() * 30) + 5}s`,
      completion: 100,
      logs: `[${new Date().toLocaleTimeString()}] Processing ${stepName}\n[${new Date().toLocaleTimeString()}] Execution completed successfully`,
    }

    // Update step to completed
    const result = await db
      .update(pipelineSteps)
      .set({ 
        status: 'completed', 
        content: JSON.stringify(executedContent),
        updatedAt: new Date()
      })
      .where(eq(pipelineSteps.id, stepId))
      .returning()

    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error running pipeline step:', error)
    
    // Update step to failed
    await db
      .update(pipelineSteps)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(eq(pipelineSteps.id, stepId))

    return { success: false, error: 'Failed to execute step' }
  }
}

// Request approval
export async function requestApproval(projectId: string, stepId: number, stepName: string) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Update step to waiting
    await db
      .update(pipelineSteps)
      .set({ status: 'waiting', updatedAt: new Date() })
      .where(eq(pipelineSteps.id, stepId))

    // Create approval record
    const result = await db
      .insert(approvals)
      .values({
        projectId: parseInt(projectId),
        userId: session.id,
        pipelineStepId: stepId,
        status: 'pending',
      })
      .returning()

    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error requesting approval:', error)
    return { success: false, error: 'Failed to request approval' }
  }
}

// Approve step
export async function approveStep(approvalId: number, feedback?: string) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const result = await db
      .update(approvals)
      .set({ 
        status: 'approved', 
        feedback: feedback,
        approvedBy: session.id,
        approvedAt: new Date()
      })
      .where(eq(approvals.id, approvalId))
      .returning()

    // Get the approval to update the step
    const approval = result[0]
    if (approval) {
      await db
        .update(pipelineSteps)
        .set({ status: 'completed', updatedAt: new Date() })
        .where(eq(pipelineSteps.id, approval.pipelineStepId))
    }

    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error approving step:', error)
    return { success: false, error: 'Failed to approve step' }
  }
}

// Reject step
export async function rejectStep(approvalId: number, feedback: string) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const result = await db
      .update(approvals)
      .set({ 
        status: 'rejected', 
        feedback: feedback,
        approvedBy: session.id,
        approvedAt: new Date()
      })
      .where(eq(approvals.id, approvalId))
      .returning()

    // Get the approval to update the step
    const approval = result[0]
    if (approval) {
      await db
        .update(pipelineSteps)
        .set({ status: 'pending', updatedAt: new Date() })
        .where(eq(pipelineSteps.id, approval.pipelineStepId))
    }

    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error rejecting step:', error)
    return { success: false, error: 'Failed to reject step' }
  }
}

// Delete project
export async function deleteProject(projectId: string) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete pipeline steps first
    await db
      .delete(pipelineSteps)
      .where(eq(pipelineSteps.projectId, parseInt(projectId)))

    // Delete project
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, parseInt(projectId)), eq(projects.userId, session.id)))
      .returning()

    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error deleting project:', error)
    return { success: false, error: 'Failed to delete project' }
  }
}

// Save comment
export async function saveComment(stepId: number, comment: string) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // For now, we'll store comments in step content metadata
    const step = await db
      .select()
      .from(pipelineSteps)
      .where(eq(pipelineSteps.id, stepId))
      .limit(1)

    if (step.length === 0) {
      return { success: false, error: 'Step not found' }
    }

    let content = {}
    try {
      content = JSON.parse(step[0].content || '{}')
    } catch (e) {
      console.error('Failed to parse content:', e)
    }

    // Add comment to content
    if (!content.comments) {
      content.comments = []
    }
    content.comments.push({
      id: Date.now(),
      author: session.email || 'User',
      text: comment,
      timestamp: new Date(),
    })

    const result = await db
      .update(pipelineSteps)
      .set({ content: JSON.stringify(content), updatedAt: new Date() })
      .where(eq(pipelineSteps.id, stepId))
      .returning()

    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error saving comment:', error)
    return { success: false, error: 'Failed to save comment' }
  }
}
