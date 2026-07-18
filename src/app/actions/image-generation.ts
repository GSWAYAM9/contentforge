'use server'

import OpenAI from 'openai'
import { db } from '@/lib/db'
import { pipelineSteps } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateImageWithOpenAI(prompt: string, style: string = 'realistic') {
  try {
    const enhancedPrompt = `${prompt}. Style: ${style}. Professional blog article featured image. High quality, 1200x630px aspect ratio.`

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
    })

    if (!response.data[0].url) {
      throw new Error('No image URL returned')
    }

    return {
      success: true,
      imageUrl: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
      cost: 0.08, // DALL-E 3 HD cost per image
    }
  } catch (error) {
    console.error('[v0] OpenAI image error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image',
    }
  }
}

export async function generateMultipleImages(prompts: string[]) {
  try {
    const results = []

    for (const prompt of prompts) {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `${prompt}. Professional blog article image. High quality.`,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
      })

      if (response.data[0].url) {
        results.push({
          prompt,
          imageUrl: response.data[0].url,
        })
      }
    }

    return {
      success: true,
      images: results,
      totalCost: results.length * 0.08,
    }
  } catch (error) {
    console.error('[v0] OpenAI batch images error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate images',
    }
  }
}

export async function saveGeneratedImage(
  projectId: number,
  stepId: number,
  imageUrl: string,
  imageName: string
) {
  try {
    // Update the pipeline step with the image URL
    await db
      .update(pipelineSteps)
      .set({
        content: JSON.stringify({
          imageUrl,
          imageName,
          generatedAt: new Date().toISOString(),
        }),
        updatedAt: new Date(),
      })
      .where(eq(pipelineSteps.id, stepId))

    return {
      success: true,
      message: 'Image saved successfully',
    }
  } catch (error) {
    console.error('[v0] Save image error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save image',
    }
  }
}

export async function regenerateImage(projectId: number, stepId: number, newPrompt: string) {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `${newPrompt}. Professional blog article image. High quality.`,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
    })

    if (!response.data[0].url) {
      throw new Error('No image URL returned')
    }

    // Save the new image
    await db
      .update(pipelineSteps)
      .set({
        content: JSON.stringify({
          imageUrl: response.data[0].url,
          regeneratedAt: new Date().toISOString(),
          prompt: newPrompt,
        }),
        updatedAt: new Date(),
      })
      .where(eq(pipelineSteps.id, stepId))

    return {
      success: true,
      imageUrl: response.data[0].url,
      cost: 0.08,
    }
  } catch (error) {
    console.error('[v0] Regenerate image error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to regenerate image',
    }
  }
}
