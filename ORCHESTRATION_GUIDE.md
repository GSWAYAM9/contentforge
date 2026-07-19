# ContentForge AI Orchestration Engine

## Overview

The orchestration engine is a production-grade, multi-agent AI system that coordinates specialized agents to execute complex content generation pipelines. It resembles modern AI platforms like Cursor, Devin, and Manus.

## Architecture

### Core Components

#### 1. **Execution Context** (`src/lib/orchestrator/context.ts`)
Manages the entire pipeline's execution state and memory.

```typescript
const context = new ExecutionContext({
  projectId: '123',
  prompt: 'Write about AI safety',
  brandVoice: 'professional',
  keywords: ['AI', 'safety', 'ethics'],
});

// Update memory for future runs
context.updateMemory({
  writingStyle: 'technical',
  preferredCTA: 'Learn more',
});

// Access previous agent outputs
const keywordOutput = context.getPreviousOutput('Keyword Research');
```

#### 2. **Pipeline Runner** (`src/lib/orchestrator/runner.ts`)
Orchestrates multi-agent pipeline execution with event emission and retry logic.

```typescript
const execution: PipelineExecution = {
  id: 'exec_123',
  projectId: '456',
  status: 'running',
  steps: [
    { name: 'Keyword Research', agentName: 'Keyword Research', status: 'pending' },
    { name: 'Writer', agentName: 'Writer', status: 'pending' },
  ],
  // ... other fields
};

const runner = new PipelineRunner(execution, context);
runner.subscribe((event) => {
  console.log(`Event: ${event.type} - ${event.stepName}`);
});

await runner.run();
```

#### 3. **Agent System** (`src/lib/agents/`)
- **Base Agent**: Abstract class with standard interface
- **Specific Agents**: KeywordAgent, WriterAgent, SEOAgent, etc.

Each agent executes independently and returns structured output:

```typescript
export interface AgentOutput {
  status: 'success' | 'failed' | 'warning'
  output: any                          // Agent's result
  metadata: {
    duration: number
    tokensUsed: number
    estimatedCost: number
    model: string
  }
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  logs: string[]
  errors: string[]
}
```

#### 4. **AI Services** (`src/lib/services/`)
- **Anthropic**: Claude integration with streaming support
- **OpenAI**: DALL-E image generation

```typescript
import { callClaude, claudeStreamingCall } from '@/lib/services';

// Non-streaming
const response = await callClaude({
  prompt: 'Generate article outline',
  systemPrompt: 'You are a content strategist',
  maxTokens: 2048,
});

// Streaming with callbacks
await claudeStreamingCall({
  prompt: 'Write article',
}, (chunk) => {
  console.log('Received chunk:', chunk);
});
```

#### 5. **Retry System** (`src/lib/orchestrator/retry.ts`)
Handles failures with exponential backoff and categorization.

```typescript
import { withRetry, categorizeError } from '@/lib/orchestrator';

const result = await withRetry(
  () => agent.execute(context),
  {
    maxRetries: 3,
    initialDelay: 1000,
    backoffMultiplier: 2,
  },
  (attempt, reason) => {
    console.log(`Retry ${attempt}: ${reason.message}`);
  }
);
```

#### 6. **Prompt Management** (`src/lib/prompts/`)
Centralized, versioned prompt system without hardcoding.

```typescript
import { getPrompt, getSystemPrompt } from '@/lib/prompts';

const prompt = getPrompt('keyword-research', {
  topic: 'AI Safety',
  website: 'example.com',
});

const systemPrompt = getSystemPrompt(
  'SEO Optimizer',
  'professional and technical',
  'formal'
);
```

## Pipeline Execution Flow

```
┌─────────────────┐
│ Start Pipeline  │
└────────┬────────┘
         │
    ┌────v─────────────────────────────┐
    │ 1. Keyword Research              │
    │    - Extract keywords            │
    │    - Analyze intent              │
    │    - Calculate difficulty        │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 2. Research                      │
    │    - Gather facts                │
    │    - Find sources                │
    │    - Identify gaps               │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 3. Outline                       │
    │    - Create H1/H2/H3             │
    │    - Plan sections               │
    │    - Estimate word count         │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ [APPROVAL GATE]                  │
    │ - Manual review required         │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 4. Writer                        │
    │    - Generate markdown article   │
    │    - Include formatting          │
    │    - Add CTA                     │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 5. Fact Check                    │
    │    - Verify claims               │
    │    - Check statistics            │
    │    - Validate dates              │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 6. Editor                        │
    │    - Fix grammar                 │
    │    - Improve flow                │
    │    - Ensure consistency          │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 7. SEO Optimizer                 │
    │    - Generate meta tags          │
    │    - Optimize headings           │
    │    - Create schema markup        │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 8. Internal Linking              │
    │    - Suggest internal links      │
    │    - Optimize anchor text        │
    │    - Plan placement              │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 9. Image Generation              │
    │    - Generate hero image         │
    │    - Create social cards         │
    │    - Store metadata              │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 10. Accessibility Check          │
    │     - Verify alt text            │
    │     - Check contrast             │
    │     - Test readability           │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 11. Master QA                    │
    │     - Final validation           │
    │     - Quality score              │
    │     - Pass/Fail decision         │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ [APPROVAL GATE]                  │
    │ - Final review before publish    │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 12. Publisher                    │
    │     - Publish to platforms       │
    │     - Schedule posts             │
    │     - Create backups             │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ 13. Analytics & Learning         │
    │     - Track performance          │
    │     - Update memory              │
    │     - Extract insights           │
    └────┬─────────────────────────────┘
         │
    ┌────v─────────────────────────────┐
    │ Pipeline Complete                │
    └──────────────────────────────────┘
```

