'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Lock, FolderOpen, User, Settings, Zap, Filter, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { getActivityLogs } from '@/app/actions/activity-logs'

interface ActivityLog {
  id: number
  userId: string
  action: string
  category: string
  description?: string
  metadata?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  'auth': { icon: <Lock className="w-4 h-4" />, color: 'text-blue-300', label: 'Authentication' },
  'project': { icon: <FolderOpen className="w-4 h-4" />, color: 'text-purple-300', label: 'Project' },
  'profile': { icon: <User className="w-4 h-4" />, color: 'text-green-300', label: 'Profile' },
  'settings': { icon: <Settings className="w-4 h-4" />, color: 'text-yellow-300', label: 'Settings' },
  'integration': { icon: <Zap className="w-4 h-4" />, color: 'text-orange-300', label: 'Integration' },
  'content': { icon: <Activity className="w-4 h-4" />, color: 'text-pink-300', label: 'Content' },
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const pageSize = 20

  useEffect(() => {
    loadLogs()
  }, [page])

  const loadLogs = async () => {
    setLoading(true)
    const result = await getActivityLogs(pageSize, page * pageSize)
    if (result.success) {
      setLogs(result.data)
    }
    setLoading(false)
  }

  const filteredLogs = filter ? logs.filter(log => log.category === filter) : logs

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <Activity className="w-10 h-10" />
            Activity Log
          </h1>
          <p className="text-muted-foreground">Track all actions and changes in your account</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              !filter
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-white/10 text-muted-foreground hover:bg-white/20'
            }`}
          >
            <Filter className="w-4 h-4" />
            All Activities
          </motion.button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                filter === key
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-white/10 text-muted-foreground hover:bg-white/20'
              }`}
            >
              {config.icon}
              {config.label}
            </motion.button>
          ))}
        </div>

        {/* Activity List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50 animate-pulse" />
              <p className="text-muted-foreground">Loading activity...</p>
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No activities to display</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log, index) => {
              const config = categoryConfig[log.category] || categoryConfig['activity']
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <GlassCard className="p-4 hover:bg-white/10 transition group cursor-pointer">
                    <div className="flex gap-4 items-start">
                      {/* Category Icon */}
                      <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 ${config.color}`}>
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h3 className="text-white font-semibold">{log.action}</h3>
                            {log.description && (
                              <p className="text-muted-foreground text-sm mt-1">{log.description}</p>
                            )}
                          </div>
                          <div className="text-xs px-2 py-1 bg-white/5 rounded text-muted-foreground flex-shrink-0">
                            {config.label}
                          </div>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                          <time dateTime={new Date(log.createdAt).toISOString()}>
                            {new Date(log.createdAt).toLocaleString()}
                          </time>
                          {log.ipAddress && (
                            <>
                              <span>•</span>
                              <span>IP: {log.ipAddress}</span>
                            </>
                          )}
                        </div>

                        {/* Metadata if present */}
                        {log.metadata && (
                          <div className="mt-2 text-xs text-muted-foreground bg-white/5 rounded p-2">
                            <pre className="overflow-x-auto max-h-20">
                              {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>

                      {/* Chevron */}
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition flex-shrink-0" />
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {logs.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium disabled:opacity-50 transition"
            >
              Previous
            </motion.button>
            <span className="text-muted-foreground">Page {page + 1}</span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage(p => p + 1)}
              disabled={logs.length < pageSize}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium disabled:opacity-50 transition"
            >
              Next
            </motion.button>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
