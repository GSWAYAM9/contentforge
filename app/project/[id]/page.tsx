'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProjectHeader } from '@/components/project/project-header'
import { ProjectSidebar } from '@/components/project/project-sidebar'
import { PipelineViewer } from '@/components/project/pipeline-viewer'
import { ProjectRightPanel } from '@/components/project/project-right-panel'
import { CommandPalette } from '@/components/shared/command-palette'
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts'
import { ActivityTimeline } from '@/components/project/activity-timeline'
import { AnalyticsView } from '@/components/project/analytics-view'
import { getProjectById, getPipelineSteps } from '@/app/actions/projects-queries'

interface PipelineStep {
  id: number
  projectId: number
  userId: string
  stepName: string
  status: string
  agent: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export default function ProjectPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : ''
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'outputs' | 'media' | 'analytics' | 'activity' | 'settings'>('pipeline')
  const [rightPanelTab, setRightPanelTab] = useState<'output' | 'history' | 'logs' | 'comments' | 'approvals'>('output')
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [project, setProject] = useState<any>(null)
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([])
  const [loading, setLoading] = useState(true)

  useKeyboardShortcuts({
    onSearch: () => setCommandPaletteOpen(true),
    onRunPipeline: () => console.log('Run pipeline'),
    onSave: () => console.log('Save project'),
  })

  useEffect(() => {
    async function loadData() {
      try {
        const projectResult = await getProjectById(id)
        const stepsResult = await getPipelineSteps(id)

        if (projectResult.success) {
          setProject(projectResult.data)
        }

        if (stepsResult.success) {
          setPipelineSteps(stepsResult.data)
        }
      } catch (error) {
        console.error('Error loading project:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <p className="text-red-400">Project not found</p>
      </div>
    )
  }

  return (
    <>
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      
      <div className="h-screen bg-background flex flex-col">
        {/* Header */}
        <ProjectHeader project={project} onSave={() => {}} />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <ProjectSidebar 
            project={project} 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Center Pipeline */}
          <div className="flex-1 overflow-auto border-l border-r border-white/10">
            {activeTab === 'pipeline' && (
              <PipelineViewer 
                projectId={id}
                steps={pipelineSteps}
                expandedStep={expandedStep}
                onExpandStep={setExpandedStep}
              />
            )}
          {activeTab === 'outputs' && (
            <div className="p-8 text-center text-muted-foreground">
              Outputs view coming soon
            </div>
          )}
          {activeTab === 'analytics' && (
            <AnalyticsView projectId={id} />
          )}
          {activeTab === 'activity' && (
            <ActivityTimeline projectId={id} />
          )}
          {activeTab === 'overview' && (
            <div className="p-8 text-center text-muted-foreground">
              Overview view coming soon
            </div>
          )}
          {activeTab === 'media' && (
            <div className="p-8 text-center text-muted-foreground">
              Media gallery coming soon
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="p-8 text-center text-muted-foreground">
              Settings coming soon
            </div>
          )}
        </div>

        {/* Right Panel */}
        <ProjectRightPanel 
          activeTab={rightPanelTab}
          onTabChange={setRightPanelTab}
          expandedStep={expandedStep}
        />
      </div>
      </div>
    </>
  )
}
