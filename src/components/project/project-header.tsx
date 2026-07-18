'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Play, Save, Download, Share2, MoreVertical, Zap } from 'lucide-react'

interface Project {
  id: string | number
  name: string
  status?: string
}

interface ProjectHeaderProps {
  project: Project
  onSave: () => void
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-slate-500/20', text: 'text-slate-300', label: 'Draft' },
  running: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Running' },
  in_progress: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'In Progress' },
  paused: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', label: 'Paused' },
  completed: { bg: 'bg-green-500/20', text: 'text-green-300', label: 'Completed' },
  failed: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Failed' },
  pending: { bg: 'bg-gray-500/20', text: 'text-gray-300', label: 'Pending' },
}

export function ProjectHeader({ project, onSave }: ProjectHeaderProps) {
  const projectStatus = project.status || 'draft'
  const status = statusConfig[projectStatus] || statusConfig['draft']

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-white/10 bg-background/50 backdrop-blur-sm"
    >
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Projects</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground text-sm font-medium">{project.name}</span>
        </div>

        {/* Center: Status and Info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <motion.div
              animate={['running', 'in_progress'].includes(projectStatus) ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}
            >
              {['running', 'in_progress'].includes(projectStatus) && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  {status.label}
                </div>
              )}
              {!['running', 'in_progress'].includes(projectStatus) && status.label}
            </motion.div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {project.status === 'draft' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/50 transition"
            >
              <Play className="w-4 h-4" />
              Run Pipeline
            </motion.button>
          )}

          {project.status === 'running' && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm transition"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Running...
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-foreground transition"
          >
            <Save className="w-4 h-4" />
            Save
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-foreground transition"
          >
            <Download className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-foreground transition"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-foreground transition"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
