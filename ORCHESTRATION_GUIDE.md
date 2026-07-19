# ContentForge Orchestration Engine - Complete Implementation Guide

## Overview

The ContentForge orchestration engine is a sophisticated AI-powered content generation pipeline that automatically orchestrates multiple specialized agents to create high-quality, SEO-optimized content. The system now includes all components for production-ready content generation.

## Architecture Components

### 1. **Agents System** (10 Total)

#### Core Agents (Implemented)
- **Keyword Research Agent** - Identifies high-impact keywords and related terms
- **Research Agent** - Conducts thorough topic research and gathers insights
- **Outline Agent** - Creates structured, engaging content outlines
- **Writer Agent** - Generates high-quality article content
- **SEO Agent** - Optimizes content for search engines
- **QA Agent** - Reviews content for accuracy and quality
- **Social Agent** - Generates platform-specific social media content
- **Email Agent** - Creates compelling email marketing copy
- **LinkedIn Agent** - Develops professional LinkedIn content
- **Publish Agent** - Prepares content for publication

All agents inherit from `BaseAgent` and follow a consistent execution pattern with error handling, retry logic, and cost tracking.

### 2. **Database Schema**

#### Pipeline Executions Table
```sql
CREATE TABLE pipeline_executions (
  id TEXT PRIMARY KEY,
  projectId INTEGER NOT NULL,
  userId TEXT NOT NULL,
  status VARCHAR(50) NOT NULL,
  data JSONB,
  totalCost DECIMAL(10, 6),
  totalTokens INTEGER,
  createdAt TIMESTAMP DEFAULT NOW(),
  startedAt TIMESTAMP,
  completedAt TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (projectId) REFERENCES projects(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### 3. **Frontend UI Components**

#### Pipeline Controller (`pipeline-controller.tsx`)
- Real-time progress visualization
- Start/pause/resume/reset controls
- Settings access
- Live step counter with animated progress bar

#### Pipeline Configuration Panel (`pipeline-config-panel.tsx`)
- Tone selection (formal, casual, professional, creative)
- Target word count configuration
- Audience specification
- Keywords management
- Approval gates (outline, QA)
- Custom instructions
- Model and temperature settings

#### Pipeline Monitor (`pipeline-monitor.tsx`)
- Real-time metrics display
  - Token usage
  - Cost tracking
  - Elapsed time
  - Current step progress
- Connection status indicator
- Event log stream
- Live status updates

#### Results Display (`results-display.tsx`)
- Section-by-section results view
- Copy-to-clipboard functionality
- Download results as text files
- Status indicators
- Truncated preview of long content
- Share capabilities

### 4. **Real-Time Updates System**

#### Server-Sent Events (SSE) Implementation
- **Endpoint**: `/api/pipeline/stream?executionId={id}`
- Bidirectional polling every 2 seconds
- Automatic cleanup on disconnect
- Handles connection failures gracefully

#### Client Hook (`use-pipeline-stream.ts`)
- Automatic EventSource management
- Connection state tracking
- Error handling
- Auto-cleanup on unmount

### 5. **API Routes**

#### `/api/pipeline/start`
- **Method**: POST
- **Purpose**: Initialize pipeline execution
- **Returns**: executionId for tracking
- **Rate Limit**: 60 requests/hour

#### `/api/pipeline/status`
- **Method**: GET
- **Purpose**: Fetch current pipeline status
- **Query**: `executionId`
- **Returns**: Full execution state with metrics

#### `/api/pipeline/stream`
- **Method**: GET
- **Purpose**: Real-time event stream
- **Query**: `executionId`
- **Format**: Server-Sent Events

### 6. **Configuration Management**

#### Pipeline Configuration Action (`pipeline-config.ts`)
- Save configuration to project metadata
- Load configuration for reuse
- Supports custom instructions
- Model preference storage

## Workflow

### 1. **Starting a Pipeline**
```typescript
// User clicks "Start Pipeline" in PipelineController
1. Frontend calls /api/pipeline/start with projectId
2. Backend creates PipelineExecution record
3. System returns executionId
4. Frontend opens SSE stream with executionId
5. Monitor begins real-time updates
```

### 2. **Execution Flow**
```
Keyword Research → Research → Outline → Writer → SEO → QA → 
Social → Email → LinkedIn → Publish
```

### 3. **Step Execution**
```typescript
For each step:
1. Agent receives ExecutionContext
2. Agent calls Claude API with specific prompt
3. Results cached in previousOutputs Map
4. Metrics (tokens, cost) accumulated
5. Status updated to database
6. Event streamed to frontend
7. On failure: Retry with backoff (max 3 attempts)
```

## Usage Examples

### Basic Pipeline Execution
```typescript
// In project page component
const handleStartPipeline = async () => {
  const response = await fetch('/api/pipeline/start', {
    method: 'POST',
    body: JSON.stringify({ projectId: id })
  })
  const data = await response.json()
  setExecutionId(data.executionId)
}
```

### Accessing Real-Time Updates
```typescript
// Hook automatically manages EventSource
const { event, isConnected, error } = usePipelineStream(executionId)

