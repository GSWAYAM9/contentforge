'use server'

import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateContentWithClaude(prompt: string, topic: string) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are an expert content writer. Generate high-quality content for the following topic and prompt:\n\nTopic: ${topic}\n\nPrompt: ${prompt}\n\nProvide structured, engaging content suitable for blog posts.`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    return {
      success: true,
      content: content.text,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      cost: (message.usage.input_tokens * 0.003 + message.usage.output_tokens * 0.015) / 1000,
    }
  } catch (error) {
    console.error('[v0] Claude API error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate content',
    }
  }
}

export async function generateOutlineWithClaude(topic: string) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Create a detailed blog post outline for: "${topic}"\n\nProvide:
1. Main sections with subsections
2. Key points for each section
3. SEO keywords
4. Estimated word count per section

Format as JSON with structure: { sections: [ { title: string, subsections: string[], keyPoints: string[], estimatedWords: number } ], seoKeywords: string[] }`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Parse JSON response
    let outline
    try {
      outline = JSON.parse(content.text)
    } catch {
      outline = { content: content.text }
    }

    return {
      success: true,
      outline,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    }
  } catch (error) {
    console.error('[v0] Claude outline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate outline',
    }
  }
}

export async function improveContentWithClaude(content: string, instruction: string) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Please improve the following content based on this instruction: "${instruction}"\n\nContent:\n${content}`,
        },
      ],
    })

    const responseContent = message.content[0]
    if (responseContent.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    return {
      success: true,
      improvedContent: responseContent.text,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    }
  } catch (error) {
    console.error('[v0] Claude improvement error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to improve content',
    }
  }
}

export async function generateKeywordsWithClaude(topic: string) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Generate SEO keywords and LSI keywords for: "${topic}"\n\nReturn as JSON: { mainKeywords: string[], lsiKeywords: string[], longtailKeywords: string[] }`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    let keywords
    try {
      keywords = JSON.parse(content.text)
    } catch {
      keywords = { keywords: content.text }
    }

    return {
      success: true,
      keywords,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    }
  } catch (error) {
    console.error('[v0] Claude keywords error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate keywords',
    }
  }
}
