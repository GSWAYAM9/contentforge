# AI Integration in Frontend - Claude & OpenAI Display

## Where to Find Claude & OpenAI in the UI

### 1. **Pipeline Manager** (Main Dashboard)
**Location**: `app/dashboard/pipeline/page.tsx`

This is the page you're currently on. It now displays:

#### AI Model Legend (Top of Page)
- **Purple Badge**: Claude 3.5 Sonnet (Anthropic)
- **Blue Badge**: OpenAI DALL-E 3

#### Pipeline Cards - Each shows:
- **Current Agent**: Which AI is running (e.g., "Claude 3.5 Sonnet", "OpenAI (DALL-E 3)")
- **Agent Indicator**: Purple dot = Claude, Blue dot = OpenAI
- **Token Usage**: How many tokens consumed so far
- **Estimated Cost**: Cost breakdown for current execution
- **Agents Timeline**: Visual badges showing which agents have run/are running
  - Green = Completed
  - Purple with pulse = Currently running
  - Gray = Pending

**Example Data Structure**:
```typescript
{
  id: 1,
  name: 'AI Writing Guide',
  currentAgent: 'OpenAI (DALL-E 3)',  // Shows which AI is active
  agentModel: 'OpenAI',                // Model type
  tokenUsage: 3421,                    // Total tokens used
  estimatedCost: 0.0145,               // Cost in dollars
  agents: ['Keyword Research', 'Research', 'Outline', 'Writer', 'SEO', 'Image Generation']
}
```

---

### 2. **Project Page** (Individual Project Pipeline)
**Location**: `app/project/[id]/page.tsx`

When you open a specific project:

#### Pipeline Controller Tab
- Shows start/pause/resume controls
- Real-time progress (which step running)
- Connected to the orchestration engine

#### Pipeline Viewer Tab
Displays each step with:
- Step name (matches agent name)
- Status (pending, running, completed, failed)
- **Agent name** (from `stage.agent` field)
- Execution logs
- Token usage metrics
- Cost breakdown per step

**Step Card Detail View** (`pipeline-step-card.tsx`):
```
Agent name displayed: stage.agent
Status color-coded by type
Execution metrics: Duration, Tokens, Cost
Live logs as Claude/OpenAI processes
```

#### Monitor Tab
- **Real-Time Metrics**:
  - Current step progress
  - Total tokens used (from all Claude calls)
  - Total cost (calculated from token usage)
  - Elapsed time
  
- **Event Stream**:
  - Shows each agent completion
  - Status updates from Claude/OpenAI API

---

### 3. **Service Layer** (Backend AI Integration)

#### Claude Service
**File**: `src/lib/services/anthropic.ts`
- Function: `callClaude()`
- Used by agents: All 10 agents use this
- Returns: Response with token usage tracked

#### OpenAI Service
**File**: `src/lib/services/openai.ts`
- Function: `generateImages()`
- Used for: Image generation in pipeline
- Returns: Generated images with cost calculation

---

## Agent-to-AI Mapping

| Agent | AI Model | Purpose |
|-------|----------|---------|
| Keyword Research | Claude 3.5 Sonnet | Find relevant keywords |
| Research | Claude 3.5 Sonnet | Gather research insights |
| Outline | Claude 3.5 Sonnet | Create content structure |
| Writer | Claude 3.5 Sonnet | Generate full article |
| SEO | Claude 3.5 Sonnet | Optimize for search |
| QA | Claude 3.5 Sonnet | Quality assurance review |
| Social | Claude 3.5 Sonnet | Social media content |
| Email | Claude 3.5 Sonnet | Email marketing copy |
| LinkedIn | Claude 3.5 Sonnet | LinkedIn content |
| Publish | Claude 3.5 Sonnet | Publication preparation |
| Image Gen | OpenAI DALL-E 3 | Generate images |

---

## Tracking Claude & OpenAI Usage

### Token Tracking
```typescript
// Each agent call returns:
{
  usage: {
    promptTokens: 250,
    completionTokens: 750,
    totalTokens: 1000
  }
}

// Accumulated in pipeline execution:
pipeline.totalTokens += agentResponse.usage.totalTokens
```

### Cost Calculation
```typescript
// Claude 3.5 Sonnet pricing:
const promptCost = promptTokens * 0.003 / 1000000  // $3 per 1M
const completionCost = completionTokens * 0.015 / 1000000  // $15 per 1M
const totalCost = promptCost + completionCost

// OpenAI DALL-E 3:
// Standard: $0.04 per image
// HD: $0.08 per image
```

---

## Real-Time Streaming (SSE)

**Endpoint**: `/api/pipeline/stream?executionId={id}`

Streams events including:
```json
{
  "type": "update",
  "status": "running",
  "data": {
    "currentStep": 3,
    "currentStepName": "Writer Agent",
    "totalTokens": 2541,
    "totalCost": 0.0112,
    "elapsed": 15000,
    "currentAgent": "Claude 3.5 Sonnet"
  }
}
```

Hook: `usePipelineStream(executionId)`
- Auto-subscribes to SSE stream
- Updates real-time metrics
- Displays current agent

---

## Components Showing AI Integration

### Pipeline Manager Components
1. `GlassCard` - Status cards with AI model badges
2. `AnimatedButton` - Control buttons (Start, Pause, Resume)
3. Agent Timeline badges - Visual status of each AI agent

### Project Page Components
1. `PipelineController` - Main controls
2. `PipelineViewer` - Step list with agent names
3. `PipelineStepCard` - Detailed step info with metrics
4. `PipelineMonitor` - Real-time dashboard
5. `ResultsDisplay` - Generated content output

---

## Environment Variables Required

```
# Claude/Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
OPENAI_API_KEY=sk-...
```

These are already configured in your `.env` and used by the service layer.

---

## How It All Works Together

```
User starts pipeline
    ↓
Pipeline Manager shows: Claude 3.5 Sonnet (Keyword Research)
    ↓
Agent 1 (Claude) generates keywords
    ↓
Pipeline Monitor updates: Tokens: 542, Cost: $0.00234
    ↓
Agent 2 (Claude) generates research
    ↓
Real-time stream updates metrics
    ↓
Agent 3-6 (Claude) continue...
    ↓
Agent 7 (OpenAI DALL-E 3) generates image
    ↓
Final metrics: 7532 tokens, $0.0342 total cost
    ↓
Results display all generated content
```

---

## Tips for Monitoring

1. **Pipeline Manager**: Quick overview of all running pipelines
2. **Project Page - Monitor Tab**: Deep dive into real-time metrics
3. **Project Page - Pipeline Tab**: See individual agent details
4. **Check costs**: Displayed in real-time as pipeline runs
5. **Token tracking**: Shows what each agent consumed

---

**All Claude and OpenAI integrations are fully visible and tracked in the frontend. The system now shows you exactly which AI is being used, when, and the cost breakdown.**