// event contains: { type, status, data }
```

### Retrieving Results
```typescript
// From pipeline_executions.data
const execution = JSON.parse(executionData)
const {
  keywords,
  research,
  outline,
  article,
  socialPosts,
  emailCopy
} = execution.outputs
```

## Configuration Files

### `.env` Variables Required
```
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
```

### Model Configuration
- **Default Model**: claude-3-5-sonnet
- **Temperature**: 0.7 (adjustable per agent)
- **Max Tokens**: 4096 (auto-adjusted per agent)

## Performance Metrics

### Token Usage (Typical)
- Keyword Research: 400-600 tokens
- Research: 1200-1800 tokens
- Outline: 800-1200 tokens
- Writer: 2000-3000 tokens
- SEO: 800-1200 tokens
- Other agents: 500-1000 tokens each
- **Total**: ~7000-10000 tokens per execution

### Cost Estimation (Claude 3.5 Sonnet)
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens
- **Typical execution cost**: $0.015-0.025 per article

### Timing
- **Keyword Research**: 3-5 seconds
- **Research**: 8-12 seconds
- **Outline**: 5-8 seconds
- **Writer**: 15-25 seconds
- **SEO**: 5-8 seconds
- **Other**: 3-5 seconds each
- **Total**: 50-80 seconds per execution

## Error Handling

### Retry Strategy
- Max retries: 3
- Backoff: exponential (1s, 2s, 4s)
- Failure scenarios: API timeout, rate limit, token limit

### Error Logging
- All errors logged to database
- Visible in pipeline monitor
- Includes error type and timestamp

## Monitoring Dashboard

The monitoring tab provides:
- Live connection status
- Real-time metrics dashboard
- Event stream display
- Results preview
- Download/copy functionality

Access via: Project Page → Monitor Tab (when execution running)

## Advanced Features

### 1. **Approval Gates**
- Optional outline approval before continuing
- Optional QA approval before publishing
- Configured in PipelineConfigPanel

### 2. **Custom Instructions**
- Per-project custom instructions
- Applied to all applicable agents
- Stored in project metadata

### 3. **Platform Selection**
- Choose which platforms to generate for
- Social, Email, LinkedIn content customized per platform
- Auto-skipped if not selected

### 4. **Cost Budgeting**
- Track total execution cost
- Optional budget alerts
- Cost breakdown by agent

## Future Enhancements

### Planned Features
1. **Scheduling** - Schedule pipelines to run at specific times
2. **Versioning** - Store multiple versions of outputs
3. **Regeneration** - Regenerate specific sections
4. **Webhooks** - Send execution events to external services
5. **Templates** - Save and reuse successful configurations
6. **Analytics** - Detailed pipeline performance analytics
7. **A/B Testing** - Test different tones/styles
8. **Content Calendar** - Schedule content publication

### Integration Opportunities
1. CMS Integration (WordPress, Contentful)
2. Social Platform Direct Publishing
3. Email Service Integration (Mailchimp, SendGrid)
4. Analytics Platform Integration (Google Analytics, Mixpanel)
5. Webhook to 3rd-party services

## Troubleshooting

### Pipeline Not Starting
- Check ANTHROPIC_API_KEY is set
- Verify DATABASE_URL is valid
- Check project exists and user has access

### Real-Time Updates Not Working
- Verify `/api/pipeline/stream` endpoint is accessible
- Check browser supports EventSource API
- Verify execution status in database

### High Token Usage
- Reduce word count requirement
- Simplify custom instructions
- Check agent prompts aren't too verbose

### Slow Execution
- Expected: 50-80 seconds per execution
- Check API response times
- Monitor for rate limiting

## Support

For issues or feature requests, contact the development team or check the project repository for updates.

