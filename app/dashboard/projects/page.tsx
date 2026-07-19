'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { PremiumInput } from '@/components/ui/premium-input'
import { getProjects } from '@/app/actions/projects'

interface Project {
  id: number
  name: string
  topic: string
  description?: string
  status: string
  createdAt: Date
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      try {
        const result = await getProjects()
        if (result.success) {
          setProjects(result.projects)
        }
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProjects()
  }, [])

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.topic.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <Link href="/dashboard/projects/new">
            <AnimatedButton variant="primary" size="lg" icon={<Plus className="h-5 w-5" />}>
              New Project
            </AnimatedButton>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <PremiumInput
            type="text"
            placeholder="Search projects..."
            icon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <GlassCard className="p-12 text-center" animated={false}>
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </GlassCard>
        ) : filteredProjects.length === 0 ? (
          <GlassCard className="p-12 text-center" animated={false}>
            <div className="flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 opacity-20 mb-4" />
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                {projects.length === 0 ? 'No projects yet' : 'No matching projects'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {projects.length === 0 
                  ? 'Create your first project to start building amazing content'
                  : 'Try adjusting your search'}
              </p>
              {projects.length === 0 && (
                <Link href="/dashboard/projects/new">
                  <AnimatedButton variant="primary" icon={<Plus className="h-4 w-4" />}>
                    Create First Project
                  </AnimatedButton>
                </Link>
              )}
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/project/${project.id}`}>
                  <GlassCard className="p-6 hover:bg-white/10 transition cursor-pointer group h-full flex flex-col" animated={false}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-1 group-hover:text-purple-300 transition">
                          {project.name}
                        </h3>
                        <p className="text-sm text-purple-400 mb-2">{project.topic}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-400 transition" />
                    </div>
                    
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        project.status === 'draft'
                          ? 'bg-blue-500/10 text-blue-400'
                          : project.status === 'in_progress'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-green-500/10 text-green-400'
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
