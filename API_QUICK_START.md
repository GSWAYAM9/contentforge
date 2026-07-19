# ContentForge Orchestration Engine - API Quick Start

## Overview

Complete REST API for the 16-agent AI orchestration engine. All endpoints require authentication.

## Setup

### 1. Set Environment Variables
```bash
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### 2. Verify Build
```bash
pnpm build
```

### 3. Start Development Server
```bash
pnpm dev
```

## Core API Endpoints

### Start a Pipeline Execution

```bash
POST /api/pipeline/start
```

**Request:**
```json
{
  "projectId": "proj_abc123",
  "prompt": "Write about the future of AI in healthcare",
  "keywords": ["AI", "healthcare", "machine learning", "diagnosis"],
  "brandVoice": "professional",
  "targetAudience": "healthcare professionals",
  "tone": "professional"
}
```

**Response:**
```json
{
  "success": true,
  "executionId": "exec_1721392843012_a3b5c2d",
  "execution": {
    "id": "exec_1721392843012_a3b5c2d",
    "projectId": "proj_abc123",
    "status": "running",
    "currentStep": 0,
    "steps": [
      {"id": "step_1", "name": "Keyword Research", "status": "pending"},
      {"id": "step_2", "name": "Research", "status": "pending"},
      {"id": "step_3", "name": "Outline", "status": "pending"},
      ...14 more agents
    ],
    "totalCost": 0,
    "totalTokens": 0,
    "startedAt": "2024-07-19T12:34:00Z"
  }
}
```

### Get Pipeline Status

```bash
GET /api/pipeline/status?executionId=exec_1721392843012_a3b5c2d
```

**Response:**
```json
{
  "success": true,
  "execution": {
    "id": "exec_1721392843012_a3b5c2d",
    "status": "running",
    "currentStep": 5,
    "totalSteps": 15,
    "totalCost": 0.089,
    "totalTokens": 3420,
    "completedAt": null,
    "steps": [
      {
        "id": "step_1",
        "name": "Keyword Research",
        "agentName": "Keyword Research",
        "status": "completed",
        "output": {
          "primaryKeywords": ["AI healthcare", "machine learning diagnosis"],
          "secondaryKeywords": [...],
          "intent": "informational",
          "difficulty": 52
        },
        "duration": 45000,
        "retries": 0
      },
      ...
    ]
  }
}
```

### Stream Real-Time Events

```bash
GET /api/pipeline/stream?executionId=exec_1721392843012_a3b5c2d
```

**Response: Server-Sent Events (SSE)**
```
data: {"type":"init","execution":{...},"timestamp":"2024-07-19T12:34:00Z"}

data: {"type":"started","stepName":"Keyword Research","timestamp":"2024-07-19T12:34:05Z"}

data: {"type":"completed","stepName":"Keyword Research","data":{"primaryKeywords":[...]},"tokensUsed":420}

data: {"type":"started","stepName":"Research","timestamp":"2024-07-19T12:34:50Z"}

...continues until completion...

data: {"type":"completed","execution":{...},"timestamp":"2024-07-19T12:52:30Z"}
```

### Pause Pipeline

```bash
POST /api/pipeline/pause
```

**Request:**
```json
{
  "executionId": "exec_1721392843012_a3b5c2d"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pipeline paused"
}
```

### Resume Pipeline

```bash
POST /api/pipeline/resume
```

**Request:**
```json
{
  "executionId": "exec_1721392843012_a3b5c2d"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pipeline resumed"
}
```

### Cancel Pipeline

```bash
POST /api/pipeline/cancel
```

**Request:**
```json
{
  "executionId": "exec_1721392843012_a3b5c2d"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pipeline cancelled"
}
```

## 16 AI Agents Pipeline

```
Phase 1: Foundation (0-5 min)
├─ Keyword Research Agent
├─ Research Agent
└─ Outline Agent

Phase 2: Creation (5-13 min)
├─ Content Writer Agent
├─ Fact Checker Agent
└─ Content Editor Agent

Phase 3: Optimization (13-16 min)
├─ SEO Agent
├─ Internal Linking Agent
└─ Accessibility Agent

Phase 4: Distribution (16-19 min)
├─ Social Media Agent
├─ Email Agent
└─ LinkedIn Agent

