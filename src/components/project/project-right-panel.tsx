'use client'

import { motion } from 'framer-motion'
import { FileText, History, Terminal, MessageSquare, CheckCircle2 } from 'lucide-react'
import { OutputViewer } from './output-viewer'
import { StepComments } from './step-comments'
import { ApprovalGate } from './approval-gate'

interface ProjectRightPanelProps {
  activeTab: 'output' | 'history' | 'logs' | 'comments' | 'approvals'
  onTabChange: (tab: any) => void
  expandedStep: number | null
}

export function ProjectRightPanel({ activeTab, onTabChange, expandedStep }: ProjectRightPanelProps) {
  const tabs = [
    { id: 'output', label: 'Output', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'logs', label: 'Logs', icon: Terminal },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
  ]

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-card border-l border-white/10 flex flex-col overflow-hidden"
    >
      {/* Tabs */}
      <div className="border-b border-white/10 flex overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 px-3 py-3 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'output' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4"
          >
            <OutputViewer
              type="markdown"
              content="# Research Summary\n\nCompiled 15 authoritative sources on AI trends.\n\n## Key Findings\n- 45% increase in enterprise adoption\n- 3 major breakthroughs in reasoning models\n- Significant progress in multimodal AI\n\n## Keywords\nAI Trends, LLMs, Enterprise AI, Reasoning"
            />
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-2"
          >
            {[
              { step: 'Research', time: '2 min ago', status: 'completed' },
              { step: 'Outline', time: '1 min ago', status: 'completed' },
              { step: 'Keywords', time: '5 min ago', status: 'completed' },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{item.step}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4"
          >
            <div className="font-mono text-xs space-y-1 bg-black/40 rounded p-3">
              <p className="text-green-400">[14:32:45] Research agent initialized</p>
              <p className="text-green-400">[14:32:46] Fetching sources...</p>
              <p className="text-green-400">[14:33:01] Found 15 relevant sources</p>
              <p className="text-green-400">[14:33:15] Analyzing content...</p>
              <p className="text-blue-400">[14:33:34] Completed</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'comments' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4"
          >
            <StepComments stepId={expandedStep || 0} />
          </motion.div>
        )}

        {activeTab === 'approvals' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4"
          >
            <ApprovalGate stepId={expandedStep || 0} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
