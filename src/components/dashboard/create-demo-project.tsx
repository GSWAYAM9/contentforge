'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { createDemoProject } from '@/app/actions/demo-data'
import { AnimatedButton } from '@/components/ui/animated-button'

interface CreateDemoProjectProps {
  userId: string
}

export function CreateDemoProject({ userId }: CreateDemoProjectProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreateDemo = async () => {
    setLoading(true)
    try {
      const result = await createDemoProject(userId)
      if (result.success) {
        router.push(`/project/${result.projectId}`)
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating demo project:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedButton
      onClick={handleCreateDemo}
      disabled={loading}
      className="gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {loading ? 'Creating...' : 'Load Demo Project'}
    </AnimatedButton>
  )
}
