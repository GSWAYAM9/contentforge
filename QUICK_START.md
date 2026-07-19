# ContentForge AI - Quick Start: Generate Your Articles

## WHERE TO GENERATE ARTICLES

You can now generate articles in **3 easy steps**:

### Step 1: Create a Project
**Go to**: `/dashboard/projects/new`

1. Click **"New Project"** button (top right of dashboard)
2. Fill in:
   - **Project Name**: "My First Article"
   - **Topic**: "Best practices for AI content creation"
   - **Description**: (optional) Any additional context
   - **Channels**: Select where to publish (Blog, LinkedIn, Twitter, Email, Social)
3. Click **"Create Project"**

**New Page Created**: `app/dashboard/projects/new/page.tsx`
**Component**: `ProjectCreationForm` - Full form validation and submission

### Step 2: Start a Pipeline
**From**: Project detail page at `/project/[id]`

1. Click **"Start Pipeline"** button
2. OR go directly to `/dashboard/pipeline/new?projectId=[id]`
3. Configure:
   - **Article Topic**: Confirm the topic
   - **Keywords** (optional): SEO keywords separated by commas
   - **Content Length**: Short, Medium, or Long
   - **Writing Tone**: Professional, Casual, Friendly, Academic, Technical, or Creative
4. Click **"Start Pipeline"**

**New Page Created**: `app/dashboard/pipeline/new/page.tsx`
**Component**: `PipelineExecutionForm` - Full configuration interface

### Step 3: Monitor & View Results
**From**: Project detail page - **Monitor** tab

1. Watch real-time progress as 10 AI agents generate your content:
   - Keyword Research (Claude)
   - Research & Analysis (Claude)
   - Content Outlining (Claude)
   - Article Writing (Claude)
   - SEO Optimization (Claude)
   - Social Media Content (Claude)
   - Email Marketing Copy (Claude)
   - LinkedIn Content (Claude)
   - Quality Assurance (Claude)
   - Image Generation (OpenAI DALL-E 3)

2. Once complete, view tabs:
   - **Article**: Full 1000-2000 word article
   - **Keywords**: Extracted SEO keywords
   - **SEO**: Meta title & description
   - **Social**: Twitter & LinkedIn posts
   - **Email**: Marketing email copy

**Updated Component**: `ResultsDisplay` - Full-featured results viewer with copy/download

---

## COMPLETE WORKFLOW

```
Dashboard (/dashboard)
  ↓ [Click "New Project"]
  ↓
Create Project (/dashboard/projects/new)
  ↓ [Fill form + Submit]
  ↓
Project Created (/project/[id])
  ↓ [Click "Start Pipeline"]
  ↓
Configure Pipeline (/dashboard/pipeline/new)
  ↓ [Set preferences + Submit]
  ↓
Real-Time Monitor (/project/[id]?tab=monitor)
  ↓ [Watch 10 agents work]
  ↓
Results Display (Tabs: Article, Keywords, SEO, Social, Email)
  ↓ [Copy/Download content]
```

---

## NEW FILES CREATED

### Pages
- `app/dashboard/projects/new/page.tsx` - Project creation form page
- `app/dashboard/pipeline/new/page.tsx` - Pipeline configuration page

### Components
- `src/components/forms/project-creation-form.tsx` - Project creation form component
- `src/components/project/results-display.tsx` - Enhanced results viewer

### Server Actions
- `src/app/actions/pipeline-execution.ts` - Pipeline execution logic
  - `executePipeline()` - Start pipeline with 10 agents
  - `getPipelineExecution()` - Get execution status

### Updated Files
- `app/dashboard/page.tsx` - Added links to new project page
- `app/dashboard/projects/page.tsx` - Shows user's projects with search
- `app/dashboard/pipeline/page.tsx` - Pipeline manager with new pipeline link
- `app/project/[id]/page.tsx` - Project detail with monitor tab

---

## HOW IT WORKS

### 1. Database Schema
```typescript
// projects table
id, userId, name, topic, description, channels, status, createdAt, updatedAt

// pipeline_steps table
id, projectId, userId, stepName, agent, status, content, createdAt, updatedAt
```

### 2. AI Models Used

**Claude 3.5 Sonnet** (Anthropic)
- 9 agents: Keywords, Research, Outline, Writer, SEO, Social, Email, LinkedIn, QA
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens

**OpenAI DALL-E 3**
- 1 agent: Image Generation
- Standard: $0.04 per image
- HD: $0.08 per image

### 3. Real-Time Tracking
- Token usage tracked per agent
- Cost calculated in real-time
- Progress shown in visual timeline
- Status updates via server events

---

## KEY FEATURES IMPLEMENTED

✅ **Project Management**
- Create projects with topic & channels
- List all user projects with search
- Project detail overview page

✅ **Pipeline Configuration**
- Choose content length (Short/Medium/Long)
- Select writing tone (6 options)
- Add SEO keywords
- View agent sequence
- See estimated cost

✅ **Real-Time Execution**
- 10 AI agents process sequentially
- Real-time progress monitoring
- Token usage tracking
- Cost breakdown per step

✅ **Results Display**
- Tab-based content viewer
- Article, Keywords, SEO, Social, Email tabs
- Copy-to-clipboard for all sections
- Download full article
- Cost summary

✅ **Navigation**
- Dashboard → New Project
- Projects list with search
- Pipeline manager
- Project detail tabs

---

## COST BREAKDOWN

| Step | AI Model | Estimated Cost |
|------|----------|----------------|
| 1. Keywords | Claude | $0.001-0.002 |
| 2. Research | Claude | $0.002-0.003 |
| 3. Outline | Claude | $0.001-0.002 |
| 4. Article | Claude | $0.01-0.02 |
| 5. SEO | Claude | $0.002-0.003 |
| 6. Social | Claude | $0.002-0.003 |
| 7. Email | Claude | $0.002-0.003 |
| 8. LinkedIn | Claude | $0.002-0.003 |
| 9. QA | Claude | $0.002-0.003 |
| 10. Images | OpenAI | $0.04-0.08 |
| **Total** | **Mixed** | **$0.07-0.13** |

---

## ENVIRONMENT VARIABLES

Make sure these are set:
```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
DATABASE_URL=...
NEXTAUTH_SECRET=...
```

---

## TROUBLESHOOTING

### "No projects yet" message
- ✓ Click "New Project" button
- ✓ Fill in project details
- ✓ Submit the form

### Pipeline won't start
- ✓ Verify API keys are set in environment
- ✓ Check project was created successfully
- ✓ Refresh the page and try again

### Results not showing
- ✓ Wait for all agents to complete
- ✓ Click "Monitor" tab to see real-time progress
- ✓ Check browser console for errors

### Missing content sections
- ✓ Wait for pipeline to finish all 10 agents
- ✓ Some sections appear as agents complete
- ✓ Refresh results display to update

---

## QUICK LINKS

| Action | URL |
|--------|-----|
| Dashboard | `/dashboard` |
| Create Project | `/dashboard/projects/new` |
| My Projects | `/dashboard/projects` |
| Pipeline Manager | `/dashboard/pipeline` |
| View Project | `/project/[id]` |

---

## NEXT STEPS

1. ✓ Go to `/dashboard`
2. ✓ Click "New Project"
3. ✓ Fill in project details
4. ✓ Click "Create Project"
5. ✓ Click "Start Pipeline"
6. ✓ Configure pipeline settings
7. ✓ Click "Start Pipeline"
8. ✓ Watch real-time progress
9. ✓ View generated content in tabs
10. ✓ Copy or download your article

---

**You're all set! Your complete article generation workflow is ready to use.**
