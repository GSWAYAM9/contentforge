'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PremiumInput } from '@/components/ui/premium-input'
import { AnimatedButton } from '@/components/ui/animated-button'

export default function ProjectEditPage() {
  const [formData, setFormData] = useState({
    name: 'AI Writing Guide - Q3 2024',
    description: 'Comprehensive guide on using AI for content creation',
    topic: 'AI & Technology',
    targetAudience: 'Content creators and marketers',
    seoKeywords: 'AI, content creation, writing, automation',
    targetChannels: ['Blog', 'LinkedIn', 'Twitter'],
    tone: 'Professional',
    wordCount: '2000-3000',
    status: 'Draft',
  })

  const [saving, setSaving] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Project saved successfully!')
  }

  const channels = [
    { id: 'blog', label: 'Blog' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'medium', label: 'Medium' },
    { id: 'dev', label: 'Dev.to' },
  ]

  const tones = ['Professional', 'Casual', 'Academic', 'Conversational', 'Technical']

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/project/1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Project</h1>
              <p className="text-muted-foreground">Update project settings and configuration</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Basic Information</h3>

              <PremiumInput
                label="Project Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-muted-foreground focus:outline-none focus:border-purple-500"
                  rows={4}
                  placeholder="Describe your project..."
                />
              </div>

              <PremiumInput
                label="Topic"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="e.g., AI & Technology"
                className="mt-4"
              />

              <PremiumInput
                label="Target Audience"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Who is this for?"
                className="mt-4"
              />
            </div>

            {/* SEO Settings */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">SEO & Content</h3>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Keywords</label>
                <textarea
                  value={formData.seoKeywords}
                  onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                  className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-muted-foreground focus:outline-none focus:border-purple-500"
                  rows={2}
                  placeholder="Comma-separated keywords"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-white mb-2">Word Count</label>
                <div className="flex gap-2">
                  <select
                    value={formData.wordCount}
                    onChange={(e) => handleInputChange('wordCount', e.target.value)}
                    className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>500-1000</option>
                    <option>1000-2000</option>
                    <option>2000-3000</option>
                    <option>3000-5000</option>
                    <option>5000+</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Publishing Channels */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Publishing Channels</h3>
              <div className="space-y-3">
                {channels.map((channel) => (
                  <label key={channel.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.targetChannels.includes(channel.label)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('targetChannels', [...formData.targetChannels, channel.label])
                        } else {
                          handleInputChange('targetChannels', formData.targetChannels.filter((c) => c !== channel.label))
                        }
                      }}
                      className="w-4 h-4 rounded bg-white/10 border-white/20 accent-purple-600 cursor-pointer"
                    />
                    <span className="text-white group-hover:text-purple-300 transition">{channel.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Tone */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Content Tone</h3>
              <div className="grid grid-cols-2 gap-2">
                {tones.map((tone) => (
                  <motion.button
                    key={tone}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInputChange('tone', tone)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                      formData.tone === tone
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-muted-foreground hover:text-white'
                    }`}
                  >
                    {tone}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Status</h3>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
              >
                <option>Draft</option>
                <option>In Progress</option>
                <option>Under Review</option>
                <option>Published</option>
                <option>Archived</option>
              </select>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-300 mb-4">Danger Zone</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete Project
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Tabs for Additional Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-white/5 border border-white/10 rounded-xl"
        >
          <h3 className="text-lg font-bold text-white mb-6">Advanced Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Model Preference</p>
              <select className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none">
                <option>Claude 3.5 Sonnet</option>
                <option>Claude 3 Opus</option>
                <option>GPT-4</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Temperature</p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.7"
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
