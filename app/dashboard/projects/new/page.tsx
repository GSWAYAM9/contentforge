'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { ProjectCreationForm } from '@/components/forms/project-creation-form'

export default function NewProjectPage() {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
          <h1 className="text-4xl font-heading font-bold text-white mb-2 flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            Create New Project
          </h1>
          <p className="text-muted-foreground">
            Set up a new content project and let AI generate amazing articles
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <GlassCard className="p-8">
              <ProjectCreationForm />
            </GlassCard>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* What Happens Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6" animated={false}>
                <h3 className="text-lg font-bold text-white mb-4">What Happens Next</h3>
                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Create Project', desc: 'Define your topic and channels' },
                    { step: 2, title: 'Configure Pipeline', desc: 'Choose content preferences' },
                    { step: 3, title: 'AI Generates', desc: '10 agents create your content' },
                    { step: 4, title: 'View Results', desc: 'Download and publish articles' },
                  ].map(item => (
                    <div key={item.step} className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* AI Agents Used */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6" animated={false}>
                <h3 className="text-lg font-bold text-white mb-4">AI Agents</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                    <span className="text-muted-foreground">Keyword Research</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                    <span className="text-muted-foreground">Research & Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                    <span className="text-muted-foreground">Content Outlining</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                    <span className="text-muted-foreground">Article Writing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                    <span className="text-muted-foreground">SEO Optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                    <span className="text-muted-foreground">Image Generation</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Pro Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-6 bg-blue-600/10 border border-blue-500/30" animated={false}>
                <h3 className="text-lg font-bold text-blue-100 mb-3">Pro Tips</h3>
                <ul className="space-y-2 text-sm text-blue-200/80">
                  <li>• Be specific with your topic for better results</li>
                  <li>• Include target audience details for personalization</li>
                  <li>• Use clear, descriptive channel names</li>
                </ul>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
