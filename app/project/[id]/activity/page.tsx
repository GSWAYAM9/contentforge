'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Settings, CheckCircle, AlertCircle, Clock, User, Filter } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

const activities = [
  {
    id: 1,
    type: 'completed',
    title: 'Content Draft Generated',
    description: 'Claude AI completed the content draft stage',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: CheckCircle,
    color: 'text-green-400',
    metadata: { agent: 'WriterAgent', tokens: 15000, cost: '$0.30' },
  },
  {
    id: 2,
    type: 'pending',
    title: 'Awaiting Approval',
    description: 'Editor review pending for content approval',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    icon: Clock,
    color: 'text-yellow-400',
    metadata: { stage: 'Human Approval', approvers: 1 },
  },
  {
    id: 3,
    type: 'completed',
    title: 'Research Completed',
    description: 'Research agent gathered 15 sources',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    icon: CheckCircle,
    color: 'text-green-400',
    metadata: { sources: 15, keywords: 12 },
  },
  {
    id: 4,
    type: 'error',
    title: 'Image Generation Failed',
    description: 'DALL-E 3 image generation timed out',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    icon: AlertCircle,
    color: 'text-red-400',
    metadata: { error: 'Timeout', retries: 2 },
  },
  {
    id: 5,
    type: 'info',
    title: 'Project Updated',
    description: 'Project settings were modified',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    icon: Settings,
    color: 'text-blue-400',
    metadata: { fields: ['tone', 'keywords'] },
  },
  {
    id: 6,
    type: 'completed',
    title: 'Outline Generated',
    description: 'AI generated a comprehensive outline with 8 sections',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    icon: CheckCircle,
    color: 'text-green-400',
    metadata: { sections: 8, estimatedWords: 2500 },
  },
]

export default function ProjectActivityPage() {
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredActivities = activities.filter((activity) => {
    const matchesFilter = filterType === 'all' || activity.type === filterType
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filters = [
    { id: 'all', label: 'All', count: activities.length },
    { id: 'completed', label: 'Completed', count: activities.filter((a) => a.type === 'completed').length },
    { id: 'pending', label: 'Pending', count: activities.filter((a) => a.type === 'pending').length },
    { id: 'error', label: 'Errors', count: activities.filter((a) => a.type === 'error').length },
  ]

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Activity Timeline</h1>
            <p className="text-muted-foreground">Track all project events and milestones</p>
          </div>
          <Link href="/project/1">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium">
              Back to Project
            </button>
          </Link>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-purple-500"
          />
          <div className="flex gap-2">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterType(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                  filterType === filter.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-muted-foreground hover:text-white'
                }`}
              >
                <Filter className="w-4 h-4" />
                {filter.label}
                <span className="text-xs opacity-75">({filter.count})</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                {/* Timeline Line */}
                {index < filteredActivities.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-12 bg-gradient-to-b from-white/20 to-transparent" />
                )}

                {/* Activity Card */}
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>

                      {/* Metadata */}
                      {Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-xs text-muted-foreground capitalize">{key}</p>
                              <p className="text-sm text-white font-medium">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {filteredActivities.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No activities found</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
