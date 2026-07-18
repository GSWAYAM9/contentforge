'use client'

import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FolderOpen,
  Zap,
  BarChart3,
  Calendar,
  Layout as LayoutIcon,
  Image,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/shared/logo'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FolderOpen, label: 'Projects', href: '/dashboard/projects' },
  { icon: Zap, label: 'Pipeline', href: '/dashboard/pipeline' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
  { icon: LayoutIcon, label: 'Templates', href: '/dashboard/templates' },
  { icon: Image, label: 'Media Library', href: '/dashboard/media' },
]

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Support', href: '/support' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <motion.div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-white/5 to-transparent border-r border-white/10 backdrop-blur-xl flex flex-col transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        {isOpen ? (
          <Logo size="md" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors group"
              title={!isOpen ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0 group-hover:text-purple-400 transition" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-4 space-y-2">
        {/* Storage Info */}
        {isOpen && (
          <motion.div
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs font-medium text-white mb-2">
              Storage & Credits
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>50 GB / 500 GB</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 h-full rounded-full"
                  style={{ width: '10%' }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span>Credits: 450/1000</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 h-full rounded-full"
                  style={{ width: '45%' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom Menu */}
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            title={!isOpen ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}

        {/* Logout */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-red-500/10 transition-colors group">
          <LogOut className="h-5 w-5 flex-shrink-0 group-hover:text-red-400" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 bg-white/10 border border-white/20 rounded-full p-1.5 hover:bg-white/20 transition"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronDown
          className="h-4 w-4 text-white transition-transform"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' }}
        />
      </motion.button>
    </motion.div>
  )
}
