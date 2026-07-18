'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Trash2, Check } from 'lucide-react'
import Link from 'next/link'
import { getNotifications, getUnreadCount, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead } from '@/app/actions/notifications'

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

const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
  'project-update': { bg: 'bg-blue-500/20', text: 'text-blue-300', icon: '📊' },
  'approval': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', icon: '✓' },
  'linkedin': { bg: 'bg-purple-500/20', text: 'text-purple-300', icon: '💼' },
  'system': { bg: 'bg-gray-500/20', text: 'text-gray-300', icon: '⚙️' },
}

export function NotificationsBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    const result = await getNotifications(10)
    if (result.success) {
      setNotifications(result.data)
      const unread = result.data.filter((n) => !n.read).length
      setUnreadCount(unread)
    }
    setLoading(false)
  }

  const handleMarkAsRead = async (notificationId: number, read: boolean) => {
    await markNotificationAsRead({ notificationId, read: !read })
    loadNotifications()
  }

  const handleDelete = async (notificationId: number) => {
    await deleteNotification(notificationId)
    loadNotifications()
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
    loadNotifications()
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold"
          >
            {Math.min(unreadCount, 9)}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-96 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleMarkAllAsRead}
                    className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition"
                  >
                    Mark all read
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notif) => {
                    const color = typeColors[notif.type] || typeColors['system']
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-white/5 transition cursor-pointer ${!notif.read ? 'bg-white/5' : ''}`}
                        onClick={() => {
                          if (notif.actionUrl) {
                            window.location.href = notif.actionUrl
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-lg ${color.bg} flex items-center justify-center flex-shrink-0 text-lg`}>
                            {notif.icon || color.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-white font-medium text-sm">{notif.title}</p>
                              {!notif.read && (
                                <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-muted-foreground text-xs mt-2">
                              {new Date(notif.createdAt).toRelativeTime?.()}
                            </p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notif.id, notif.read)
                              }}
                              className={`p-1 rounded hover:bg-white/10 transition ${notif.read ? 'text-gray-400' : 'text-purple-300'}`}
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(notif.id)
                              }}
                              className="p-1 rounded hover:bg-red-500/20 text-red-300 hover:text-red-200 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-white/10 text-center">
                <Link href="/dashboard/notifications">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="text-sm text-purple-400 hover:text-purple-300 font-medium transition"
                  >
                    View all notifications
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Add relative time formatter
declare global {
  interface Date {
    toRelativeTime(): string
  }
}

if (typeof Date !== 'undefined' && !Date.prototype.toRelativeTime) {
  Date.prototype.toRelativeTime = function () {
    const seconds = Math.floor((new Date().getTime() - this.getTime()) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    
    return this.toLocaleDateString()
  }
}
