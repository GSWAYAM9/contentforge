import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface ClaudeRequest {
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

export interface ClaudeResponse {
  text: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  stopReason: string
}

export async function callClaude(request: ClaudeRequest): Promise<ClaudeResponse> {
  try {
    console.log('[v0-anthropic] callClaude() called')
    console.log('[v0-anthropic] API Key exists:', !!process.env.ANTHROPIC_API_KEY)
    console.log('[v0-anthropic] Request:', {
      promptLength: request.prompt?.length,
      systemPromptLength: request.systemPrompt?.length,
      maxTokens: request.maxTokens,
    })

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
      system: request.systemPrompt,
      messages: [
        {
          role: 'user',
          content: request.prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    return {
      text: content.text,
      usage: {
        promptTokens: message.usage.input_tokens,
        completionTokens: message.usage.output_tokens,
        totalTokens: message.usage.input_tokens + message.usage.output_tokens,
      },
      stopReason: message.stop_reason,
    }
  } catch (error) {
    console.error('[v0] Claude API error:', error)
    throw new Error(`Claude API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function claudeStreamingCall(
  request: ClaudeRequest,
  onChunk: (text: string) => void
): Promise<ClaudeResponse> {
  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
      system: request.systemPrompt,
      messages: [
        {
          role: 'user',
          content: request.prompt,
        },
      ],
    })

    let fullText = ''
    let totalInputTokens = 0
    let totalOutputTokens = 0

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullText += event.delta.text
        onChunk(event.delta.text)
      } else if (event.type === 'message_start') {
        totalInputTokens = event.message.usage.input_tokens
      } else if (event.type === 'message_delta') {
        totalOutputTokens = event.usage.output_tokens
      }
    }

    return {
      text: fullText,
      usage: {
        promptTokens: totalInputTokens,
        completionTokens: totalOutputTokens,
        totalTokens: totalInputTokens + totalOutputTokens,
      },
      stopReason: 'end_turn',
    }
  } catch (error) {
    console.error('[v0] Claude streaming error:', error)
    throw new Error(`Claude streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function estimateCost(promptTokens: number, completionTokens: number): number {
  // Claude 3.5 Sonnet pricing: $3 per million input tokens, $15 per million output tokens
  return promptTokens * 0.000003 + completionTokens * 0.000015
}
