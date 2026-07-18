'use client'

import { motion } from 'framer-motion'
import { PipelineStepCard } from './pipeline-step-card'

interface PipelineStep {
  id: number
  projectId: number
  userId: string
  stepName: string
  status: string
  agent: string
  content: string
  createdAt: Date
  updatedAt: Date
}

interface PipelineViewerProps {
  projectId: string
  steps: PipelineStep[]
  expandedStep: number | null
  onExpandStep: (step: number | null) => void
}

export function PipelineViewer({ projectId, steps, expandedStep, onExpandStep }: PipelineViewerProps) {
  // Map database status to display status
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', color: 'text-green-400' }
      case 'in_progress':
        return { text: 'Running', color: 'text-blue-400' }
      case 'waiting':
        return { text: 'Awaiting Approval', color: 'text-yellow-400' }
      case 'pending':
        return { text: 'Queued', color: 'text-gray-400' }
      case 'failed':
        return { text: 'Failed', color: 'text-red-400' }
      default:
        return { text: status, color: 'text-gray-400' }
    }
  }

  const totalSteps = steps.length
  const completedSteps = steps.filter(s => s.status === 'completed').length
  const inProgressSteps = steps.filter(s => s.status === 'in_progress').length
  const waitingSteps = steps.filter(s => s.status === 'waiting').length
  const queuedSteps = steps.filter(s => s.status === 'pending').length
  return (
    <div className="h-full flex flex-col">
      {/* Pipeline Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8 py-6 border-b border-white/10"
      >
        <h2 className="font-heading text-xl font-bold text-white mb-2">Content Pipeline</h2>
        <p className="text-muted-foreground text-sm">
          {totalSteps}-stage AI workflow • {completedSteps} completed • {inProgressSteps} running • {waitingSteps} waiting approval • {queuedSteps} queued
        </p>
      </motion.div>

      {/* Pipeline Steps */}
      <div className="flex-1 overflow-y-auto p-8">
        {steps.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No pipeline steps found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-3 max-w-5xl"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PipelineStepCard
                  stage={{
                    id: step.id,
                    name: step.stepName,
                    status: step.status,
                    agent: step.agent,
                    content: step.content,
                  }}
                  isExpanded={expandedStep === step.id}
                  onExpand={() => onExpandStep(expandedStep === step.id ? null : step.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
