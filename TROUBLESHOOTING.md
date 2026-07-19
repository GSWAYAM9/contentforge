# Pipeline Execution Troubleshooting Guide

## Issue: Pipeline shows "Processing..." but metrics stay at 0

### Symptoms
- Tokens Used: 0
- Cost: $0.00
- Completion: 0%
- Logs show "Processing..." indefinitely

### Solution
This means the Claude API isn't being called. Check:

1. **Verify ANTHROPIC_API_KEY is set**
   ```bash
   echo $ANTHROPIC_API_KEY
   ```
   If empty, add your key to `.env.development.local`

2. **Check server logs**
   ```bash
   cd /vercel/share/v0-project && npm run dev
   ```
   Look for `[v0]` prefixed logs showing execution progress

3. **Verify executePipeline was called**
   - Server logs should show: `[v0] executePipeline: Creating pipeline`
   - Then: `[v0] executePipeline: Pipeline created with ID exec_...`
   - Then: `[v0] executePipeline: Pipeline execution triggered`

4. **Check the database**
   - Verify execution record exists in `pipelineExecutions` table
   - Status should be 'running'

---

## Issue: API returns 401 Unauthorized

### Solution
1. Ensure you're logged in (check auth session)
2. Verify `session?.user?.id` exists
3. Check auth configuration in `/src/lib/auth.ts`

---

## Issue: Agent not found error

### Symptoms
```
Error: Agent not found: Content Writer
Available agents: Keyword Research, Research, ...
```

### Solution
Ensure agent names match exactly between:
- `/src/lib/orchestrator/runner.ts` (initialization)
- `/app/api/pipeline/start/route.ts` (step configuration)

Case-sensitive! "Content Writer" ≠ "content writer"

---

## Issue: Database connection error

### Symptoms
```
Error: Failed to connect to database
```

### Solution
1. Verify DATABASE_URL in `.env.development.local`
2. Check Neon database is online
3. Run migrations: `pnpm db:push`

---

## Issue: Image generation fails

### Symptoms
```
Error: Image Generator agent failed
```

### Solution
1. Verify OPENAI_API_KEY is set
2. Check OpenAI account has credits
3. Verify model is available: `dall-e-3`

---

## Debugging Checklist

- [ ] ANTHROPIC_API_KEY is set
- [ ] OPENAI_API_KEY is set  
- [ ] DATABASE_URL is set
- [ ] Database migrations are applied
- [ ] User is logged in (auth session exists)
- [ ] Project exists in database
- [ ] Dev server is running (`npm run dev`)
- [ ] Build passes (`pnpm build`)

---

## Execution Flow Verification

The pipeline executes in this order. Each should complete before the next starts:

1. **Keyword Research** - Analyzes topic for keywords
2. **Research** - Gathers research findings
3. **Outline** - Creates article structure
4. **Content Writer** - Writes full article
5. **Fact Checker** - Validates claims
6. **Content Editor** - Refines and polishes
7. **SEO** - Optimizes for search
8. **Internal Linking** - Adds internal links
9. **Accessibility** - Ensures WCAG compliance
10. **Social** - Creates social posts
11. **Email** - Writes email campaign copy
12. **LinkedIn** - Creates LinkedIn post
13. **QA** - Final quality check
14. **Image Generator** - Creates images with DALL-E
15. **Publish** - Prepares for publishing
16. **Learning** - Learns from execution

If any step fails after 3 retries, the pipeline stops.

---

## Real-Time Monitoring

Watch execution in browser DevTools:

```javascript
// In browser console
fetch('/api/pipeline/stream?executionId=exec_YOUR_ID')
  .then(r => r.body.getReader())
  .then(reader => {
    reader.read().then(({ value, done }) => {
      if (!done) console.log(new TextDecoder().decode(value))
    })
  })
```

Or check database:
```sql
SELECT * FROM pipeline_executions WHERE id = 'exec_...' \gx
```

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Agent not found: X` | Agent not initialized in runner | Check runner.ts initialization |
| `Failed to execute pipeline` | Database error | Check DATABASE_URL |
| `Unauthorized` | Not logged in | Login with valid account |
| `Execution not found` | Wrong execution ID | Use correct ID from start response |
| `Failed to start pipeline` | API error | Check network tab in DevTools |

---

## Performance Tips

- Pipeline takes ~15-20 minutes total
- Each agent takes 1-3 minutes
- Token usage: 2,000-4,000 tokens per execution
- Cost: ~$0.08-0.15 per full execution

To make it faster:
- Reduce context size (fewer keywords)
- Reduce article length
- Skip some distribution steps

---

## Getting Logs

Server logs (full execution details):
```bash
tail -f /vercel/share/v0-project/.next/dev/logs/next-development.log
```

Database query log:
```bash
# In Neon dashboard, check query logs
```

Claude API usage:
```bash
# Check OpenAI dashboard for tokens and costs
```
