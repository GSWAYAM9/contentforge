# ContentForge - Quick Start Guide

## What's New

You now have a **complete, production-ready orchestration engine** for AI-powered content generation with:
- 10 specialized agents (Research, Writing, SEO, Social, Email, LinkedIn, etc.)
- Real-time monitoring dashboard
- Configuration management
- Automatic content generation pipeline

## Quick Setup

### 1. Start the Dev Server
```bash
cd /vercel/share/v0-project
pnpm dev
```

### 2. Create a Project
- Go to Dashboard
- Click "New Project"
- Enter topic, keywords, audience

### 3. Run Pipeline
- Open project
- Click "Start Pipeline" button
- Monitor progress in real-time
- View results as they generate

## Key Components

### Pipeline Controller
Located at top of project page when "pipeline" tab is active.
- **Start**: Begin content generation
- **Pause**: Pause current execution
- **Reset**: Clear and restart
- **Settings**: Configure pipeline parameters

### Pipeline Configuration
Click the settings icon to access:
- **Tone**: Choose writing style
- **Word Count**: Set target length
- **Audience**: Specify target readers
- **Custom Instructions**: Add specific requirements
- **Approval Gates**: Require human approval for outline/QA

### Monitor Tab
Click "Monitor" in sidebar to see:
- Real-time metrics (tokens, cost, time)
- Live event stream
- Current step progress
- Results display with download/copy

### Results Display
As pipeline runs, outputs appear automatically:
- Keywords identified
- Research completed
- Outline created
- Article written
- Social posts generated
- Email copy created

## Project Structure

```
src/
├── lib/
│   ├── agents/              # 10 AI agents
│   ├── orchestrator/        # Pipeline execution
│   └── hooks/
│       └── use-pipeline-stream.ts  # Real-time updates
├── components/project/
│   ├── pipeline-controller.tsx      # Controls
│   ├── pipeline-config-panel.tsx    # Settings
│   ├── pipeline-monitor.tsx         # Metrics
│   └── results-display.tsx          # Results
└── app/
    └── api/pipeline/
        ├── start/route.ts      # Initialize
        ├── status/route.ts     # Get status
        └── stream/route.ts     # Real-time events
```

## Common Tasks

### Configure Default Settings
1. Project page → Settings icon → Configure
2. Set your preferred tone, word count, etc.
3. Add custom instructions
4. Click Save

### Run Pipeline
1. Click "Start Pipeline" button
2. System auto-generates content step-by-step
3. Monitor progress in real-time
4. Download results when done

### Export Results
1. In Results Display section
2. Click copy icon to copy to clipboard
3. Or click download icon to save as text file

## API Endpoints

### Start Execution
```
POST /api/pipeline/start
{
  projectId: string,
  prompt: string,
  keywords: string[],
  tone: string,
  targetAudience: string
}
```

### Get Status
```
GET /api/pipeline/status?executionId={id}
```

### Real-Time Stream
```
GET /api/pipeline/stream?executionId={id}
(Server-Sent Events)
```

## Performance Tips

1. **Faster Results**: Reduce word count requirement
2. **Lower Cost**: Use fewer custom instructions
3. **Better Quality**: Enable approval gates
4. **Parallel**: Run multiple pipelines (system handles automatically)

## Troubleshooting

### Pipeline Won't Start
- ✓ Check ANTHROPIC_API_KEY is set
- ✓ Verify DATABASE_URL is valid
- ✓ Check project exists

### Real-time Updates Not Working
- ✓ Check browser supports EventSource
- ✓ Verify `/api/pipeline/stream` is accessible
- ✓ Check execution status in database

### High Costs
- ✓ Reduce word count
- ✓ Simplify custom instructions
- ✓ Use fewer agents/sections

## Files to Know

### Key Implementation Files
- `app/project/[id]/page.tsx` - Main project page
- `src/components/project/pipeline-*` - UI components
- `app/api/pipeline/*/route.ts` - API endpoints
- `src/lib/agents/*.ts` - AI agents
- `src/lib/hooks/use-pipeline-stream.ts` - Real-time hook

### Documentation
- `ORCHESTRATION_GUIDE.md` - Full technical guide
- `IMPLEMENTATION_COMPLETE.md` - Project status
- `QUICK_START.md` - This file

## Next Steps

1. **Test the Pipeline**: Run a test execution
2. **Configure Settings**: Customize for your needs
3. **Monitor Execution**: Watch real-time progress
4. **Export Results**: Download generated content
5. **Deploy**: Push to production when ready

## Support Resources

- Full docs: See `ORCHESTRATION_GUIDE.md`
- Architecture: See `IMPLEMENTATION_COMPLETE.md`
- Code: Check inline comments and TypeScript types

---

You're all set! The orchestration engine is ready to generate high-quality content. Start with a test project to see it in action.