Phase 5: Publishing (19-21 min)
├─ QA Agent
├─ Publish Agent
└─ Learning Agent
```

## Request/Response Examples

### Example: Full Article Generation

**1. Start Pipeline**
```bash
curl -X POST http://localhost:3000/api/pipeline/start \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionId=..." \
  -d '{
    "projectId": "proj_healthcare",
    "prompt": "Write about AI-powered medical diagnosis systems",
    "keywords": ["AI diagnosis", "medical imaging", "radiology"],
    "brandVoice": "innovative",
    "targetAudience": "healthcare IT professionals",
    "tone": "professional"
  }'
```

**2. Monitor Progress (every 2 seconds)**
```bash
curl "http://localhost:3000/api/pipeline/status?executionId=exec_1721392843012_a3b5c2d" \
  -H "Cookie: sessionId=..."

# Shows increasing currentStep and totalCost
```

**3. Stream Events**
```bash
# In Node.js or browser
const eventSource = new EventSource(
  `/api/pipeline/stream?executionId=exec_1721392843012_a3b5c2d`
)

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log(`[${data.type}] ${data.stepName}`)
}
```

**4. Final Result After ~20 Minutes**
```json
{
  "success": true,
  "execution": {
    "id": "exec_1721392843012_a3b5c2d",
    "status": "completed",
    "totalCost": 0.115,
    "totalTokens": 6840,
    "completedAt": "2024-07-19T12:52:30Z",
    "steps": [
      {
        "name": "Keyword Research",
        "output": {
          "primaryKeywords": ["AI diagnosis", "medical imaging"],
          "secondaryKeywords": [...],
          "searchVolume": [...],
          "difficulty": 48
        }
      },
      {
        "name": "Research",
        "output": {
          "summary": "AI has revolutionized medical diagnosis...",
          "keyFacts": [...],
          "supportingEvidence": [...],
          "statistics": [...]
        }
      },
      {
        "name": "Outline",
        "output": {
          "h1": "The Future of AI-Powered Medical Diagnosis",
          "sections": [
            {
              "h2": "Current State of AI in Healthcare",
              "h3s": [...],
              "keyPoints": [...],
              "estimatedWords": 400
            }
          ]
        }
      },
      {
        "name": "Content Writer",
        "output": "# The Future of AI-Powered Medical Diagnosis\n\n## Current State of AI in Healthcare\n\nArtificial intelligence has revolutionized medical diagnosis..."
      },
      {
        "name": "Fact Checker",
        "output": {
          "verified": [
            {"claim": "AI improves diagnostic accuracy by 20-30%", "verified": true}
          ],
          "overallAccuracy": 97
        }
      },
      {
        "name": "Content Editor",
        "output": "# The Future of AI-Powered Medical Diagnosis\n\n## Current State of AI in Healthcare\n\nArtificial intelligence has fundamentally transformed medical diagnosis..."
      },
      {
        "name": "SEO",
        "output": {
          "seoTitle": "AI-Powered Medical Diagnosis: The Future is Here | Healthcare IT",
          "metaDescription": "Discover how AI is revolutionizing medical diagnosis with 20-30% higher accuracy...",
          "slug": "ai-powered-medical-diagnosis-future",
          "keywordDensity": [
            {"keyword": "AI diagnosis", "percentage": 2.3},
            {"keyword": "medical imaging", "percentage": 1.8}
          ]
        }
      },
      {
        "name": "Internal Linking",
        "output": {
          "suggestions": [
            {
              "anchor": "machine learning in healthcare",
              "url": "/blog/machine-learning-healthcare",
              "placement": "introduction"
            }
          ]
        }
      },
      {
        "name": "Accessibility",
        "output": {
          "altTextCheck": {"present": 8, "missing": 0},
          "headingHierarchy": {"valid": true, "issues": []},
          "accessibilityScore": 98
        }
      },
      {
        "name": "Social Media",
        "output": {
          "linkedInCaption": "AI is transforming medical diagnosis. A new study shows...",
          "twitterPosts": ["Just published: How AI is revolutionizing medical diagnosis..."],
          "facebookCaption": "Healthcare is changing. Discover how AI is..."
        }
      },
      {
        "name": "Email",
        "output": {
          "subject": "Transform Your Diagnostic Capabilities with AI",
          "body": "Dear Healthcare Professional,\n\nDiscover how leading hospitals...",
          "cta": "Read the Full Guide"
        }
      },
      {
        "name": "LinkedIn",
        "output": "The integration of artificial intelligence into medical diagnostics represents one of the most significant advances in healthcare technology in decades..."
      },
      {
        "name": "QA",
        "output": {
          "status": "pass",
          "score": 94,
          "issues": [],
          "recommendations": ["Consider adding more recent case studies"]
        }
      },
      {
        "name": "Publish",
        "output": {
          "readyToPublish": true,
          "recommendedChannels": ["blog", "linkedin", "email"],
          "bestPublishTime": "Tuesday 10:00 AM EST"
        }
      },
      {
        "name": "Learning",
        "output": {
          "successfulKeywords": ["AI diagnosis", "medical imaging"],
          "writingPatterns": ["structure-based", "statistics-driven"],
          "publishingInsights": ["Topics about healthcare tech perform well on LinkedIn"],
          "recommendedTopics": ["Blockchain in healthcare", "5G medical applications"]
        }
      }
    ]
  }
}
```

## Error Handling

### Rate Limited (429)

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 30
}
```

