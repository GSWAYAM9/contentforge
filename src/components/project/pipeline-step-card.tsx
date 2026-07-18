'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Zap, RotateCw, Eye, Clock, Play, CheckCircle2, XCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { runPipelineStep, requestApproval } from '@/app/actions/project-operations'
import { generateContentWithClaude } from '@/app/actions/ai-generation'
import { generateImageWithOpenAI } from '@/app/actions/image-generation'

interface Stage {
  id: number
  name: string
  status: string
  agent?: string
  content?: string
  icon?: string
  duration?: string
  tokens?: number
  projectId?: string
}

interface PipelineStepCardProps {
  stage: Stage
  isExpanded: boolean
  onExpand: () => void
  projectId?: string
  onStepUpdated?: () => void
}

const statusConfig: Record<string, { bg: string; border: string; text: string; icon: string; label: string }> = {
  pending: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-300', icon: '⏳', label: 'Pending' },
  queued: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', icon: '📋', label: 'Queued' },
  in_progress: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-300', icon: '⚡', label: 'Running' },
  running: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-300', icon: '⚡', label: 'Running' },
  waiting: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-300', icon: '⏸️', label: 'Awaiting Approval' },
  completed: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-300', icon: '✅', label: 'Completed' },
  failed: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300', icon: '❌', label: 'Failed' },
}

export function PipelineStepCard({ stage, isExpanded, onExpand, projectId, onStepUpdated }: PipelineStepCardProps) {
  const config = statusConfig[stage.status] || statusConfig['pending']
  const [isLoading, setIsLoading] = useState(false)
  
  // Parse content JSON safely
  let parsedContent: any = {}
  try {
    if (stage.content) {
      parsedContent = JSON.parse(stage.content)
    }
  } catch (e) {
    console.error('Failed to parse stage content:', e)
  }

  const handleRunStep = async () => {
    if (!projectId) return
    setIsLoading(true)
    try {
      await runPipelineStep(projectId, stage.name, stage.id, stage.content || '')
      onStepUpdated?.()
    } catch (error) {
      console.error('Error running step:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestApproval = async () => {
    if (!projectId) return
    setIsLoading(true)
    try {
      await requestApproval(projectId, stage.id, stage.name)
      onStepUpdated?.()
    } catch (error) {
      console.error('Error requesting approval:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateContent = async () => {
    setIsLoading(true)
    try {
      const result = await generateContentWithClaude(`Generate content for ${stage.name}`, 'Technology')
      if (result.success) {
        onStepUpdated?.()
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    setIsLoading(true)
    try {
      const result = await generateImageWithOpenAI(`Professional image for ${stage.name}`)
      if (result.success) {
        onStepUpdated?.()
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      layout
      className={`rounded-lg border transition cursor-pointer group ${config.border} ${config.bg}`}
    >
      {/* Card Header */}
      <motion.button
        onClick={onExpand}
        className="w-full px-6 py-4 flex items-center justify-between hover:opacity-80 transition"
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar/Icon */}
          <motion.div
            animate={['in_progress', 'running'].includes(stage.status) ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-3xl"
          >
            {config.icon}
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-left">
            <h3 className="font-heading font-semibold text-white">{stage.name}</h3>
            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
              {['in_progress', 'running'].includes(stage.status) && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                  <span>Processing...</span>
                </div>
              )}
              {stage.status === 'waiting' && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                  <span>Awaiting Approval</span>
                </div>
              )}
              <span className={config.text}>{config.label}</span>
              {stage.agent && (
                <span className="text-xs text-purple-400">{stage.agent}</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {stage.status === 'pending' && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                handleRunStep()
              }}
              disabled={isLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-purple-500/20 rounded transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
              title="Run this step"
            >
              <Play className="w-4 h-4 text-purple-400" />
            </motion.button>
          )}
          {stage.status === 'completed' && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                handleRequestApproval()
              }}
              disabled={isLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-green-500/20 rounded transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
              title="Request approval"
            >
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </motion.button>
          )}
          {stage.status === 'waiting' && (
            <motion.button
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded opacity-0 group-hover:opacity-100"
              title="Awaiting approval"
            >
              <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
            </motion.button>
          )}

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="p-2"
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-white/5"
          >
            <div className="px-6 py-4 space-y-4">
              {/* Live Logs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Execution Logs</h4>
                  {['in_progress', 'running'].includes(stage.status) && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  )}
                </div>
                <div className="bg-black/60 rounded p-3 text-xs text-gray-300 h-32 overflow-y-auto font-mono border border-white/10">
                  <div>{new Date().toLocaleTimeString()} - Starting {stage.name}</div>
                  <div>{parsedContent.logs ? parsedContent.logs : 'Processing...'}</div>
                  {['in_progress', 'running'].includes(stage.status) && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-gray-500"
                    >
                      ▁ Processing...
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Execution Metrics */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Execution Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-white/5 rounded border border-white/10">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold text-white text-sm">{parsedContent.duration || '—'}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/10">
                    <p className="text-xs text-muted-foreground">Tokens Used</p>
                    <p className="font-semibold text-white text-sm">{parsedContent.tokensUsed || '0'}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/10">
                    <p className="text-xs text-muted-foreground">Cost</p>
                    <p className="font-semibold text-white text-sm">${parsedContent.cost || '0.00'}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded border border-white/10">
                    <p className="text-xs text-muted-foreground">Completion</p>
                    <p className="font-semibold text-white text-sm">{parsedContent.completion || '0'}%</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {['in_progress', 'running', 'pending', 'queued'].includes(stage.status) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-muted-foreground">Progress</h4>
                    <span className="text-xs text-gray-400">{parsedContent.completion || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{
                        width: `${parsedContent.completion || 0}%`,
                      }}
                      transition={{ type: 'spring', stiffness: 100 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Output Data */}
              {Object.keys(parsedContent).length > 0 && parsedContent.output && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Output Data</h4>
                  <div className="bg-black/40 rounded p-3 text-xs text-gray-300 max-h-40 overflow-y-auto font-mono border border-white/10">
                    <pre>{JSON.stringify(parsedContent.output, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* AI Generation Actions */}
              <div className="pt-2 border-t border-white/10">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">AI Generation</h4>
                <div className="flex gap-2">
                  {['Content Research', 'Outline', 'Keyword Research'].includes(stage.name) && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenerateContent()
                      }}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 text-purple-300 rounded font-medium text-sm transition"
                    >
                      <Sparkles className="w-3 h-3" />
                      Generate Content
                    </motion.button>
                  )}
                  {stage.name === 'Image Generation' && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenerateImage()
                      }}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 text-blue-300 rounded font-medium text-sm transition"
                    >
                      <Sparkles className="w-3 h-3" />
                      Generate Images
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Approval Actions */}
              {stage.status === 'waiting' && (
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded font-medium text-sm transition"
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded font-medium text-sm transition"
                  >
                    Reject
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
