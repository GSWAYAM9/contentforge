# Pipeline Debugging Guide

## Current Issue: Pipeline Not Executing Agents

Your pipeline shows "Completed" with 0 tokens and $0.00 cost, which means agents aren't actually running.

## Root Causes to Check

### 1. **Missing ANTHROPIC_API_KEY**
- The environment variable must be set in your Vercel project
- Without it, `callClaude` will fail silently
- **Fix**: Go to Vercel Settings → Environment Variables → Add ANTHROPIC_API_KEY

### 2. **Agent Initialization**
- All 16 agents must be properly initialized in `runner.ts`
- Check the `initializeAgents()` method initializes all agents you need

### 3. **Context Issues**
- Agents receive context but might not have valid data
- Check: prompt, keywords, tone, targetAudience are all set
- If any are empty, agents might fail silently

## How to Debug

### Step 1: Check Server Logs
When you trigger a pipeline:
```bash
# In your terminal/console, you should see:
[v0] executeStep: Starting Keyword Research (Keyword Research)
[v0] Context: prompt="...", keywords=[...], tone="..."
```

If you don't see these, the executeStep method isn't being called.

### Step 2: Check API Response
Open browser DevTools → Network tab → Look for `/api/pipeline/execute` request

**Should see:**
- Status: 200
- Response: `{"success": true, "executionId": "...", "status": "running"}`

**If 404 or error**: The execution ID doesn't exist in database

### Step 3: Check Database
The `pipelineExecutions` table should have a record with:
- id: your execution ID
- status: 'running' → should update to 'completed'
- data: full execution object
- totalTokens: should increase from 0
- totalCost: should increase from $0.00

### Step 4: Check Stream Endpoint
Open a new browser tab:
```
/api/pipeline/stream?executionId=YOUR_EXEC_ID
```

You should see SSE events streaming in real-time showing progress.

## Real-Time Updates

**NEW:** Database is now updated every 5 seconds during execution:
- Tokens used increments
- Cost accumulates
- Step status changes from 'pending' → 'running' → 'completed'
- UI should update automatically

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| 0 tokens, $0.00 cost | Agent never called | Check ANTHROPIC_API_KEY |
| Step marked "Completed" instantly | Agent returns immediately | Check agent's execute() method |
| No context data | Empty prompt/keywords | Check pipeline-execution action sends data |
| Database not updating | Connection issue | Check Neon database connection |
| Stream not working | ExecutionId wrong | Verify execution was saved to DB |

## Temporary Fixes Applied

1. **Real-time DB updates**: Pipeline now saves state every 5 seconds
2. **Better error handling**: Errors logged but don't stop pipeline
3. **Enhanced logging**: See context being used for each agent
4. **Context validation**: Checks prompt, keywords, tone are present

## Next Steps

1. Check your ANTHROPIC_API_KEY is set correctly
2. Run pipeline and watch server logs
3. Verify database has execution record
4. Open stream endpoint in browser to see real-time updates
5. Open DevTools and check /api/pipeline/execute response

If you see agents starting to execute (tokens > 0), the pipeline is working!

## Expected Output When Working

```
[v0] executeStep: Starting Keyword Research (Keyword Research)
[v0] Context: prompt="How to use AI in marketing", keywords=[AI, marketing, SEO], tone="professional"
[v0] executeStep: Found agent Keyword Research, executing...
[v0] executeStep: Starting Research (Research)
...
Tokens Used: 2,847
Cost: $0.12
```
