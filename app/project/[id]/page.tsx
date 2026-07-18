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

export default function ProjectPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : ''
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'outputs' | 'media' | 'analytics' | 'activity' | 'settings'>('pipeline')
  const [rightPanelTab, setRightPanelTab] = useState<'output' | 'history' | 'logs' | 'comments' | 'approvals'>('output')
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useKeyboardShortcuts({
    onSearch: () => setCommandPaletteOpen(true),
    onRunPipeline: () => console.log('Run pipeline'),
    onSave: () => console.log('Save project'),
  })

  // Mock project data
  const project = {
    id: id,
    name: 'Q3 Marketing Campaign',
    status: 'running' as const,
    description: 'Comprehensive blog series on AI trends',
    created: new Date('2024-07-01'),
    owner: 'You',
    targetPlatform: 'Blog',
    website: 'contentforge.ai',
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
