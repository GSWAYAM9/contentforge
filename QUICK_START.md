# ContentForge AI - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Verify Environment Variables
Your API keys are already configured. Verify in Vercel:
1. Go to Project Settings
2. Environment Variables
3. Confirm `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` are set

### Step 2: Start the Development Server
```bash
cd /vercel/share/v0-project
pnpm dev
```

Server runs at: http://localhost:3000

### Step 3: Access the Application
- **Dashboard:** http://localhost:3000/dashboard
- **Projects:** http://localhost:3000/dashboard/projects
- **Settings:** http://localhost:3000/dashboard/settings

### Step 4: Create Your First Project
1. Click "Start New Project"
2. Enter project name and topic
3. Configure AI settings
4. Start the pipeline

### Step 5: Watch AI in Action
- Content generation (Claude AI)
- Image generation (DALL-E 3)
- Real-time execution tracking
- Cost monitoring

---

## 📁 Key Files & Routes

### Main Routes
```
/dashboard              - Main dashboard
/dashboard/projects    - Projects list
/project/[id]          - Project workspace
/project/[id]/settings - Project settings
/project/[id]/analytics - Analytics
/dashboard/settings    - Account settings
/dashboard/api-usage   - API monitoring
```

### API Test
```
/test-ai-apis          - API integration test page
```

### Content Generation
- **Claude:** `src/app/actions/ai-generation.ts`
- **OpenAI:** `src/app/actions/image-generation.ts`

---

## 🎯 Core Features

### 1. Project Pipeline
- Create 5-stage content pipelines
- Stages: Research → Outline → Draft → SEO → Final
- Real-time execution monitoring
- Live logs and metrics

### 2. AI Integration
**Claude 3.5 Sonnet:**
- Generate blog posts
- Create outlines
- Extract keywords
- Improve content

**DALL-E 3 HD:**
- Generate featured images
- Professional styling
- Batch generation
- Cost tracking

### 3. Content Management
- Article preview with reading progress
- Image gallery with carousel
- Comment threading
- Approval workflows

### 4. Analytics
- Execution metrics dashboard
- Cost analysis
- Agent performance
- API usage tracking

### 5. Account Management
- User profiles
- Password management
- Notification settings
- Activity tracking

---

## 🔑 API Keys

Your API keys are already configured. If you need to update them:

### Anthropic (Claude)
1. Get key from: https://console.anthropic.com/
2. Set as `ANTHROPIC_API_KEY`

### OpenAI
1. Get key from: https://platform.openai.com/api-keys
2. Set as `OPENAI_API_KEY`

---

## 📊 Monitoring

### API Usage Dashboard
Visit `/dashboard/api-usage` to track:
- Daily API calls
- Cost breakdown
- Rate limits
- Usage trends

### Project Analytics
Visit `/project/[id]/analytics` to see:
- KPI cards
- Execution timeline
- Stage success rates
- Cost analysis

---

## 🐛 Troubleshooting

### API Not Working?
1. Check API keys are set in Vercel
2. Visit `/test-ai-apis` to diagnose
3. Check console for error messages

### Build Errors?
```bash
# Clear cache and rebuild
rm -rf .next
pnpm build
```

### Database Issues?
```bash
# Verify database connection
pnpm run db:check
```

---

## 📚 Documentation

- **API Guide:** `API_INTEGRATION_GUIDE.md`
- **Setup Guide:** `ENV_SETUP_GUIDE.md`
- **Full Report:** `FINAL_COMPLETION_REPORT.md`

---

## 🎨 UI Components

All components use:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **shadcn/ui** component patterns
- **Responsive Design** (mobile-first)

---

## 💡 Next Steps

1. ✅ Test APIs: Visit `/test-ai-apis`
2. ✅ Create project: Go to Dashboard
3. ✅ Monitor usage: Check `/dashboard/api-usage`
4. ✅ Customize settings: Visit `/dashboard/settings`
5. ✅ Track analytics: View `/project/[id]/analytics`

---

## 🚀 Deployment

### Deploy to Vercel
```bash
# Push to Git
git add .
git commit -m "Deploy ContentForge AI"
git push

# Vercel automatically deploys from Git
```

### Environment Variables in Vercel
1. Go to Project Settings
2. Add `ANTHROPIC_API_KEY`
3. Add `OPENAI_API_KEY`
4. Deploy

---

## 📞 Support

### Resources
- API Documentation: See `API_INTEGRATION_GUIDE.md`
- Database Schema: Check `src/lib/db/schema.ts`
- Test Page: Visit `/test-ai-apis`

### Common Tasks

**Generate Content:**
```typescript
import { generateContentWithClaude } from '@/app/actions/ai-generation'
const result = await generateContentWithClaude(prompt, topic)
```

**Generate Images:**
```typescript
import { generateImageWithOpenAI } from '@/app/actions/image-generation'
const result = await generateImageWithOpenAI(prompt, style)
```

**Track Metrics:**
```typescript
import { logActivity } from '@/app/actions/activity-logs'
await logActivity('content_generated', 'project', {...})
```

---

## ✅ Verification Checklist

- [ ] API keys configured in Vercel
- [ ] Dev server running (`pnpm dev`)
- [ ] Dashboard loads at localhost:3000/dashboard
- [ ] Can create new project
- [ ] API test page works (`/test-ai-apis`)
- [ ] Analytics dashboard displays
- [ ] Settings pages accessible
- [ ] Project pipeline visible

---

## 🎉 You're All Set!

ContentForge AI is ready to use. Start creating amazing content with AI!

**Happy Content Creating! 🚀**
