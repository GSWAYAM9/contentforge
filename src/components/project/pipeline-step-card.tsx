'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Zap, RotateCw, Eye, Clock } from 'lucide-react'

interface Stage {
  id: number
  name: string
  status: string
  agent?: string
  content?: string
  icon?: string
  duration?: string
  tokens?: number
}

interface PipelineStepCardProps {
  stage: Stage
  isExpanded: boolean
  onExpand: () => void
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

export function PipelineStepCard({ stage, isExpanded, onExpand }: PipelineStepCardProps) {
  const config = statusConfig[stage.status] || statusConfig['pending']
  
  // Parse content JSON safely
  let parsedContent: any = {}
  try {
    if (stage.content) {
      parsedContent = JSON.parse(stage.content)
    }
  } catch (e) {
    console.error('Failed to parse stage content:', e)
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
          {stage.status === 'completed' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/10 rounded transition opacity-0 group-hover:opacity-100"
            >
              <RotateCw className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          )}
          {stage.status === 'completed' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/10 rounded transition opacity-0 group-hover:opacity-100"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
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
              {/* Content Preview */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Data</h4>
                <div className="bg-black/40 rounded p-3 text-xs text-muted-foreground h-24 overflow-y-auto font-mono">
                  {Object.keys(parsedContent).length > 0 ? (
                    <pre>{JSON.stringify(parsedContent, null, 2)}</pre>
                  ) : (
                    <span>{stage.status === 'completed' ? 'Execution completed' : 'Waiting to execute...'}</span>
                  )}
                </div>
              </div>

              {/* Stats */}
              {Object.keys(parsedContent).length > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <p className="text-xs text-muted-foreground">Tokens Used</p>
                    <p className="font-semibold text-white">{parsedContent.tokensUsed || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cost</p>
                    <p className="font-semibold text-white">${parsedContent.cost || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-semibold text-white capitalize">{stage.status}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
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
