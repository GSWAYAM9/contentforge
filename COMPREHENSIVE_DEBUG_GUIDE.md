# Comprehensive Debugging Guide for Pipeline Execution

## Current Status
Your pipeline is showing "Completed" but with 0 tokens and $0.00 cost, which means:
- ❌ Claude API is NOT being called
- ❌ Agents are NOT executing
- ✅ But NO ERROR is being thrown either

This indicates a silent failure somewhere in the execution chain.

## How to Debug

### Step 1: Enable Server Logs
The latest build includes detailed logging at every step. To see it:

1. **Open your server console/terminal** where the Next.js dev server is running
2. **Look for these log tags:**
   - `[v0]` - Main pipeline orchestrator
   - `[v0-agent]` - Individual agent execution
   - `[v0-anthropic]` - Claude API calls
   - `[v0-anthropic] API Key exists: true/false` - Confirms API key is loaded

### Step 2: Expected Log Flow
When you run the pipeline, you should see (in order):

```
[v0] executeStep: Starting Keyword Research (Keyword Research)
[v0] Context: prompt="your topic here", keywords=[...], tone="..."
[v0] executeStep: Found agent Keyword Research, executing...
[v0-agent] Keyword Research execute() called with context: {...}
[v0-agent] Keyword Research buildPrompt() returned: "You are an expert..."
[v0-agent] Keyword Research systemPrompt: "You are an expert Keyword Research..."
[v0-agent] Keyword Research calling callClaude()
[v0-anthropic] callClaude() called
[v0-anthropic] API Key exists: true
[v0-anthropic] Request: { promptLength: 500, systemPromptLength: 200, maxTokens: 4096 }
[v0-anthropic] (wait ~5-10 seconds for Claude response)
[v0-agent] Keyword Research response received: { status: 'success', tokens: 250, ... }
[v0] executeStep: Agent response received: { status: 'success', tokensUsed: 250, ... }
```

### Step 3: What to Look For

**If you see logs up to `[v0-agent] calling callClaude()` but nothing after:**
- Claude API is hanging or timing out
- Check network connectivity
- Check Claude API status at https://status.anthropic.com/

**If you see logs but NO `[v0-agent]` tags:**
- Agent is not being called at all
- The agent class might not have the `execute()` method
- Check that all agents inherit from `BaseAgent`

**If you see NO logs at all:**
- `executePipeline` action is not being triggered
- Check browser console for errors
- Check that the "Generate Content" button click is working

**If you see `API Key exists: false`:**
- Environment variable is not loaded at runtime
- Redeploy or restart the server
- Check Vercel settings for `ANTHROPIC_API_KEY`

### Step 4: Manual API Test

To test if Claude API is working directly, create a test file:

```typescript
// lib/test-claude.ts
import { callClaude } from './services/anthropic'

export async function testClaudeAPI() {
  try {
    const response = await callClaude({
      prompt: 'What is 2+2?',
      systemPrompt: 'You are a helpful assistant.',
      maxTokens: 100,
      temperature: 0.7,
    })
    console.log('[v0-test] Claude response:', response)
    return response
  } catch (error) {
    console.error('[v0-test] Claude error:', error)
    throw error
  }
}
```

Then call it from a page/component to test directly.

### Step 5: Database Updates

Check if the execution state is being saved:

```sql
SELECT id, status, data, total_cost FROM pipeline_executions 
ORDER BY created_at DESC LIMIT 1;
```

Look for:
- `status` field changing from 'running' to 'completed'
- `total_cost` field showing > 0
- `data` field containing step results

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 0 tokens, $0.00 cost | Agent didn't execute | Check [v0-agent] logs |
| "Completed" but no content | Agent returned empty | Check response structure |
| No logs appear | Logs not reaching console | Check server config |
| API key error | Env var not set | Set ANTHROPIC_API_KEY in Vercel |
| Timeout after 30s | Claude API slow | Increase timeout in callClaude |

## Next Steps

1. **Run the pipeline and capture server logs**
2. **Share the log output** starting from where you click "Generate Content"
3. **Look specifically for:**
   - Any errors or stack traces
   - Where the logs stop
   - The last successful log message

This will pinpoint exactly where the execution is failing!
