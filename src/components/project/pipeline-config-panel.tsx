'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save } from 'lucide-react'
import { savePipelineConfig, PipelineConfig } from '@/app/actions/pipeline-config'

interface PipelineConfigPanelProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
  initialConfig?: PipelineConfig
}

const defaultConfig: PipelineConfig = {
  tone: 'professional',
  wordCount: 2000,
  targetAudience: 'General audience',
  keywords: [],
  enableOutlineApproval: true,
  enableQAApproval: true,
  autoPublish: false,
  selectedPlatforms: [],
  modelPreference: 'claude-3-5-sonnet',
  temperature: 0.7,
  maxTokens: 4096,
  customInstructions: '',
}

export function PipelineConfigPanel({
  projectId,
  isOpen,
  onClose,
  initialConfig = defaultConfig,
}: PipelineConfigPanelProps) {
  const [config, setConfig] = useState<PipelineConfig>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')
    try {
      const result = await savePipelineConfig(projectId, config)
      if (result.success) {
        setSaveMessage('Configuration saved successfully!')
        setTimeout(() => {
          onClose()
          setSaveMessage('')
        }, 1500)
      } else {
        setSaveMessage('Error: ' + (result.error || 'Failed to save'))
      }
    } catch (error) {
      setSaveMessage('Error saving configuration')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-background border border-white/10 rounded-lg p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Pipeline Configuration</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Tone</label>
            <select
              value={config.tone}
              onChange={(e) => setConfig({ ...config, tone: e.target.value as any })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
            </select>
          </div>

          {/* Word Count */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Target Word Count</label>
            <input
              type="number"
              value={config.wordCount}
              onChange={(e) => setConfig({ ...config, wordCount: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Target Audience</label>
            <input
              type="text"
              value={config.targetAudience}
              onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          {/* Approval Gates */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableOutlineApproval}
                onChange={(e) => setConfig({ ...config, enableOutlineApproval: e.target.checked })}
              />
              <span className="text-sm">Require outline approval</span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableQAApproval}
                onChange={(e) => setConfig({ ...config, enableQAApproval: e.target.checked })}
              />
              <span className="text-sm">Require QA approval</span>
            </label>
          </div>

          {/* Custom Instructions */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Custom Instructions</label>
            <textarea
              value={config.customInstructions}
              onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
              placeholder="Any specific requirements or instructions for the AI..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-muted-foreground h-24 resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-3 justify-end pt-4">
            {saveMessage && (
              <div className={`text-sm font-medium ${saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {saveMessage}
              </div>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
