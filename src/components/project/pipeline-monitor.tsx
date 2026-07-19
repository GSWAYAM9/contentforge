'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react'
import { usePipelineStream } from '@/lib/hooks/use-pipeline-stream'

interface PipelineMonitorProps {
  executionId: string
  projectName: string
}

export function PipelineMonitor({ executionId, projectName }: PipelineMonitorProps) {
  const { event, isConnected, error } = usePipelineStream(executionId)
  const [metrics, setMetrics] = useState({
    totalTokens: 0,
    totalCost: 0,
    elapsed: 0,
    currentStep: 0,
  })

  useEffect(() => {
    if (event?.data) {
      setMetrics({
        totalTokens: event.data.totalTokens || 0,
        totalCost: event.data.totalCost || 0,
        elapsed: event.data.elapsed || 0,
        currentStep: event.data.currentStep || 0,
      })
    }
  }, [event])

  const statusColor = {
    running: 'text-blue-400',
    completed: 'text-green-400',
    failed: 'text-red-400',
    paused: 'text-yellow-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
        />
        <span className="text-muted-foreground">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        {error && <span className="text-red-400">({error})</span>}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground">Tokens</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.totalTokens.toLocaleString()}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-muted-foreground">Cost</span>
          </div>
          <p className="text-2xl font-bold text-white">${metrics.totalCost.toFixed(4)}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground">Elapsed</span>
          </div>
          <p className="text-2xl font-bold text-white">{(metrics.elapsed / 1000).toFixed(1)}s</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs text-muted-foreground">Step</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.currentStep}/13</p>
        </div>
      </div>

      {/* Event Log */}
      <AnimatePresence>
        {event && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <h3 className="text-sm font-semibold text-white mb-2">Latest Update</h3>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                Status: <span className={statusColor[event.status as keyof typeof statusColor] || 'text-white'}>
                  {event.status?.toUpperCase()}
                </span>
              </p>
              {event.data?.currentStepName && (
                <p className="text-muted-foreground">
                  Current Step: <span className="text-white">{event.data.currentStepName}</span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
