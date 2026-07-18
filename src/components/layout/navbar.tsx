'use client'

import { motion } from 'framer-motion'
import {
  Search,
  Bell,
  Settings,
  Command,
  Moon,
  Sun,
  ChevronDown,
  Zap,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { logout } from '@/app/actions/logout'

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <motion.header
      className="fixed top-0 left-64 right-0 h-20 border-b border-white/10 bg-white/5 backdrop-blur-xl z-40 flex items-center px-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Left - Search */}
        <div className="flex-1">
          <motion.div
            className="relative w-full max-w-96"
            animate={{ width: searchOpen ? '100%' : '100%' }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects, commands..."
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground pointer-events-none">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </motion.div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4 ml-8">
          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-lg hover:bg-white/10 transition group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-white transition" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />

            {/* Notification dropdown */}
            {notificationsOpen && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-medium text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 border-b border-white/10 hover:bg-white/5 transition cursor-pointer"
                    >
                      <div className="flex gap-3">
                        <div className="h-2 w-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">
                            Project published
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your article has been published on LinkedIn
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.button>

          {/* Divider */}
          <div className="h-6 w-px bg-white/10" />

          {/* Theme Toggle */}
          <motion.button
            className="p-2 rounded-lg hover:bg-white/10 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Moon className="h-5 w-5 text-muted-foreground hover:text-white transition hidden dark:block" />
            <Sun className="h-5 w-5 text-muted-foreground hover:text-white transition dark:hidden" />
          </motion.button>

          {/* Settings */}
          <motion.button
            className="p-2 rounded-lg hover:bg-white/10 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="h-5 w-5 text-muted-foreground hover:text-white transition" />
          </motion.button>

          {/* Profile */}
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.02 }}
          >
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                JD
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Profile Dropdown */}
            <motion.div
              className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              initial={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              <div className="p-3 border-b border-white/10">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
              <div className="p-2">
                {[
                  { label: 'Settings', icon: Settings },
                  { label: 'API Keys', icon: Zap },
                  { label: 'Billing', icon: Zap },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full text-left px-3 py-2 rounded text-sm text-muted-foreground hover:text-white hover:bg-white/10 transition flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-3 py-2 rounded text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition flex items-center gap-2 border-t border-white/10 mt-2 pt-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
