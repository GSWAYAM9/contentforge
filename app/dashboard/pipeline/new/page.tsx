'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { PremiumInput } from '@/components/ui/premium-input'
import { executePipeline } from '@/app/actions/pipeline-execution'

function NewPipelinePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    keywords: '',
    contentLength: 'medium' as 'short' | 'medium' | 'long',
    tone: 'professional',
  })

  const contentLengthOptions = [
    { value: 'short', label: 'Short (500-1000 words)' },
    { value: 'medium', label: 'Medium (1000-2000 words)' },
    { value: 'long', label: 'Long (2000+ words)' },
  ]

  const toneOptions = ['Professional', 'Casual', 'Friendly', 'Academic', 'Technical', 'Creative']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId) {
      alert('Project ID is required')
      return
    }

    setIsLoading(true)

    try {
      const keywords = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean)

      const result = await executePipeline({
        projectId,
        topic: formData.topic || undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
        contentLength: formData.contentLength,
        tone: formData.tone,
      })

      if (result.success) {
        // Redirect to project page which will show the pipeline monitor
        router.push(`/project/${projectId}?tab=monitor&executionId=${result.executionId}`)
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/pipeline"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pipeline Manager
          </Link>
          <h1 className="text-4xl font-heading font-bold text-white mb-2 flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            Configure Pipeline
          </h1>
          <p className="text-muted-foreground">
            Set up your content generation parameters and start the AI pipeline
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlassCard className="p-8">
                {/* Topic */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-3">
                    Article Topic
                  </label>
                  <textarea
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="Enter the main topic or subject for your article..."
                    rows={3}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition disabled:opacity-50"
                  />
                </div>

                {/* Keywords */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-3">
                    Keywords (optional)
                  </label>
                  <PremiumInput
                    type="text"
                    placeholder="e.g., AI content, machine learning, automation (separate with commas)"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Comma-separated keywords for SEO optimization
                  </p>
                </div>

                {/* Content Length */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-3">
                    Content Length
                  </label>
                  <div className="space-y-2">
                    {contentLengthOptions.map(option => (
                      <motion.label
                        key={option.value}
                        className="flex items-center p-3 rounded-lg cursor-pointer bg-white/5 border border-white/10 hover:border-purple-500/50 transition"
                      >
                        <input
                          type="radio"
                          name="contentLength"
                          value={option.value}
                          checked={formData.contentLength === option.value}
                          onChange={(e) => setFormData({ ...formData, contentLength: e.target.value as any })}
                          disabled={isLoading}
                          className="w-4 h-4"
                        />
                        <span className="ml-3 text-sm text-white">{option.label}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-white mb-3">
                    Writing Tone
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {toneOptions.map(tone => (
                      <motion.button
                        key={tone}
                        type="button"
                        onClick={() => setFormData({ ...formData, tone: tone.toLowerCase() })}
                        disabled={isLoading}
                        className={`p-3 rounded-lg font-medium text-sm transition ${
                          formData.tone === tone.toLowerCase()
                            ? 'bg-purple-600/50 text-purple-100 border border-purple-500/50'
                            : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {tone}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Agent Preview */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-sm font-bold text-white mb-3">AI Agents in Pipeline</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Keyword Research', model: 'Claude' },
                      { name: 'Research & Analysis', model: 'Claude' },
                      { name: 'Content Outlining', model: 'Claude' },
                      { name: 'Article Writing', model: 'Claude' },
                      { name: 'SEO Optimization', model: 'Claude' },
                      { name: 'Social Media Content', model: 'Claude' },
                      { name: 'Email Marketing Copy', model: 'Claude' },
                      { name: 'LinkedIn Content', model: 'Claude' },
                      { name: 'Quality Assurance', model: 'Claude' },
                      { name: 'Image Generation', model: 'OpenAI' },
                    ].map((agent, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{agent.name}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          agent.model === 'Claude'
                            ? 'bg-purple-600/20 text-purple-300'
                            : 'bg-blue-600/20 text-blue-300'
                        }`}>
                          {agent.model}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-8 pt-8 border-t border-white/10">
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
                    disabled={isLoading || !projectId}
                    icon={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
                    className="flex-1"
                  >
                    {isLoading ? 'Starting Pipeline...' : 'Start Pipeline'}
                  </AnimatedButton>
                </div>
              </GlassCard>
            </motion.form>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6" animated={false}>
                <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Configure', desc: 'Set your content preferences' },
                    { step: 2, title: 'Execute', desc: '10 AI agents process your content' },
                    { step: 3, title: 'Monitor', desc: 'Watch real-time progress' },
                    { step: 4, title: 'Download', desc: 'Get all generated content' },
                  ].map(item => (
                    <div key={item.step} className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Estimated Cost */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6 bg-purple-600/10 border border-purple-500/30" animated={false}>
                <h3 className="text-lg font-bold text-purple-100 mb-2">Estimated Cost</h3>
                <p className="text-2xl font-bold text-white">$0.03 - $0.08</p>
                <p className="text-xs text-purple-200/80 mt-2">Depending on content length</p>
                <p className="text-xs text-purple-200/60 mt-3">Credits: 50-80 from your account</p>
              </GlassCard>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-6" animated={false}>
                <h3 className="text-lg font-bold text-white mb-4">Pro Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Be specific with your topic for better results</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Keywords help with SEO optimization</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Medium length offers best balance</span>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}

export default function NewPipelinePage() {
  return (
    <Suspense fallback={<div className="h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" /></div>}>
      <NewPipelinePageContent />
    </Suspense>
  )
}
