'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Zap, Clock, DollarSign, BookOpen } from 'lucide-react'

interface AnalyticsViewProps {
  projectId: string
}

const analyticsCards = [
  {
    title: 'Pipeline Success',
    value: '87%',
    change: '+12%',
    icon: TrendingUp,
    color: 'from-green-500/20 to-emerald-500/20',
    textColor: 'text-green-300',
  },
  {
    title: 'Avg Execution Time',
    value: '4m 23s',
    change: '-18%',
    icon: Clock,
    color: 'from-blue-500/20 to-cyan-500/20',
    textColor: 'text-blue-300',
  },
  {
    title: 'Tokens Used',
    value: '12,450',
    change: '+2,100',
    icon: Zap,
    color: 'from-purple-500/20 to-pink-500/20',
    textColor: 'text-purple-300',
  },
  {
    title: 'Estimated Cost',
    value: '$0.032',
    change: '-$0.008',
    icon: DollarSign,
    color: 'from-yellow-500/20 to-orange-500/20',
    textColor: 'text-yellow-300',
  },
  {
    title: 'Articles Published',
    value: '12',
    change: '+3',
    icon: BookOpen,
    color: 'from-cyan-500/20 to-blue-500/20',
    textColor: 'text-cyan-300',
  },
]

export function AnalyticsView({ projectId }: AnalyticsViewProps) {
  return (
    <div className="p-8">
      <h2 className="font-heading text-xl font-bold text-white mb-8">Project Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-lg border border-white/10 bg-gradient-to-br ${card.color} p-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${card.textColor}`} />
                <span className="text-xs font-medium text-green-300 bg-green-500/20 px-2 py-1 rounded">
                  {card.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{card.title}</p>
              <p className="font-heading text-2xl font-bold text-white">{card.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Execution Timeline */}
        <div className="bg-card rounded-lg border border-white/10 p-6">
          <h3 className="font-heading font-semibold text-white mb-4">Execution Timeline</h3>
          <div className="space-y-3">
            {[
              { name: 'Keyword Research', time: '2m 34s', percent: 35 },
              { name: 'Research', time: '5m 12s', percent: 70 },
              { name: 'Outline', time: '1m 45s', percent: 25 },
              { name: 'Writer', time: 'Queued', percent: 0 },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-accent to-purple-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Success Rate */}
        <div className="bg-card rounded-lg border border-white/10 p-6">
          <h3 className="font-heading font-semibold text-white mb-4">Stage Success Rate</h3>
          <div className="space-y-3">
            {[
              { name: 'Research', rate: 98 },
              { name: 'Outline', rate: 95 },
              { name: 'Writing', rate: 92 },
              { name: 'Editing', rate: 96 },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-24">{item.name}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.rate}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
                <span className="text-sm font-semibold text-green-300 w-12 text-right">{item.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
