# ContentForge AI - API Integration Guide

## Overview

ContentForge AI integrates with two powerful APIs:
- **Claude 3.5 Sonnet** (Anthropic) for content generation
- **DALL-E 3** (OpenAI) for image generation

Both APIs are fully configured and ready to use.

---

## Environment Variables Setup

Your API keys have been configured as environment variables:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
```

These are automatically loaded from your Vercel project settings.

---

## Claude API Integration

### Capabilities

1. **Content Generation** - Create blog posts, articles, and marketing content
2. **Outline Generation** - Generate structured outlines with SEO keywords
3. **Keywords Extraction** - Find main, LSI, and long-tail keywords
4. **Content Improvement** - Enhance existing content based on instructions

### Server Actions Location

File: `/src/app/actions/ai-generation.ts`

### Usage Examples

#### 1. Generate Content
```typescript
import { generateContentWithClaude } from '@/app/actions/ai-generation'

const result = await generateContentWithClaude(
  'Write an engaging introduction',
  'AI and Machine Learning'
)

// Response:
// {
//   success: true,
//   content: "...",
//   tokensUsed: 342,
//   cost: 0.0051
// }
```

#### 2. Generate Outline
```typescript
import { generateOutlineWithClaude } from '@/app/actions/ai-generation'

const result = await generateOutlineWithClaude('The Future of AI')

// Response:
// {
//   success: true,
//   outline: {
//     sections: [...],
//     seoKeywords: [...]
//   },
//   tokensUsed: 512
// }
```

#### 3. Generate Keywords
```typescript
import { generateKeywordsWithClaude } from '@/app/actions/ai-generation'

const result = await generateKeywordsWithClaude('Machine Learning')

// Response:
// {
//   success: true,
//   keywords: {
//     mainKeywords: [...],
//     lsiKeywords: [...],
//     longtailKeywords: [...]
//   },
//   tokensUsed: 256
// }
```

#### 4. Improve Content
```typescript
import { improveContentWithClaude } from '@/app/actions/ai-generation'

const result = await improveContentWithClaude(
  'Your existing content here...',
  'Make it more engaging and add more examples'
)

// Response:
// {
//   success: true,
//   improvedContent: "...",
//   tokensUsed: 512
// }
```

### Pricing

Claude 3.5 Sonnet (as of 2024):
- **Input**: $0.003 per 1K tokens
- **Output**: $0.015 per 1K tokens

The action automatically calculates costs for you.

---

## OpenAI API Integration

### Capabilities

1. **DALL-E 3 Image Generation** - Generate high-quality images
2. **Batch Image Generation** - Generate multiple images at once
3. **Image Regeneration** - Regenerate with different prompts
4. **Image Storage** - Save generated images to database

### Server Actions Location

File: `/src/app/actions/image-generation.ts`

### Usage Examples

#### 1. Generate Single Image
```typescript
import { generateImageWithOpenAI } from '@/app/actions/image-generation'

const result = await generateImageWithOpenAI(
  'A futuristic AI assistant helping with content creation',
  'modern and professional'
)

// Response:
// {
//   success: true,
//   imageUrl: "https://...",
//   revisedPrompt: "...",
//   cost: 0.08
// }
```

#### 2. Generate Multiple Images
```typescript
import { generateMultipleImages } from '@/app/actions/image-generation'

const result = await generateMultipleImages([
  'AI and technology',
  'Digital transformation',
  'Future of work'
])

// Response:
// {
//   success: true,
//   images: [...],
//   totalCost: 0.24
// }
```

#### 3. Save Generated Image
```typescript
import { saveGeneratedImage } from '@/app/actions/image-generation'

const result = await saveGeneratedImage(
  projectId,
  stepId,
  imageUrl,
  'Featured Image - AI Article'
)
```

#### 4. Regenerate Image
```typescript
import { regenerateImage } from '@/app/actions/image-generation'

const result = await regenerateImage(
  projectId,
  stepId,
  'New prompt for the image'
)
```

### Pricing

DALL-E 3 HD Quality:
- **Cost**: $0.08 per image

---

## Integration Points in Application

### Project Pipeline

When creating a project pipeline, content generation happens at each stage:

1. **Research Stage** → Claude generates research summary
2. **Outline Stage** → Claude generates structured outline
3. **Keywords Stage** → Claude extracts SEO keywords
4. **Content Stage** → Claude writes the article
5. **Image Stage** → OpenAI generates featured image

### Right Panel Components

- **Output Tab** - Shows rendered markdown from Claude
- **Media Tab** - Displays generated images from OpenAI
- **Comments Tab** - Discussion on generated content
- **Approvals Tab** - Approval workflow for AI outputs

### Analytics

Track API usage in `/dashboard/api-usage`:
- Daily API call counts
- Cost breakdown
- Rate limit monitoring
- Usage trends

---

## Error Handling

Both APIs have built-in error handling:

```typescript
const result = await generateContentWithClaude(prompt, topic)

if (!result.success) {
  console.error('Generation failed:', result.error)
  // Handle error - show user-friendly message
}
```

Common errors:
- **Invalid API Key** - Check environment variables
- **Rate Limit** - Wait before retrying
- **Invalid Model** - Verify model name
- **Max Tokens** - Reduce max_tokens parameter

---

## Best Practices

### Claude

1. **Use Clear Prompts** - More specific = better results
2. **Adjust Max Tokens** - 1K for short, 4K for long content
3. **Verify JSON** - Outline/keywords responses include JSON parsing
4. **Monitor Costs** - Track token usage per project

### OpenAI

1. **Detailed Prompts** - Better prompts = better images
2. **Consistent Style** - Use same style parameter for series
3. **HD Quality** - Use hd for featured images
4. **Caching** - Store URLs to avoid regenerating

---

## Testing

Visit `/test-ai-apis` to test both integrations:
- Test Claude content generation
- Test Claude outline generation
- Test Claude keyword extraction
- Test OpenAI image generation

Results show:
- Success/failure status
- Generated content
- Token usage
- API costs

---

## Monitoring

### Environment Variables
Check that both keys are set in Vercel:
1. Go to Project Settings
2. Environment Variables
3. Verify `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` exist

### API Usage Dashboard
Track all API calls at `/dashboard/api-usage`:
- Total requests today/month
- Cost breakdown
- Rate limit status
- Usage alerts

---

## Troubleshooting

**Claude API returns 404:**
- Verify API key is correct
- Check model name is `claude-3-5-sonnet-20241022`
- Ensure max_tokens is not too high (try 2048)

**OpenAI API returns 400:**
- Verify image size is `1024x1024`
- Check prompt is not too long
- Ensure API key has access to DALL-E 3

**Rate limits hit:**
- Implement exponential backoff in retries
- Check usage dashboard
- Consider rate limiting in UI

---

## Next Steps

1. ✅ Test APIs using `/test-ai-apis`
2. ✅ Review costs in `/dashboard/api-usage`
3. ✅ Integrate into project pipeline
4. ✅ Set up approval workflows
5. ✅ Monitor usage and adjust parameters

Your ContentForge AI platform is now fully integrated with Claude and OpenAI!
