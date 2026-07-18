'use client'

import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { PremiumInput } from '@/components/ui/premium-input'

export default function ProjectsPage() {
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
            <h1 className="text-4xl font-heading font-bold text-white mb-2">
              Projects
            </h1>
            <p className="text-muted-foreground">
              Manage and organize your content projects
            </p>
          </div>
          <AnimatedButton variant="primary" size="lg" icon={<Plus className="h-5 w-5" />}>
            New Project
          </AnimatedButton>
        </div>

        {/* Search */}
        <div className="mb-8">
          <PremiumInput
            type="text"
            placeholder="Search projects..."
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Projects Grid - Placeholder */}
        <GlassCard className="p-12 text-center" animated={false}>
          <div className="flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 opacity-20 mb-4" />
            <h3 className="text-xl font-heading font-bold text-white mb-2">
              No projects yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first project to start building amazing content
            </p>
            <AnimatedButton variant="primary" icon={<Plus className="h-4 w-4" />}>
              Create First Project
            </AnimatedButton>
          </div>
        </GlassCard>
      </motion.div>
    </DashboardLayout>
  )
}
