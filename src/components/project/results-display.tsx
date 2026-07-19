'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Share2, Trash2 } from 'lucide-react'

interface ResultsDisplayProps {
  executionId: string
  results: {
    keywords?: string[]
    research?: string
    outline?: string
    article?: string
    socialPosts?: string
    emailCopy?: string
    images?: string[]
  }
  status: 'running' | 'completed' | 'failed'
}

export function ResultsDisplay({ executionId, results, status }: ResultsDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (field: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleDownload = (field: string, content: string) => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `${field}-${executionId}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const resultSections = [
    { label: 'Keywords', content: results.keywords?.join(', '), field: 'keywords' },
    { label: 'Research', content: results.research, field: 'research' },
    { label: 'Outline', content: results.outline, field: 'outline' },
    { label: 'Article', content: results.article, field: 'article' },
    { label: 'Social Posts', content: results.socialPosts, field: 'social' },
    { label: 'Email Copy', content: results.emailCopy, field: 'email' },
  ].filter(s => s.content)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {status === 'running' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300">Pipeline is running. Results will appear as they complete.</p>
        </div>
      )}

      {status === 'completed' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-sm text-green-300">Pipeline completed successfully!</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-sm text-red-300">Pipeline failed. Please check the logs.</p>
        </div>
      )}

      {resultSections.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No results yet. Running pipeline...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resultSections.map(({ label, content, field }) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white text-sm">{label}</h3>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopy(field, content || '')}
                    title="Copy"
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded transition"
                  >
                    {copiedField === field ? (
                      <span className="text-xs">Copied!</span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(field, content || '')}
                    title="Download"
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded transition"
                  >
                    <Download className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>

              <div className="bg-black/20 rounded p-3 max-h-40 overflow-y-auto">
                <p className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                  {typeof content === 'string' ? content.substring(0, 500) : JSON.stringify(content).substring(0, 500)}
                </p>
                {content && typeof content === 'string' && content.length > 500 && (
                  <p className="text-xs text-muted-foreground mt-2">... (truncated)</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