## API Routes

### Start Pipeline
**POST** `/api/pipeline/start`

```json
{
  "projectId": "123",
  "prompt": "Write about React hooks",
  "keywords": ["React", "hooks", "useState"],
  "brandVoice": "Technical but accessible",
  "targetAudience": "Web developers",
  "tone": "professional"
}
```

Response:
```json
{
  "success": true,
  "executionId": "exec_123456",
  "execution": { /* PipelineExecution object */ }
}
```

### Check Pipeline Status
**GET** `/api/pipeline/status?executionId=exec_123456`

Response:
```json
{
  "success": true,
  "execution": {
    "id": "exec_123456",
    "status": "running",
    "currentStep": 2,
    "totalSteps": 13,
    "totalCost": 0.45,
    "totalTokens": 8942,
    "steps": [ /* Step details */ ]
  }
}
```

### Execute Pipeline
**POST** `/api/pipeline/execute`

```json
{
  "executionId": "exec_123456"
}
```

This runs the full pipeline in the background and updates the database.

## Project Memory System

The memory system persists learning across projects:

```typescript
interface ProjectMemory {
  brandVoice: string              // Cached brand guidelines
  audience: string                // Target audience profile
  writingStyle: string            // Preferred writing patterns
  preferredCTA: string            // Frequently used CTAs
  frequentKeywords: string[]      // High-performing keywords
  successfulArticles: string[]    // Previously successful content
  internalUrls: string[]          // Internal linking reference
  customInstructions: string      // Project-specific rules
}
```

## Error Handling & Retry Logic

The system automatically handles:
- **Rate Limits** (429): Exponential backoff, retryable
- **Timeouts**: Exponential backoff, retryable
- **Validation Errors** (4xx): Not retried
- **API Errors** (5xx): Exponential backoff, retryable

```typescript
const failure = categorizeError(error);
// {
//   category: 'rate_limit' | 'timeout' | 'validation' | 'api' | 'unknown',
//   message: string,
//   retryable: boolean
// }
```

## Usage Tracking

Every agent execution logs:
- Prompt tokens
- Completion tokens
- Estimated cost
- Latency
- Model used
- Step name

```typescript
const usage: UsageTracking = {
  promptTokens: 245,
  completionTokens: 1203,
  totalTokens: 1448,
  estimatedCost: 0.045,
  latency: 2340,
  model: 'claude-3-5-sonnet-20241022',
  agentName: 'Writer'
};
```

## Event System

The pipeline emits events for real-time updates:

```typescript
runner.subscribe((event) => {
  switch (event.type) {
    case 'started':
      console.log(`Started: ${event.stepName}`);
      break;
    case 'completed':
      console.log(`Completed: ${event.stepName} in ${event.data.duration}ms`);
      break;
    case 'failed':
      console.error(`Failed: ${event.stepName} - ${event.data.error}`);
      break;
    case 'approval_requested':
      console.log(`Waiting for approval on: ${event.stepName}`);
      break;
    case 'retry':
      console.log(`Retrying: ${event.stepName}`);
      break;
  }
});
```

## Adding New Agents

1. **Create agent file** (`src/lib/agents/my-agent.ts`):

```typescript
import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { getPrompt } from '../prompts'

export class MyAgent extends BaseAgent {
  constructor() {
    super('My Agent Name')
  }

  buildPrompt(context: AgentExecutionContext): string {
    const basePrompt = getPrompt('my-agent')
    return `${basePrompt}

Context: ${this.formatContext(context)}`
  }
}
```

2. **Add to runner** (`src/lib/orchestrator/runner.ts`):

```typescript
private initializeAgents(): void {
  // ...existing agents...
  this.agents.set('My Agent Name', new MyAgent())
}
```

3. **Add prompt** (`src/lib/prompts/index.ts`):

```typescript
export const PROMPTS = {
  // ...existing prompts...
  MY_AGENT: `Your prompt here...`,
}
```

## Security & Best Practices

- ✅ All AI requests occur on the server
- ✅ API keys never exposed to clients
- ✅ Every input is validated
- ✅ Markdown is sanitized before storage
- ✅ HTML is escaped in outputs
- ✅ No sensitive data in logs
- ✅ Rate limiting on API endpoints
- ✅ User authentication required
- ✅ Execution history preserved
- ✅ Failure recovery enabled

## Future Enhancements

- [ ] Multi-modal input (images, PDFs)
- [ ] Real-time collaboration with WebSockets
- [ ] Advanced caching layer
- [ ] Custom agent templates
- [ ] A/B testing framework
- [ ] Distributed execution (multiple workers)
- [ ] Advanced analytics and reporting
- [ ] Integration with additional AI providers (OpenAI, Gemini, Mistral)
- [ ] Workflow builder UI
- [ ] Advanced approval workflows
