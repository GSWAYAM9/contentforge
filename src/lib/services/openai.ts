import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ImageGenerationRequest {
  prompt: string
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792'
  quality?: 'standard' | 'hd'
  quantity?: number
}

export interface ImageGenerationResponse {
  urls: string[]
  usage: {
    promptTokens: number
  }
  cost: number
}

export async function generateImages(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: request.prompt,
      n: request.quantity || 1,
      size: request.size || '1024x1024',
      quality: request.quality || 'hd',
      style: 'vivid',
    })

    const urls = response.data.map((img) => img.url || '').filter(Boolean)

    // Estimate cost for DALL-E 3
    const costPerImage = request.quality === 'hd' ? 0.02 : 0.01
    const totalCost = costPerImage * (request.quantity || 1)

    return {
      urls,
      usage: {
        promptTokens: Math.ceil(request.prompt.length / 4), // Approximate
      },
      cost: totalCost,
    }
  } catch (error) {
    console.error('[v0] OpenAI image generation error:', error)
    throw new Error(
      `Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function generateImageBatch(
  prompts: string[],
  quality: 'standard' | 'hd' = 'hd'
): Promise<{ [prompt: string]: string[] }> {
  const results: { [prompt: string]: string[] } = {}

  for (const prompt of prompts) {
    try {
      const response = await generateImages({
        prompt,
        size: '1024x1024',
        quality,
      })
      results[prompt] = response.urls
    } catch (error) {
      console.error(`[v0] Failed to generate image for prompt: ${prompt}`, error)
      results[prompt] = []
    }
  }

  return results
}
