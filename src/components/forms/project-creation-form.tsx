'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import { createProject } from '@/app/actions/projects'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { PremiumInput } from '@/components/ui/premium-input'

export function ProjectCreationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    description: '',
    channels: ['blog'] as string[],
  })

  const channels = ['Blog', 'LinkedIn', 'Twitter', 'Email', 'Social']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel.toLowerCase())
        ? prev.channels.filter(c => c !== channel.toLowerCase())
        : [...prev.channels, channel.toLowerCase()]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.name.trim()) {
      setError('Project name is required')
      setIsLoading(false)
      return
    }

    if (!formData.topic.trim()) {
      setError('Topic is required')
      setIsLoading(false)
      return
    }

    try {
      const result = await createProject({
        name: formData.name,
        topic: formData.topic,
        description: formData.description,
        channels: formData.channels,
      })

      if (result.success) {
        router.push(`/project/${result.project.id}`)
      } else {
        setError(result.error || 'Failed to create project')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Project Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white mb-3">
          Project Name
        </label>
        <PremiumInput
          id="name"
          name="name"
          type="text"
          placeholder="e.g., AI Writing Guide 2024"
          value={formData.name}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Give your project a clear, descriptive name
        </p>
      </div>

      {/* Topic */}
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-white mb-3">
          Topic / Keyword
        </label>
        <PremiumInput
          id="topic"
          name="topic"
          type="text"
          placeholder="e.g., Best practices for AI content generation"
          value={formData.topic}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-2">
          The main topic or keyword for your article
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white mb-3">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Add any additional details about this project..."
          value={formData.description}
          onChange={handleInputChange}
          disabled={isLoading}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition disabled:opacity-50"
        />
      </div>

      {/* Channels */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Publish Channels
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {channels.map(channel => (
            <motion.button
              key={channel}
              type="button"
              onClick={() => handleChannelToggle(channel)}
              disabled={isLoading}
              className={`p-3 rounded-lg font-medium text-sm transition ${
                formData.channels.includes(channel.toLowerCase())
                  ? 'bg-purple-600/50 text-purple-100 border border-purple-500/50'
                  : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {channel}
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Select where you want to publish your content
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 pt-6">
        <AnimatedButton
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </AnimatedButton>
        <AnimatedButton
          type="submit"
          variant="primary"
          disabled={isLoading}
          icon={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          className="flex-1"
        >
          {isLoading ? 'Creating...' : 'Create Project'}
        </AnimatedButton>
      </div>
    </motion.form>
  )
}
