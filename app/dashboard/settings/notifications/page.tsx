'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Bell, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'

const notificationSettings = [
  {
    category: 'Project Updates',
    description: 'Notifications about your projects',
    icon: AlertCircle,
    settings: [
      { id: 'project-created', label: 'Project Created', description: 'When you create a new project', defaultOn: true },
      { id: 'project-completed', label: 'Project Completed', description: 'When a project finishes processing', defaultOn: true },
      { id: 'project-failed', label: 'Project Failed', description: 'When a project encounters an error', defaultOn: true },
    ],
  },
  {
    category: 'Approvals',
    description: 'Notifications for content approvals',
    icon: CheckCircle2,
    settings: [
      { id: 'approval-needed', label: 'Approval Needed', description: 'When content requires your approval', defaultOn: true },
      { id: 'approval-approved', label: 'Approved', description: 'When content is approved', defaultOn: false },
      { id: 'approval-rejected', label: 'Rejected', description: 'When content is rejected', defaultOn: true },
    ],
  },
  {
    category: 'Publishing',
    description: 'Notifications about published content',
    icon: Bell,
    settings: [
      { id: 'post-published', label: 'Post Published', description: 'When your post goes live', defaultOn: true },
      { id: 'post-performance', label: 'Performance Updates', description: 'Weekly performance digest', defaultOn: false },
      { id: 'linkedin-posted', label: 'LinkedIn Posted', description: 'When content is posted to LinkedIn', defaultOn: true },
    ],
  },
]

const deliveryMethods = [
  { id: 'in-app', label: 'In-App Notifications', icon: Bell, defaultOn: true },
  { id: 'email', label: 'Email Notifications', icon: Mail, defaultOn: true },
]

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    notificationSettings.forEach((category) => {
      category.settings.forEach((setting) => {
        initial[setting.id] = setting.defaultOn
      })
    })
    return initial
  })

  const [delivery, setDelivery] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    deliveryMethods.forEach((method) => {
      initial[method.id] = method.defaultOn
    })
    return initial
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard/settings">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Notification Settings</h1>
            <p className="text-muted-foreground">Control how and when you receive notifications</p>
          </div>
        </div>

        {/* Save Success Message */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            Notification settings saved successfully!
          </motion.div>
        )}

        {/* Delivery Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Delivery Methods</h2>
          <GlassCard className="p-6">
            <div className="space-y-4">
              {deliveryMethods.map((method) => {
                const Icon = method.icon
                return (
                  <label
                    key={method.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition"
                  >
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={delivery[method.id]}
                        onChange={(e) => setDelivery({ ...delivery, [method.id]: e.target.checked })}
                        className="w-5 h-5 rounded accent-purple-500"
                      />
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className="w-5 h-5 text-purple-400" />
                      <span className="font-medium text-white">{method.label}</span>
                    </div>
                  </label>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Notification Categories */}
        {notificationSettings.map((category, categoryIndex) => {
          const CategoryIcon = category.icon
          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + categoryIndex * 0.05 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <CategoryIcon className="w-6 h-6 text-purple-400" />
                <div>
                  <h2 className="text-lg font-bold text-white">{category.category}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <GlassCard className="p-6">
                <div className="space-y-3">
                  {category.settings.map((setting) => (
                    <label
                      key={setting.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={settings[setting.id]}
                        onChange={(e) => setSettings({ ...settings, [setting.id]: e.target.checked })}
                        className="w-5 h-5 rounded accent-purple-500 mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-white">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )
        })}

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 mt-8 pt-6 border-t border-white/10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            Save Preferences
          </motion.button>
          <Link href="/dashboard/settings">
            <AnimatedButton variant="secondary">Cancel</AnimatedButton>
          </Link>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
