# ContentForge AI - Premium SaaS Dashboard

A world-class AI-powered content publishing platform built with cutting-edge technologies and premium design patterns.

## 🎨 Design System

### Color Palette
- **Background**: `#09090B` - Ultra-dark background
- **Primary Card**: `#111113` - Subtle elevation
- **Secondary Card**: `#18181B` - Medium elevation
- **Text Primary**: `#FAFAFA` - High contrast text
- **Text Secondary**: `#A1A1AA` - Muted text
- **Accent Gradient**: Purple (`#7C3AED`) to Cyan (`#06B6D4`)
- **Border**: `rgba(255,255,255,.08)` - Subtle separation

### Typography
- **Headings**: Space Grotesk (700, 600, 500)
- **Body**: Inter (400, 500, 600)
- **Large typography** for confident, premium feel

### Visual Effects
- Glass morphism cards with backdrop blur
- Subtle gradient accents
- Smooth Framer Motion animations
- Border glow on hover states
- Minimal, clean design language

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   └── dashboard/
│       ├── projects/
│       ├── settings/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── animated-button.tsx
│   │   └── premium-input.tsx
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── navbar.tsx
│   │   └── dashboard-layout.tsx
│   └── shared/
│       ├── cards/
│       │   └── glass-card.tsx
│       └── logo.tsx
└── lib/
    ├── types/
    ├── hooks/
    ├── constants/
    └── utils/
```

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes (Dark Mode)
- **Icons**: Lucide Icons
- **Notifications**: Sonner
- **Fonts**: Space Grotesk (headings) + Inter (body)

## 🎯 Features

### Authentication Pages
- **Login Page** - Premium glass card with email/password fields
- **Signup Page** - Complete registration with validation
- Animated backgrounds with gradient blobs
- Smooth transitions and error handling

### Dashboard
- **Hero Section** - Welcome message with quick action button
- **Stats Cards** - Real-time metrics display
- **Recent Projects** - Latest content items
- **Quick Actions** - Fast access to core functions
- **AI Usage** - Credit utilization and upgrade path
- **Workspace Info** - Plan details and billing

### Navigation
- **Sidebar** - Collapsible navigation with 8 menu items
  - Dashboard, Projects, Pipeline, Analytics
  - Calendar, Templates, Media Library, Settings
  - Storage & Credits progress indicators
  - Support and Logout options
- **Top Navbar** - Search, notifications, theme toggle, profile dropdown
- **Breadcrumbs** - Navigation context (ready for implementation)

### Pages
1. **Dashboard** (`/dashboard`) - Main hub with overview
2. **Projects** (`/dashboard/projects`) - Project management
3. **Settings** (`/dashboard/settings`) - User preferences
4. **Login** (`/auth/login`) - Authentication
5. **Signup** (`/auth/signup`) - Account creation

## 🎬 Animations

- **Page Transitions** - Smooth fade and slide animations
- **Card Hover** - Elevation and glow effects
- **Sidebar Toggle** - Smooth collapse/expand
- **Loading States** - Spinner animations on buttons
- **Background** - Animated gradient blobs

## 📱 Responsive Design

- **Desktop** (1440px+) - Full layout with sidebar
- **Tablet** (768px-1439px) - Collapsible sidebar
- **Mobile** (< 768px) - Drawer navigation (ready)
- No overflow, perfect spacing at all breakpoints

## 🎨 Component Library

### Reusable Components
- `GlassCard` - Premium glass morphism container
- `AnimatedButton` - Multi-variant animated button
- `PremiumInput` - Styled input with icon support
- `Logo` - Branded logo component
- `DashboardLayout` - Main layout wrapper
- `Sidebar` - Navigation sidebar
- `Navbar` - Top navigation bar

## 🔄 State Management

Ready for integration with:
- React Context (lightweight state)
- SWR (data fetching & caching)
- React Query (server state)
- Zustand (global state)

## 🔐 Authentication

Placeholder for authentication implementation:
- Email + Password ready
- Form validation with Zod
- Error handling UI
- Session management ready

## 📊 Future Enhancements

### Phase 2 - AI Pipeline
- Content generation agents
- SEO optimization
- Image generation
- Fact checking
- LinkedIn publishing

### Phase 3 - Analytics
- Article performance metrics
- Engagement tracking
- Publishing calendar
- Team collaboration

### Phase 4 - Integrations
- LinkedIn API
- Twitter API
- Blog platforms
- Email services

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit `http://localhost:3000` to see the application.

## 📝 Environment Variables

```env
# Add authentication secrets here
BETTER_AUTH_SECRET=your_secret_key

# Add API keys for AI services
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key

# Database (when implemented)
DATABASE_URL=your_database_url
```

## 🎯 Design Inspiration

This application is inspired by:
- **Vercel Dashboard** - Clean, minimal design
- **Linear** - Polished, premium feel
- **Notion AI** - Elegant interactions
- **Arc Browser** - Modern aesthetics
- **Stripe Dashboard** - Professional SaaS design
- **Raycast** - Premium micro-interactions

## 📄 License

MIT

## 🤝 Contributing

This project is ready for team collaboration. Follow the established patterns when adding new features:
- Use glass cards for containers
- Implement Framer Motion for transitions
- Follow the color system consistently
- Use semantic HTML and ARIA labels
- Maintain the premium, minimal aesthetic

---

Built with ❤️ for premium SaaS experiences
