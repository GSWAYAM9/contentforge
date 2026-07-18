'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Zap, AlertCircle, TrendingUp, Lock, Key, Eye, Copy, Trash2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

const apiKeyData = [
  { id: 1, name: 'Production Key', createdAt: '2024-01-15', lastUsed: '2024-01-18', calls: 125000, status: 'active' },
  { id: 2, name: 'Testing Key', createdAt: '2024-01-10', lastUsed: '2024-01-18', calls: 45000, status: 'active' },
  { id: 3, name: 'Legacy Key', createdAt: '2023-12-01', lastUsed: '2023-12-15', calls: 0, status: 'inactive' },
]

const usageData = [
  { date: 'Jan 1', requests: 12000, cost: 0.24 },
  { date: 'Jan 2', requests: 18500, cost: 0.37 },
  { date: 'Jan 3', requests: 15200, cost: 0.30 },
  { date: 'Jan 4', requests: 22000, cost: 0.44 },
  { date: 'Jan 5', requests: 25000, cost: 0.50 },
  { date: 'Jan 6', requests: 8000, cost: 0.16 },
  { date: 'Jan 7', requests: 10000, cost: 0.20 },
]

const rateLimitStats = [
  { api: 'Claude', rateLimit: '10k/min', used: '2.4k/min', percentage: 24 },
  { api: 'DALL-E', rateLimit: '500/hr', used: '120/hr', percentage: 24 },
  { api: 'Embeddings', rateLimit: '100k/min', used: '8.5k/min', percentage: 9 },
]

export default function APIUsagePage() {
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopyKey = (id: number) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
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
            <h1 className="text-4xl font-bold text-white mb-2">API Usage</h1>
            <p className="text-muted-foreground">Monitor API calls, rate limits, and costs</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewKeyModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
          >
            <Key className="w-4 h-4" />
            New API Key
          </motion.button>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Total Requests', value: '110.7K', change: '+8%', icon: Zap },
            { label: 'This Month Cost', value: '$2.21', change: '-2%', icon: TrendingUp },
            { label: 'Active Keys', value: '2', change: '0', icon: Lock },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className={`text-xs mt-2 ${stat.change.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                  {stat.change} from last month
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl mb-8"
        >
          <h3 className="text-lg font-bold text-white mb-6">Daily Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl mb-8"
        >
          <h3 className="text-lg font-bold text-white mb-6">Rate Limits</h3>
          <div className="space-y-4">
            {rateLimitStats.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{item.api}</p>
                  <span className="text-xs text-muted-foreground">{item.used} / {item.rateLimit}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${item.percentage}%` }}
                    className={`h-full rounded-full ${item.percentage > 80 ? 'bg-red-500' : item.percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* API Keys */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl"
        >
          <h3 className="text-lg font-bold text-white mb-6">API Keys</h3>
          <div className="space-y-3">
            {apiKeyData.map((key) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between group hover:border-white/20 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white">{key.name}</h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        key.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {key.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Created: {key.createdAt}</span>
                    <span>Last used: {key.lastUsed}</span>
                    <span>{key.calls.toLocaleString()} calls</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleCopyKey(key.id)}
                    className="p-2 hover:bg-white/10 rounded transition"
                    title="Copy key"
                  >
                    {copiedId === key.id ? (
                      <span className="text-xs text-green-400 font-medium">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-2 hover:bg-white/10 rounded transition"
                    title="Revoke key"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-300">Rate limit warning</p>
            <p className="text-sm text-yellow-200">Claude API is at 76% of rate limit. Consider optimizing requests.</p>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
