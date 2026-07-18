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
import { ImageGallery } from '@/components/project/image-gallery'
import { ArticlePreview } from '@/components/project/article-preview'
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
  })

  const handleStepUpdated = async () => {
    try {
      const stepsResult = await getPipelineSteps(id)
      if (stepsResult.success) {
        setPipelineSteps(stepsResult.data)
      }
    } catch (error) {
      console.error('Error refreshing steps:', error)
    }
  }

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
                onStepUpdated={handleStepUpdated}
              />
            )}
          {activeTab === 'outputs' && (
            <ArticlePreview 
              title={project?.name || 'Untitled Article'}
              content={pipelineSteps
                .filter(step => step.status === 'completed')
                .map(step => step.content || '')
                .join('\n\n')}
              author="ContentForge AI"
              featuredImage="https://images.unsplash.com/photo-1677442d019cecf8d5b3c3b53b8c31c66c7c6e3b?w=800&h=400&fit=crop"
              readTime={Math.ceil((project?.name?.length || 0) / 200)}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsView projectId={id} />
          )}
          {activeTab === 'activity' && (
            <ActivityTimeline projectId={id} />
          )}
          {activeTab === 'overview' && (
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <p className="text-muted-foreground text-sm mb-2">Project Status</p>
                  <p className="text-2xl font-bold text-white capitalize">{project?.status || 'in_progress'}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <p className="text-muted-foreground text-sm mb-2">Total Steps</p>
                  <p className="text-2xl font-bold text-white">{pipelineSteps.length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <p className="text-muted-foreground text-sm mb-2">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{pipelineSteps.filter(s => s.status === 'completed').length}</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Project Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description:</span>
                    <span className="text-white">{project?.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Topic:</span>
                    <span className="text-white">{project?.topic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="text-white">{new Date(project?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'media' && (
            <ImageGallery 
              images={[
                { id: '1', url: 'https://images.unsplash.com/photo-1677442d019cecf8d5b3c3b53b8c31c66c7c6e3b?w=800&h=600&fit=crop', alt: 'AI Generated Image 1', generated: true },
                { id: '2', url: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&h=600&fit=crop', alt: 'AI Generated Image 2', generated: true },
                { id: '3', url: 'https://images.unsplash.com/photo-1677565508464-f6c1e55a3d1e?w=800&h=600&fit=crop', alt: 'AI Generated Image 3', generated: true },
              ]}
            />
          )}
          {activeTab === 'settings' && (
            <div className="p-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Project Settings</h2>
                <p className="text-muted-foreground mb-6">Visit the dedicated settings page for full configuration options.</p>
                <a 
                  href={`/project/${id}/settings`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition"
                >
                  Open Settings
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
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
