'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileText,
  Zap,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { CreateDemoProject } from '@/components/dashboard/create-demo-project'

const quickActions = [
  { icon: Sparkles, label: 'New Project', href: '/dashboard/projects/new' },
  { icon: FileText, label: 'Create Article', href: '#' },
  { icon: Zap, label: 'AI Tools', href: '#' },
  { icon: TrendingUp, label: 'Analytics', href: '#' },
]

// Real projects will be fetched from database
const recentProjects = [
  {
    id: 1,
    name: 'AI Writing Guide',
    status: 'Published',
    date: '2 days ago',
    platform: 'Blog',
  },
  {
    id: 2,
    name: 'Marketing Strategy',
    status: 'Draft',
    date: 'Today',
    platform: 'Blog',
  },
  {
    id: 3,
    name: 'Product Launch',
    status: 'In Review',
    date: 'Yesterday',
    platform: 'Blog',
  },
]

const stats = [
  { label: 'Total Articles', value: '24', change: '+3 this month' },
  { label: 'Published', value: '18', change: '+2 this week' },
  { label: 'AI Credits Used', value: '450/1000', change: '45% utilization' },
  { label: 'Avg. Engagement', value: '3.2k', change: '+12% vs last month' },
]

// Hardcoded user for now - in production this would come from session
const DEMO_USER = {
  id: '1',
  name: 'Swayam Gupta',
  email: 'gswayam94@gmail.com'
}

export default function DashboardPage() {
  const [user] = useState(DEMO_USER)

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white mb-2">
              Welcome back, {user?.name || 'there'}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your content today
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user && <CreateDemoProject userId={user.id} />}
            <AnimatedButton variant="primary" size="lg" icon={<Sparkles className="h-5 w-5" />}>
              Start New Project
            </AnimatedButton>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <GlassCard className="p-6" delay={index}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {stat.value}
                    </h3>
                  </div>
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Projects */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-white">
                Recent Projects
              </h2>
              <Link
                href="/dashboard/projects"
                className="text-sm text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <GlassCard className="overflow-hidden" animated={false}>
              <div className="divide-y divide-white/10">
                {recentProjects.map((project, index) => (
                  <Link key={project.id} href={`/project/${project.id}`}>
                    <motion.div
                      className="p-6 hover:bg-white/5 transition cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white mb-1">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{project.platform}</span>
                            <span>•</span>
                            <span>{project.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.status === 'Published'
                                ? 'bg-green-500/10 text-green-400'
                                : project.status === 'In Review'
                                  ? 'bg-yellow-500/10 text-yellow-400'
                                  : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            {project.status}
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          </motion.section>

          {/* Publishing Calendar */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <h2 className="text-xl font-heading font-bold text-white mb-6">
              Publishing Calendar
            </h2>
            <GlassCard className="p-8" animated={false}>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mr-3" />
                <div>
                  <p className="text-center">Calendar feature coming soon</p>
                  <p className="text-xs text-muted-foreground/70 text-center mt-1">
                    Schedule and manage your content
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <h3 className="text-lg font-heading font-bold text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition group"
                  >
                    <action.icon className="h-5 w-5 text-purple-400 group-hover:text-purple-300" />
                    <span className="text-sm font-medium text-white group-hover:text-white">
                      {action.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* AI Usage */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          >
            <h3 className="text-lg font-heading font-bold text-white mb-4">
              AI Usage
            </h3>
            <GlassCard className="p-6" animated={false}>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Monthly Credits</p>
                    <p className="text-sm font-bold text-white">450 / 1000</p>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-cyan-500 h-full rounded-full"
                      style={{ width: '45%' }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-muted-foreground mb-3">
                    Upgrade to Pro for more credits
                  </p>
                  <AnimatedButton
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    Upgrade Plan
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          </motion.section>

          {/* Workspace Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <h3 className="text-lg font-heading font-bold text-white mb-4">
              Workspace Plan
            </h3>
            <GlassCard className="p-6" animated={false}>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-white">Premium Plus</p>
                  <p className="text-xs text-muted-foreground">Unlimited projects</p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-muted-foreground mb-3">
                    Auto-renews March 15, 2025
                  </p>
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    Manage Billing
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          </motion.section>
        </div>
      </div>

      {/* Footer Stats */}
      <motion.div
        className="flex items-center justify-between text-xs text-muted-foreground pt-8 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Last updated 5 minutes ago</p>
        <p>
          Need help? Check out our{' '}
          <Link
            href="#"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            documentation
          </Link>
        </p>
      </motion.div>
    </DashboardLayout>
  )
}
