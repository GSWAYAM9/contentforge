'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Zap, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const analyticsData = {
  executionStats: [
    { name: 'Completed', value: 24, color: '#10b981' },
    { name: 'In Progress', value: 3, color: '#8b5cf6' },
    { name: 'Failed', value: 2, color: '#ef4444' },
  ],
  dailyMetrics: [
    { day: 'Mon', tokens: 12000, cost: 0.24, executions: 5 },
    { day: 'Tue', tokens: 18500, cost: 0.37, executions: 8 },
    { day: 'Wed', tokens: 15200, cost: 0.30, executions: 6 },
    { day: 'Thu', tokens: 22000, cost: 0.44, executions: 10 },
    { day: 'Fri', tokens: 25000, cost: 0.50, executions: 12 },
    { day: 'Sat', tokens: 8000, cost: 0.16, executions: 3 },
    { day: 'Sun', tokens: 10000, cost: 0.20, executions: 4 },
  ],
  agentPerformance: [
    { agent: 'Research', executions: 24, avgDuration: 3.2, success: 22 },
    { agent: 'Writer', executions: 22, avgDuration: 5.8, success: 20 },
    { agent: 'Editor', executions: 20, avgDuration: 2.1, success: 19 },
    { agent: 'SEO', executions: 18, avgDuration: 1.5, success: 18 },
  ],
  costBreakdown: [
    { name: 'API Calls', value: 45, color: '#3b82f6' },
    { name: 'Image Gen', value: 30, color: '#ec4899' },
    { name: 'Storage', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#6b7280' },
  ],
}

const stats = [
  {
    icon: CheckCircle,
    label: 'Total Executions',
    value: '29',
    change: '+12% from last week',
    color: 'text-green-400',
  },
  {
    icon: Zap,
    label: 'Tokens Used',
    value: '110.7K',
    change: '+8% from last week',
    color: 'text-blue-400',
  },
  {
    icon: DollarSign,
    label: 'Total Cost',
    value: '$2.21',
    change: '-2% from last week',
    color: 'text-pink-400',
  },
  {
    icon: Clock,
    label: 'Avg Duration',
    value: '3.4m',
    change: '-15% from last week',
    color: 'text-purple-400',
  },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/10 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
              <p className="text-muted-foreground">Project performance and usage metrics</p>
            </div>
            <Link href="/project/1">
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium">
                Back to Project
              </button>
            </Link>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <motion.button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                }`}
              >
                {range}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl hover:border-white/40 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-white/10 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-xs text-green-400">{stat.change}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Execution Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl"
          >
            <h3 className="text-lg font-bold text-white mb-6">Execution Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.executionStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {analyticsData.executionStats.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} executions`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-8 mt-4">
              {analyticsData.executionStats.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-300">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cost Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl"
          >
            <h3 className="text-lg font-bold text-white mb-6">Cost Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {analyticsData.costBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {analyticsData.costBreakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-300">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Daily Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl mb-8"
        >
          <h3 className="text-lg font-bold text-white mb-6">Daily Metrics</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analyticsData.dailyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
              <Legend />
              <Line type="monotone" dataKey="tokens" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              <Line type="monotone" dataKey="executions" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Agent Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl"
        >
          <h3 className="text-lg font-bold text-white mb-6">Agent Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-muted-foreground font-medium">Agent</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">Executions</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">Avg Duration</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.agentPerformance.map((agent, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-4 text-white font-medium">{agent.agent}</td>
                    <td className="py-4 text-right text-gray-300">{agent.executions}</td>
                    <td className="py-4 text-right text-gray-300">{agent.avgDuration}s</td>
                    <td className="py-4 text-right">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                        {Math.round((agent.success / agent.executions) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
