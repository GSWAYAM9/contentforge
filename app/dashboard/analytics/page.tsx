'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, FileText, Zap, Calendar, Download } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white mb-2">
              Analytics
            </h1>
            <p className="text-muted-foreground">
              Track performance and usage metrics across your projects
            </p>
          </div>
          <div className="flex gap-3">
            <AnimatedButton
              variant="secondary"
              size="lg"
              icon={<Calendar className="h-5 w-5" />}
            >
              This Month
            </AnimatedButton>
            <AnimatedButton
              variant="secondary"
              size="lg"
              icon={<Download className="h-5 w-5" />}
            >
              Export
            </AnimatedButton>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-600/20">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-muted-foreground text-sm mb-1">Total Articles</p>
              <h3 className="text-3xl font-bold text-white mb-1">127</h3>
              <p className="text-xs text-green-400">+12% from last month</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-600/20">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-muted-foreground text-sm mb-1">Avg. Engagement</p>
              <h3 className="text-3xl font-bold text-white mb-1">4.2K</h3>
              <p className="text-xs text-green-400">+8% from last month</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/20">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-600/20">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-muted-foreground text-sm mb-1">Total Credits Used</p>
              <h3 className="text-3xl font-bold text-white mb-1">12,450</h3>
              <p className="text-xs text-green-400">+5% from last month</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl bg-gradient-to-br from-orange-600/10 to-yellow-600/10 border border-orange-500/20">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-600/20">
                  <FileText className="w-6 h-6 text-orange-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-muted-foreground text-sm mb-1">Avg. Read Time</p>
              <h3 className="text-3xl font-bold text-white mb-1">5.2 min</h3>
              <p className="text-xs text-green-400">+3% from last month</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Content Generation Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6 backdrop-blur-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6">
                Content Generation Trend
              </h3>
              <div className="h-64 flex items-end justify-around gap-2 bg-white/5 rounded-lg p-6">
                {[45, 52, 38, 65, 72, 58, 81].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height * 2}px` }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-purple-600 to-cyan-500 rounded-t-lg opacity-70 hover:opacity-100 transition-opacity"
                    title={`Week ${i + 1}: ${height} articles`}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <span>Week 1</span>
                <span>Week 4</span>
                <span>Week 7</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Top Performing Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                Top Content
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'AI Guide 2024', views: 2400 },
                  { title: 'Web Dev Tips', views: 1800 },
                  { title: 'SEO Best Practices', views: 1600 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm text-white font-medium truncate">{item.title}</span>
                    <span className="text-xs text-muted-foreground ml-2">{item.views}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6">API Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Claude API Calls</span>
                    <span className="text-sm font-semibold text-white">8,234 / 10,000</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">OpenAI Tokens</span>
                    <span className="text-sm font-semibold text-white">45,678 / 50,000</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-11/12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Storage Used</span>
                    <span className="text-sm font-semibold text-white">225 GB / 500 GB</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Project Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                Project Performance
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'AI Writing Guide', success: 95, time: '4m 23s' },
                  { name: 'Marketing Strategy', success: 88, time: '6m 15s' },
                  { name: 'Product Launch', success: 92, time: '5m 42s' },
                ].map((project, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white">{project.name}</span>
                      <span className="text-xs text-green-400">{project.success}% success</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden mr-3">
                        <div
                          className="h-full bg-gradient-to-r from-green-600 to-emerald-500"
                          style={{ width: `${project.success}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{project.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
