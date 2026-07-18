'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Trash2, Check, Inbox, AlertCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { getNotifications, markNotificationAsRead, deleteNotification, clearAllNotifications } from '@/app/actions/notifications'

interface Notification {
  id: number
  type: string
  title: string
  message: string
  actionUrl?: string
  read: boolean
  createdAt: Date
  icon?: string
}

const typeConfig: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  'project-update': { label: 'Project Update', bg: 'bg-blue-500/10', text: 'text-blue-300', icon: <AlertCircle className="w-5 h-5" /> },
  'approval': { label: 'Approval', bg: 'bg-yellow-500/10', text: 'text-yellow-300', icon: <Check className="w-5 h-5" /> },
  'linkedin': { label: 'LinkedIn', bg: 'bg-purple-500/10', text: 'text-purple-300', icon: <AlertCircle className="w-5 h-5" /> },
  'system': { label: 'System', bg: 'bg-gray-500/10', text: 'text-gray-300', icon: <AlertCircle className="w-5 h-5" /> },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    const result = await getNotifications(100)
    if (result.success) {
      setNotifications(result.data)
    }
    setLoading(false)
  }

  const handleMarkAsRead = async (id: number, read: boolean) => {
    await markNotificationAsRead({ notificationId: id, read: !read })
    loadNotifications()
  }

  const handleDelete = async (id: number) => {
    await deleteNotification(id)
    loadNotifications()
  }

  const handleClearAll = async () => {
    if (confirm('Clear all notifications?')) {
      await clearAllNotifications()
      loadNotifications()
    }
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Bell className="w-10 h-10" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition"
            >
              Clear All
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          {['all', 'unread'].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(f as 'all' | 'unread')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-white/10 text-muted-foreground hover:bg-white/20'
              }`}
            >
              {f === 'all' ? 'All' : 'Unread'}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50 animate-pulse" />
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No {filter === 'unread' ? 'unread' : ''} notifications</p>
            <p className="text-xs text-muted-foreground">
              {filter === 'unread' 
                ? 'You\'re all caught up!' 
                : 'Notifications will appear here when you have activity'}
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif, index) => {
              const config = typeConfig[notif.type] || typeConfig['system']
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard 
                    className={`p-4 transition cursor-pointer hover:bg-white/10 ${
                      !notif.read ? 'bg-white/5 border-purple-500/30' : ''
                    }`}
                    onClick={() => {
                      if (notif.actionUrl) window.location.href = notif.actionUrl
                    }}
                  >
                    <div className="flex gap-4 items-start">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 ${config.text}`}>
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-white font-semibold">{notif.title}</h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-xs px-2 py-1 rounded ${config.bg} ${config.text}`}>
                              {config.label}
                            </span>
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{notif.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(notif.id, notif.read)
                          }}
                          className={`p-2 rounded-lg transition ${
                            notif.read
                              ? 'text-gray-400 hover:bg-white/10'
                              : 'text-purple-300 hover:bg-purple-500/20'
                          }`}
                          title={notif.read ? 'Mark unread' : 'Mark read'}
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(notif.id)
                          }}
                          className="p-2 rounded-lg text-red-300 hover:bg-red-500/20 transition"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
