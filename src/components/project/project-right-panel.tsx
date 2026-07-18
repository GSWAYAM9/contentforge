'use client'

import { motion } from 'framer-motion'
import { FileText, History, Terminal, MessageSquare, CheckCircle2 } from 'lucide-react'

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
            className="p-4 space-y-4"
          >
            <div>
              <h3 className="font-semibold text-white mb-2">Current Output</h3>
              <div className="bg-black/40 rounded-lg p-4 text-sm text-muted-foreground space-y-3">
                <div>
                  <p className="font-medium text-white mb-1">Research Summary</p>
                  <p className="text-xs">
                    Compiled 15 authoritative sources on AI trends. Key findings:
                    45% increase in enterprise adoption, 3 major breakthroughs in reasoning models.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Keywords Identified</p>
                  <div className="flex flex-wrap gap-1">
                    {['AI Trends', 'LLMs', 'Enterprise AI', 'Reasoning'].map((kw) => (
                      <span key={kw} className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
            className="p-4 space-y-3"
          >
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold">
                  Y
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white">You</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <p className="text-sm text-foreground">Great outline! Let's expand on the enterprise adoption section.</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'approvals' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-3"
          >
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <p className="text-xs font-semibold text-green-300">Outline Approved</p>
              </div>
              <p className="text-xs text-muted-foreground">You approved this 2 hours ago</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <p className="text-xs font-semibold text-yellow-300">Awaiting Your Approval</p>
              </div>
              <p className="text-xs text-muted-foreground">Human approval needed for outline</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
