'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { PremiumInput } from '@/components/ui/premium-input'

const settingsSections = [
  {
    title: 'Profile Settings',
    items: ['Full Name', 'Email', 'Avatar'],
  },
  {
    title: 'Workspace',
    items: ['Workspace Name', 'Workspace URL', 'Members'],
  },
  {
    title: 'AI & Agents',
    items: ['API Keys', 'Model Preferences', 'Agent Configuration'],
  },
  {
    title: 'Integrations',
    items: ['LinkedIn', 'Twitter', 'Blog Platforms'],
  },
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
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your account and preferences
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <GlassCard className="p-6" delay={index}>
                <h3 className="text-lg font-heading font-bold text-white mb-4">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item} className="text-sm text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Profile Form Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h2 className="text-2xl font-heading font-bold text-white mb-6">
            Profile Settings
          </h2>

          <GlassCard className="p-8" animated={false}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PremiumInput label="Full Name" placeholder="John Doe" />
                <PremiumInput label="Email" type="email" placeholder="john@example.com" />
              </div>

              <PremiumInput
                label="Workspace Name"
                placeholder="My Workspace"
              />

              <div>
                <label className="block text-sm font-medium text-white mb-4">
                  Biography
                </label>
                <textarea
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <AnimatedButton variant="primary">Save Changes</AnimatedButton>
                <AnimatedButton variant="secondary">Cancel</AnimatedButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <h2 className="text-2xl font-heading font-bold text-white mb-6">
            Danger Zone
          </h2>

          <GlassCard className="p-8 border-red-500/20" animated={false}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white mb-1">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <AnimatedButton variant="outline" className="text-red-400 border-red-500/50 hover:bg-red-500/10">
                Delete
              </AnimatedButton>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
