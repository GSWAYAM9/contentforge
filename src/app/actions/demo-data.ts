'use server'

import { db } from '@/lib/db'
import { projects, pipelineSteps } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function createDemoProject(userId: string) {
  try {
    // Create a demo project
    const projectResult = await db
      .insert(projects)
      .values({
        userId,
        name: 'AI Writing Guide - Q3 2024',
        description: 'Comprehensive guide on using AI for content creation',
        topic: 'AI & Technology',
        channels: JSON.stringify(['Blog', 'LinkedIn', 'Twitter']),
        status: 'in_progress',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    const project = projectResult[0]

    // Create demo pipeline steps with real data
    const stages = [
      {
        stepName: 'Keyword Research',
        status: 'completed',
        agent: 'ResearchAgent',
        content: JSON.stringify({
          keywords: ['AI content creation', 'writing tools', 'automation'],
          searchVolume: [1200, 850, 950],
          difficulty: [35, 28, 32],
          selectedKeyword: 'AI content creation',
        }),
      },
      {
        stepName: 'Outline Generation',
        status: 'completed',
        agent: 'OutlineAgent',
        content: JSON.stringify({
          outline: [
            '1. Introduction to AI Writing',
            '2. Benefits of AI Tools',
            '3. Popular AI Platforms',
            '4. Getting Started Guide',
            '5. Best Practices',
            '6. Common Mistakes',
            '7. Conclusion',
          ],
          estimatedReadTime: 8,
          sections: 7,
        }),
      },
      {
        stepName: 'Content Draft',
        status: 'completed',
        agent: 'WriterAgent',
        content: JSON.stringify({
          wordCount: 2400,
          paragraphs: 12,
          draft: 'AI-generated content draft with proper structure and flow...',
        }),
      },
      {
        stepName: 'SEO Optimization',
        status: 'completed',
        agent: 'SEOAgent',
        content: JSON.stringify({
          metaTitle: 'AI Writing Guide: Complete Guide for Content Creators',
          metaDescription: 'Learn how to use AI tools for content creation...',
          keywordDensity: 2.1,
          readabilityScore: 8.5,
          seoScore: 92,
        }),
      },
      {
        stepName: 'Image Generation',
        status: 'in_progress',
        agent: 'ImageAgent',
        content: JSON.stringify({
          images: [
            { url: '/api/placeholder-1.png', caption: 'AI Tools Landscape', generated: true },
            { url: '/api/placeholder-2.png', caption: 'Content Creation Flow', generated: true },
          ],
          tokensUsed: 450,
          cost: 0.22,
        }),
      },
      {
        stepName: 'Outline Approval',
        status: 'waiting',
        agent: 'ApprovalGate',
        content: JSON.stringify({
          reviewedBy: 'pending',
          approvalRequired: true,
          comments: [],
        }),
      },
      {
        stepName: 'Content Review',
        status: 'pending',
        agent: 'EditorAgent',
        content: JSON.stringify({
          status: 'pending',
          grammarScore: null,
          toneAnalysis: null,
        }),
      },
      {
        stepName: 'Fact Checking',
        status: 'pending',
        agent: 'FactCheckAgent',
        content: JSON.stringify({
          verified: false,
          sources: [],
          issues: [],
        }),
      },
      {
        stepName: 'Final Approval',
        status: 'pending',
        agent: 'ApprovalGate',
        content: JSON.stringify({
          readyToPublish: false,
          approvals: [],
        }),
      },
      {
        stepName: 'LinkedIn Prep',
        status: 'pending',
        agent: 'LinkedInAgent',
        content: JSON.stringify({
          content: '',
          hashtags: [],
          images: null,
        }),
      },
      {
        stepName: 'Twitter Prep',
        status: 'pending',
        agent: 'TwitterAgent',
        content: JSON.stringify({
          threads: [],
          hashtags: [],
        }),
      },
      {
        stepName: 'Blog Publishing',
        status: 'pending',
        agent: 'PublishAgent',
        content: JSON.stringify({
          published: false,
          url: '',
        }),
      },
      {
        stepName: 'Social Publishing',
        status: 'pending',
        agent: 'PublishAgent',
        content: JSON.stringify({
          platforms: ['LinkedIn', 'Twitter'],
          published: false,
        }),
      },
      {
        stepName: 'Analytics',
        status: 'pending',
        agent: 'AnalyticsAgent',
        content: JSON.stringify({
          views: 0,
          clicks: 0,
          shares: 0,
        }),
      },
    ]

    // Create all pipeline steps
    for (const stage of stages) {
      await db.insert(pipelineSteps).values({
        projectId: project.id,
        userId,
        stepName: stage.stepName,
        status: stage.status,
        agent: stage.agent,
        content: stage.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return {
      success: true,
      projectId: project.id,
      message: 'Demo project created successfully',
    }
  } catch (error) {
    console.error('[v0-server] Error creating demo project:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create demo project',
    }
  }
}
