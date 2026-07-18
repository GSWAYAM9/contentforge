'use client'

import { motion } from 'framer-motion'
import { PipelineStepCard } from './pipeline-step-card'

interface PipelineViewerProps {
  projectId: string
  expandedStep: number | null
  onExpandStep: (step: number | null) => void
}

const pipelineStages = [
  { id: 1, name: 'Keyword Research', icon: '🔍', status: 'completed', duration: '2m 34s', tokens: 1200 },
  { id: 2, name: 'Research', icon: '📚', status: 'completed', duration: '5m 12s', tokens: 3400 },
  { id: 3, name: 'Outline', icon: '📋', status: 'completed', duration: '1m 45s', tokens: 800 },
  { id: 4, name: 'Human Approval', icon: '✋', status: 'waiting_approval', duration: '—', tokens: 0 },
  { id: 5, name: 'Writer', icon: '✍️', status: 'queued', duration: '—', tokens: 0 },
  { id: 6, name: 'Fact Verification', icon: '✔️', status: 'queued', duration: '—', tokens: 0 },
  { id: 7, name: 'Editor', icon: '📝', status: 'queued', duration: '—', tokens: 0 },
  { id: 8, name: 'SEO', icon: '🎯', status: 'queued', duration: '—', tokens: 0 },
  { id: 9, name: 'Internal Linking', icon: '🔗', status: 'queued', duration: '—', tokens: 0 },
  { id: 10, name: 'Image Generation', icon: '🖼️', status: 'queued', duration: '—', tokens: 0 },
  { id: 11, name: 'Accessibility', icon: '♿', status: 'queued', duration: '—', tokens: 0 },
  { id: 12, name: 'Master QA', icon: '⭐', status: 'queued', duration: '—', tokens: 0 },
]

export function PipelineViewer({ projectId, expandedStep, onExpandStep }: PipelineViewerProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Pipeline Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8 py-6 border-b border-white/10"
      >
        <h2 className="font-heading text-xl font-bold text-white mb-2">Content Pipeline</h2>
        <p className="text-muted-foreground text-sm">12-stage AI workflow • 3 completed • 1 awaiting approval • 8 queued</p>
      </motion.div>

      {/* Pipeline Steps */}
      <div className="flex-1 overflow-y-auto p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-3 max-w-5xl"
        >
          {pipelineStages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PipelineStepCard
                stage={stage}
                isExpanded={expandedStep === stage.id}
                onExpand={() => onExpandStep(expandedStep === stage.id ? null : stage.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
