import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { generateImages } from '../services/openai'

export class ImageGenerationAgent extends BaseAgent {
  constructor() {
    super('Image Generator')
  }

  async execute(context: AgentExecutionContext): Promise<any> {
    const startTime = Date.now()
    const logs: string[] = []
    const errors: string[] = []

    try {
      logs.push(`[${this.agentName}] Starting image generation`)

      // Get article content from previous outputs
      const article = context.previousOutputs?.get('Content Writer') || 'article'
      const outline = context.previousOutputs?.get('Outline') || ''

      // Create image prompts based on article content
      const imagePrompts = this.generateImagePrompts(context.prompt, outline, article)

      logs.push(`[${this.agentName}] Generated ${imagePrompts.length} image prompts`)

      // Generate images
      const generatedImages: string[] = []
      let totalCost = 0

      for (const prompt of imagePrompts) {
        try {
          logs.push(`[${this.agentName}] Generating image for: ${prompt.substring(0, 50)}...`)
          const response = await generateImages({
            prompt,
            size: '1024x1024',
            quality: 'standard',
            quantity: 1,
          })

          if (response.urls.length > 0) {
            generatedImages.push(response.urls[0])
            totalCost += response.cost
          }
          logs.push(`[${this.agentName}] Image generated successfully, cost: $${response.cost.toFixed(4)}`)
        } catch (error) {
          logs.push(`[${this.agentName}] Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`)
          errors.push(error instanceof Error ? error.message : 'Image generation failed')
        }
      }

      const duration = Date.now() - startTime

      return {
        status: generatedImages.length > 0 ? 'success' : 'partial_success',
        output: {
          images: generatedImages,
          imagePrompts,
          imageCount: generatedImages.length,
        },
        metadata: {
          duration,
          tokensUsed: 0,
          estimatedCost: totalCost,
          model: 'dall-e-3',
        },
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
        logs,
        errors,
        version: 1,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      errors.push(errorMessage)
      logs.push(`[${this.agentName}] Fatal error: ${errorMessage}`)

      return {
        status: 'failed',
        output: null,
        metadata: {
          duration,
          tokensUsed: 0,
          estimatedCost: 0,
          model: 'dall-e-3',
        },
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
        logs,
        errors,
        version: 1,
        timestamp: new Date().toISOString(),
      }
    }
  }

  private generateImagePrompts(topic: string, outline: string, article: string): string[] {
    // Generate 3 diverse image prompts for the article
    const prompts = [
      `Professional blog post header image for "${topic}", modern design, clean aesthetic, 4k quality, professional photography style`,
      `Infographic illustration for "${topic}", data visualization, modern colorful design, professional style`,
      `Featured image for article about ${topic}, engaging visual, high quality photography, professional design`,
    ]

    return prompts
  }
}