System automatically retries with exponential backoff (1s → 2s → 4s).

### Validation Error (400)

```json
{
  "error": "Missing required fields",
  "details": {
    "projectId": "required",
    "prompt": "required"
  }
}
```

### Authentication Error (401)

```json
{
  "error": "Unauthorized",
  "message": "Session expired or invalid"
}
```

### Server Error (500)

```json
{
  "error": "Failed to start pipeline",
  "message": "Internal server error"
}
```

## Usage Tracking

Track costs and usage automatically:

```typescript
import { getGlobalTracker } from '@/lib/services/usage-tracking'

const tracker = getGlobalTracker()
const stats = tracker.getStatistics('exec_1721392843012_a3b5c2d')

console.log(stats)
// {
//   totalRecords: 15,
//   totalTokens: 6840,
//   totalCost: 0.115,
//   averageTokensPerAgent: 456,
//   averageCostPerAgent: 0.0077,
//   modelBreakdown: [
//     { model: "claude-3-5-sonnet-20241022", usage: 6840, cost: 0.115 }
//   ]
// }
```

## Project Memory Integration

After each execution, system learns:

```typescript
import { ProjectMemoryService } from '@/lib/services/memory-service'

const memory = await ProjectMemoryService.load('proj_healthcare')

// System recorded:
memory.recordSuccessfulArticle({
  topic: "AI-powered medical diagnosis",
  keywords: ["AI diagnosis", "medical imaging"],
  wordCount: 2450,
  tokensUsed: 6840,
  cost: 0.115,
  rating: 4.8
})

// Next articles benefit from:
// - Successful keyword patterns
// - Optimal content structure
// - Effective writing style
// - Cost predictions
```

## Best Practices

### 1. Long-Running Operations
Use `stream` endpoint for real-time updates rather than polling:
```javascript
// Good: Stream updates
const eventSource = new EventSource(`/api/pipeline/stream?executionId=${id}`)

// Avoid: Polling every second
// setInterval(() => fetch(`/api/pipeline/status?executionId=${id}`), 1000)
```

### 2. Error Recovery
System automatically retries on:
- Rate limits (429)
- Timeouts
- Temporary server errors (5xx)

Don't implement custom retry logic.

### 3. Cost Management
Monitor costs before they get high:
```bash
# Check status regularly
curl "http://localhost:3000/api/pipeline/status?executionId=$ID" | jq '.execution.totalCost'
```

### 4. Concurrent Executions
Run up to 10 pipelines concurrently per project:
```bash
# Start multiple pipelines
for topic in "${TOPICS[@]}"; do
  curl -X POST http://localhost:3000/api/pipeline/start \
    -H "Content-Type: application/json" \
    -d "{\"projectId\": \"proj_123\", \"prompt\": \"$topic\"}"
done
```

## Deployment Notes

### Production Checklist
- ✅ API keys configured in environment
- ✅ Database migrations run
- ✅ Session management enabled
- ✅ Rate limiting configured
- ✅ Error monitoring setup
- ✅ Cost alerts configured
- ✅ SSE connection pooling reviewed

### Performance Tuning
- Increase `maxDuration` for longer executions
- Configure retry delays based on API behavior
- Monitor concurrent execution limits
- Cache project memory to reduce DB queries

### Scaling Considerations
- Use connection pooling for database
- Implement Redis for session store
- Add message queue for async operations
- Distribute agent execution across workers

---

**All endpoints are production-ready and fully tested.** Build status: ✅ Successful
