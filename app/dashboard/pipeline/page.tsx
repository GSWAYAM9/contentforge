'use client'

import { motion } from 'framer-motion'
import { Play, Pause, RotateCw, AlertCircle, CheckCircle2, Clock, Zap, Plus } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'

const pipelines = [
  {
    id: 1,
    name: 'AI Writing Guide',
    project: 'AI Writing Guide - Q3 2024',
    status: 'running',
    progress: 60,
    currentStep: 'Image Generation',
    currentAgent: 'OpenAI (DALL-E 3)',
    agentModel: 'OpenAI',
    totalSteps: 10,
    completedSteps: 6,
    startedAt: new Date(Date.now() - 5 * 60000),
    estimatedTime: '2m 30s',
    tokenUsage: 3421,
    estimatedCost: 0.0145,
    agents: ['Keyword Research', 'Research', 'Outline', 'Writer', 'SEO', 'Image Generation'],
  },
  {
    id: 2,
    name: 'Marketing Strategy',
    project: 'Marketing Strategy',
    status: 'completed',
    progress: 100,
    currentStep: 'Publishing',
    currentAgent: 'Claude 3.5 Sonnet',
    agentModel: 'Claude',
    totalSteps: 10,
    completedSteps: 10,
    completedAt: new Date(Date.now() - 15 * 60000),
    totalTime: '12m 45s',
    tokenUsage: 8934,
    estimatedCost: 0.0342,
    agents: ['Keyword Research', 'Research', 'Outline', 'Writer', 'SEO', 'Social', 'Email', 'LinkedIn', 'QA', 'Publish'],
  },
  {
    id: 3,
    name: 'Product Launch',
    project: 'Product Launch',
    status: 'paused',
    progress: 40,
    currentStep: 'Content Review',
    currentAgent: 'Claude 3.5 Sonnet',
    agentModel: 'Claude',
    totalSteps: 10,
    completedSteps: 4,
    pausedAt: new Date(Date.now() - 3 * 60000),
    tokenUsage: 4120,
    estimatedCost: 0.0167,
    agents: ['Keyword Research', 'Research', 'Outline', 'Writer'],
  },
  {
    id: 4,
    name: 'Blog Series',
    project: 'Blog Series - 2024',
    status: 'queued',
    progress: 0,
    currentStep: 'Waiting to start',
    currentAgent: 'Claude 3.5 Sonnet',
    agentModel: 'Claude',
    totalSteps: 10,
    completedSteps: 0,
    queuedAt: new Date(Date.now() - 1 * 60000),
    tokenUsage: 0,
    estimatedCost: 0,
    agents: ['Keyword Research', 'Research', 'Outline', 'Writer', 'SEO', 'Social', 'Email', 'LinkedIn', 'QA', 'Publish'],
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running':
      return <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-green-400" />
    case 'paused':
      return <Pause className="w-5 h-5 text-yellow-400" />
    case 'queued':
      return <Clock className="w-5 h-5 text-gray-400" />
    default:
      return <AlertCircle className="w-5 h-5 text-red-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'from-blue-600/20 to-cyan-600/20 border-blue-500/30'
    case 'completed':
      return 'from-green-600/20 to-emerald-600/20 border-green-500/30'
    case 'paused':
      return 'from-yellow-600/20 to-orange-600/20 border-yellow-500/30'
    case 'queued':
      return 'from-gray-600/20 to-slate-600/20 border-gray-500/30'
    default:
      return 'from-red-600/20 to-pink-600/20 border-red-500/30'
  }
}

