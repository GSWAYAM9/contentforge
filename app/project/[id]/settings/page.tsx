'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, AlertCircle, Settings, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { AnimatedButton } from '@/components/ui/animated-button'
import { PremiumInput } from '@/components/ui/premium-input'
import { GlassCard } from '@/components/shared/cards/glass-card'

interface ProjectSettings {
  name: string
  description: string
  topic: string
  tone: 'formal' | 'casual' | 'professional' | 'creative'
  wordCount: number
  targetAudience: string
  keywords: string
  modelPreference: 'gpt-4' | 'gpt-3.5' | 'claude-3' | 'claude-2'
  temperature: number
  maxTokens: number
}

export default function ProjectSettingsPage() {
  const [settings, setSettings] = useState<ProjectSettings>({
    name: 'AI Writing Guide - Q3 2024',
    description: 'Comprehensive guide on using AI for content creation',
    topic: 'AI & Technology',
    tone: 'professional',
    wordCount: 1500,
    targetAudience: 'Technical professionals',
    keywords: 'AI, LLMs, content creation, automation',
    modelPreference: 'claude-3',
    temperature: 0.7,
    maxTokens: 2000,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: keyof ProjectSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Implement API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/project/1`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Settings className="w-8 h-8" />
                Project Settings
              </h1>
              <p className="text-muted-foreground mt-1">Configure your project preferences and AI model settings</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg font-medium transition"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Project Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full" />
            Project Information
          </h2>
          <GlassCard className="p-6 space-y-4">
            <PremiumInput
              label="Project Name"
              value={settings.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter project name"
            />
            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={settings.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition"
                rows={3}
                placeholder="Describe your project..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <PremiumInput
                label="Topic"
                value={settings.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                placeholder="e.g., AI & Technology"
              />
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tone</label>
                <select
                  value={settings.tone}
                  onChange={(e) => handleChange('tone', e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition"
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="professional">Professional</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Content Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full" />
            Content Configuration
          </h2>
          <GlassCard className="p-6 space-y-4">
            <PremiumInput
              label="Target Audience"
              value={settings.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
              placeholder="Who is this for?"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Target Word Count</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={settings.wordCount}
                    onChange={(e) => handleChange('wordCount', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-white font-semibold min-w-fit">{settings.wordCount}</span>
                </div>
              </div>
              <PremiumInput
                label="Keywords (comma-separated)"
                value={settings.keywords}
                onChange={(e) => handleChange('keywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Model Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full" />
            AI Model Configuration
          </h2>
          <GlassCard className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Preferred Model</label>
              <select
                value={settings.modelPreference}
                onChange={(e) => handleChange('modelPreference', e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition"
              >
                <option value="claude-3">Claude 3 Opus</option>
                <option value="gpt-4">GPT-4 (OpenAI)</option>
                <option value="gpt-3.5">GPT-3.5 (OpenAI)</option>
                <option value="claude-2">Claude 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Temperature (Creativity): {settings.temperature.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Lower = More deterministic, Higher = More creative
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Maximum Tokens</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="100"
                  value={settings.maxTokens}
                  onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-white font-semibold min-w-fit">{settings.maxTokens}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-500 rounded-full" />
            Danger Zone
          </h2>
          <GlassCard className="p-6 border-red-500/30 bg-red-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="font-semibold text-white">Delete Project</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 rounded-lg font-medium transition">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
