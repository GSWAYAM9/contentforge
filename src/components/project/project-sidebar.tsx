'use client'

import { motion } from 'framer-motion'
import { 
  LayoutGrid, 
  GitBranch, 
  Image, 
  BarChart3, 
  Activity, 
  Settings, 
  FileText,
  Globe,
  Calendar,
  User
} from 'lucide-react'

interface Project {
  id: string
  name: string
  status: string
  description?: string
  targetPlatform?: string
  website?: string
  created?: Date
  owner?: string
}

interface ProjectSidebarProps {
  project: Project
  activeTab: string
  onTabChange: (tab: any) => void
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
  { id: 'outputs', label: 'Outputs', icon: FileText },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function ProjectSidebar({ project, activeTab, onTabChange }: ProjectSidebarProps) {
  return (
    <motion.div
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-card border-r border-white/10 flex flex-col overflow-y-auto"
    >
      {/* Project Header */}
      <div className="p-6 border-b border-white/10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4"
        >
          <span className="text-white font-bold">CF</span>
        </motion.div>
        <h2 className="font-heading text-lg font-bold text-white mb-1">{project.name}</h2>
        <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
      </div>

      {/* Project Details */}
      <div className="p-4 space-y-3 border-b border-white/10 text-sm">
        {project.targetPlatform && (
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-accent" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Platform</p>
              <p className="text-foreground font-medium">{project.targetPlatform}</p>
            </div>
          </div>
        )}

        {project.website && (
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-accent" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Website</p>
              <p className="text-foreground font-medium truncate text-xs">{project.website}</p>
            </div>
          </div>
        )}

        {project.created && (
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-accent" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Created</p>
              <p className="text-foreground font-medium text-xs">
                {project.created.toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {project.owner && (
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-accent" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Owner</p>
              <p className="text-foreground font-medium">{project.owner}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-accent/20 text-accent font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1 h-1 bg-accent rounded-full"
                />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-muted-foreground">
        <p>Project ID: {project.id.slice(0, 8)}</p>
      </div>
    </motion.div>
  )
}
