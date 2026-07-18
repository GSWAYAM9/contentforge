'use client'

import { motion } from 'framer-motion'
import { FileText, CheckCircle2, PlayCircle, AlertCircle, Share2, Settings } from 'lucide-react'

interface TimelineEvent {
  id: string
  type: 'created' | 'started' | 'completed' | 'approved' | 'published' | 'error'
  title: string
  description: string
  timestamp: Date
  icon: React.ReactNode
}

interface ActivityTimelineProps {
  projectId: string
}

const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'created',
    title: 'Project Created',
    description: 'Q3 Marketing Campaign project initialized',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: '2',
    type: 'started',
    title: 'Pipeline Started',
    description: 'Content pipeline execution began',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    icon: <PlayCircle className="w-4 h-4" />,
  },
  {
    id: '3',
    type: 'completed',
    title: 'Research Completed',
    description: '15 sources analyzed and compiled',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    id: '4',
    type: 'completed',
    title: 'Outline Generated',
    description: 'Article outline ready for review',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    id: '5',
    type: 'approved',
    title: 'Outline Approved',
    description: 'You approved the generated outline',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
]

const typeConfig = {
  created: { color: 'bg-blue-500/20', textColor: 'text-blue-300', borderColor: 'border-blue-500/30' },
  started: { color: 'bg-purple-500/20', textColor: 'text-purple-300', borderColor: 'border-purple-500/30' },
  completed: { color: 'bg-green-500/20', textColor: 'text-green-300', borderColor: 'border-green-500/30' },
  approved: { color: 'bg-emerald-500/20', textColor: 'text-emerald-300', borderColor: 'border-emerald-500/30' },
  published: { color: 'bg-cyan-500/20', textColor: 'text-cyan-300', borderColor: 'border-cyan-500/30' },
  error: { color: 'bg-red-500/20', textColor: 'text-red-300', borderColor: 'border-red-500/30' },
}

export function ActivityTimeline({ projectId }: ActivityTimelineProps) {
  return (
    <div className="p-8 max-w-3xl">
      <h2 className="font-heading text-xl font-bold text-white mb-8">Activity Timeline</h2>

      <div className="space-y-6">
        {mockEvents.map((event, index) => {
          const config = typeConfig[event.type]

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4"
            >
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color} ${config.textColor} border ${config.borderColor}`}
                >
                  {event.icon}
                </motion.div>
                {index < mockEvents.length - 1 && (
                  <div className="w-0.5 h-16 bg-white/10 mt-2" />
                )}
              </div>

              {/* Event Content */}
              <motion.div
                className={`flex-1 pt-1 p-4 rounded-lg border ${config.borderColor} ${config.color} hover:bg-opacity-80 transition cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