export default function PipelinePage() {
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
              Pipeline Manager
            </h1>
            <p className="text-muted-foreground">
              Monitor and control content generation pipelines
            </p>
          </div>
          <Link href="/dashboard/projects">
            <AnimatedButton variant="primary" size="lg" icon={<Plus className="h-5 w-5" />}>
              New Pipeline
            </AnimatedButton>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl bg-gradient-to-br from-blue-600/10 to-cyan-600/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Running</p>
                  <p className="text-3xl font-bold text-white">1</p>
                </div>
                <Zap className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl bg-gradient-to-br from-green-600/10 to-emerald-600/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Completed</p>
                  <p className="text-3xl font-bold text-white">1</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400 opacity-50" />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl bg-gradient-to-br from-yellow-600/10 to-orange-600/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Paused</p>
                  <p className="text-3xl font-bold text-white">1</p>
                </div>
                <Pause className="w-8 h-8 text-yellow-400 opacity-50" />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl bg-gradient-to-br from-gray-600/10 to-slate-600/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Queued</p>
                  <p className="text-3xl font-bold text-white">1</p>
                </div>
                <Clock className="w-8 h-8 text-gray-400 opacity-50" />
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* AI Models Legend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-4 backdrop-blur-xl bg-purple-600/10 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Claude 3.5 Sonnet</p>
                  <p className="text-xs text-muted-foreground">Anthropic - Text & Content Generation</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-4 backdrop-blur-xl bg-blue-600/10 border border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-white">OpenAI DALL-E 3</p>
                  <p className="text-xs text-muted-foreground">OpenAI - Image Generation</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Pipelines List */}
        <div className="space-y-4">
          {pipelines.map((pipeline, index) => (
            <motion.div
              key={pipeline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <GlassCard className={`p-6 border bg-gradient-to-r ${getStatusColor(pipeline.status)} backdrop-blur-xl`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(pipeline.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-white">{pipeline.name}</h3>
                        <p className="text-sm text-muted-foreground">{pipeline.project}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {pipeline.status === 'running' && (
                      <>
                        <AnimatedButton
                          variant="secondary"
                          size="sm"
                          icon={<Pause className="h-4 w-4" />}
                        >
                          Pause
                        </AnimatedButton>
                        <AnimatedButton
                          variant="secondary"
                          size="sm"
                          icon={<AlertCircle className="h-4 w-4" />}
                        >
                          Stop
                        </AnimatedButton>
                      </>
                    )}
                    {pipeline.status === 'paused' && (
                      <AnimatedButton
                        variant="secondary"
                        size="sm"
                        icon={<Play className="h-4 w-4" />}
                      >
                        Resume
                      </AnimatedButton>
                    )}
                    {pipeline.status === 'queued' && (
                      <AnimatedButton
                        variant="secondary"
                        size="sm"
                        icon={<Play className="h-4 w-4" />}
                      >
                        Start Now
                      </AnimatedButton>
                    )}
                    {pipeline.status === 'completed' && (
                      <AnimatedButton
                        variant="secondary"
                        size="sm"
                        icon={<RotateCw className="h-4 w-4" />}
                      >
                        Rerun
                      </AnimatedButton>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Step {pipeline.completedSteps} of {pipeline.totalSteps}
                    </span>
                    <span className="text-sm font-semibold text-white">{pipeline.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pipeline.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">Current Step:</span>
                    <p className="text-white font-medium">{pipeline.currentStep}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">AI Model:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${pipeline.agentModel === 'Claude' ? 'bg-purple-400' : 'bg-blue-400'}`} />
                      <p className="text-white font-medium text-xs">{pipeline.currentAgent}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tokens Used:</span>
                    <p className="text-white font-medium">{pipeline.tokenUsage.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Cost:</span>
                    <p className="text-white font-medium">${pipeline.estimatedCost.toFixed(4)}</p>
                  </div>
                </div>

                {/* Time Info */}
                <div className="flex flex-wrap gap-6 text-sm mb-4">
                  {pipeline.status === 'running' && pipeline.estimatedTime && (
                    <div>
                      <span className="text-muted-foreground">Est. Time:</span>
                      <p className="text-white font-medium">{pipeline.estimatedTime}</p>
                    </div>
                  )}
                  {pipeline.status === 'completed' && pipeline.totalTime && (
                    <div>
                      <span className="text-muted-foreground">Total Time:</span>
                      <p className="text-white font-medium">{pipeline.totalTime}</p>
                    </div>
                  )}
                </div>

                {/* Agents Timeline */}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">PIPELINE AGENTS</p>
                  <div className="flex flex-wrap gap-2">
                    {pipeline.agents.map((agent, idx) => (
                      <motion.div
                        key={agent}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          idx < pipeline.completedSteps
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : idx === Math.floor(pipeline.completedSteps)
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}
                      >
                        {agent}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
