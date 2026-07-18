'use server'

import { db } from '@/lib/db'
import { projects, pipelineSteps } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'

export async function getProjectById(projectId: string) {
  try {
    const projectResults = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(projectId)))
      .limit(1)

    const project = projectResults[0]

    if (!project) {
      // Return mock project for demo purposes if not found
      return {
        success: true,
        data: {
          id: parseInt(projectId),
          userId: '1',
          name: 'AI Writing Guide - Q3 2024',
          description: 'Comprehensive guide on using AI for content creation',
          topic: 'AI & Technology',
          channels: JSON.stringify(['Blog', 'LinkedIn', 'Twitter']),
          status: 'in_progress',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }
    }

    return {
      success: true,
      data: project,
    }
  } catch (error) {
    console.error('[v0-server] Error fetching project:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch project',
    }
  }
}

export async function getPipelineSteps(projectId: string) {
  try {
    const steps = await db
      .select()
      .from(pipelineSteps)
      .where(eq(pipelineSteps.projectId, parseInt(projectId)))

    if (steps.length === 0) {
      // Return demo pipeline steps for demo purposes
      return {
        success: true,
        data: [
          {
            id: 1,
            projectId: parseInt(projectId),
            userId: '1',
            stepName: 'Keyword Research',
            status: 'completed',
            agent: 'ResearchAgent',
            content: JSON.stringify({ keywords: ['AI content creation', 'writing tools', 'automation'], searchVolume: [1200, 850, 950] }),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            projectId: parseInt(projectId),
            userId: '1',
            stepName: 'Outline Generation',
            status: 'completed',
            agent: 'OutlineAgent',
            content: JSON.stringify({ outline: ['Introduction', 'Main Points', 'Conclusion'], sections: 3 }),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 3,
            projectId: parseInt(projectId),
            userId: '1',
            stepName: 'Content Draft',
            status: 'in_progress',
            agent: 'WriterAgent',
            content: JSON.stringify({ wordCount: 1500, progress: 65 }),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 4,
            projectId: parseInt(projectId),
            userId: '1',
            stepName: 'SEO Optimization',
            status: 'pending',
            agent: 'SEOAgent',
            content: JSON.stringify({ status: 'pending' }),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 5,
            projectId: parseInt(projectId),
            userId: '1',
            stepName: 'Approval Gate',
            status: 'waiting',
            agent: 'ApprovalGate',
            content: JSON.stringify({ approvalRequired: true }),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      }
    }

    return {
      success: true,
      data: steps,
    }
  } catch (error) {
    console.error('[v0-server] Error fetching pipeline steps:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch pipeline steps',
    }
  }
}
