'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Bell, Shield, Trash2, ChevronRight, Settings } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'

const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: User, href: '/dashboard/settings/profile' },
  { id: 'password', label: 'Password', icon: Lock, href: '/dashboard/settings/password' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/dashboard/settings/notifications' },
  { id: 'security', label: 'Security', icon: Shield, href: '/dashboard/settings/security' },
  { id: 'danger', label: 'Delete Account', icon: Trash2, href: '/dashboard/settings/delete-account' },
]

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-10 h-10" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account, security, and preferences
          </p>
        </div>

        {/* Settings Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsTabs.map((tab, index) => {
            const Icon = tab.icon
            const isRed = tab.id === 'danger'
            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={tab.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-xl border transition cursor-pointer ${
                      isRed
                        ? 'bg-red-500/5 border-red-500/30 hover:bg-red-500/10'
                        : 'glass-effect border-white/10 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${
                          isRed ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className={`font-semibold mb-1 ${isRed ? 'text-red-300' : 'text-white'}`}>
                      {tab.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tab.id === 'profile' && 'Update your name, email, and avatar'}
                      {tab.id === 'password' && 'Change your account password'}
                      {tab.id === 'notifications' && 'Control notification preferences'}
                      {tab.id === 'security' && 'Two-factor authentication and sessions'}
                      {tab.id === 'danger' && 'Permanently delete your account'}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Account Status</h2>
          <GlassCard className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-muted-foreground text-sm mb-2">Account Status</p>
                <p className="text-white font-semibold">Active</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-muted-foreground text-sm mb-2">Member Since</p>
                <p className="text-white font-semibold">July 2024</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-muted-foreground text-sm mb-2">Security Level</p>
                <p className="text-green-400 font-semibold">Secure</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
