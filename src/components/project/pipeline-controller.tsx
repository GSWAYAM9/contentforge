'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings, Loader2 } from 'lucide-react'

interface PipelineControllerProps {
  projectId: string
  isRunning: boolean
  currentStep: number
  totalSteps: number
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  onSettings: () => void
}

export function PipelineController({
  projectId,
  isRunning,
  currentStep,
  totalSteps,
  onStart,
  onPause,
  onResume,
  onReset,
  onSettings,
}: PipelineControllerProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-white/10"
    >
      {/* Progress Bar */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white">Pipeline Progress</span>
          <span className="text-xs text-muted-foreground">Step {currentStep}/{totalSteps}</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        {!isRunning ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              title="Start Pipeline"
            >
              <Play className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition"
            title="Pause Pipeline"
          >
            <Pause className="w-4 h-4" />
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSettings}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
          title="Pipeline Settings"
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}
