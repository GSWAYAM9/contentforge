'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Share2, Check } from 'lucide-react'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'

interface ResultsDisplayProps {
  executionId: string
  results: {
    keywords?: string[]
    research?: string
    outline?: string
    article?: string
    seoTitle?: string
    seoDescription?: string
    socialPosts?: { twitter?: string; linkedin?: string; instagram?: string }
    emailCopy?: string
    images?: string[]
    costBreakdown?: { promptTokens: number; completionTokens: number; totalCost: number }
  }
  status: 'running' | 'completed' | 'failed'
}

export function ResultsDisplay({ executionId, results, status }: ResultsDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'article' | 'seo' | 'social' | 'email' | 'keywords'>('article')

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

  const tabs = [
    { id: 'article' as const, label: 'Article', has: !!results.article },
    { id: 'keywords' as const, label: 'Keywords', has: !!(results.keywords?.length) },
    { id: 'seo' as const, label: 'SEO', has: !!(results.seoTitle || results.seoDescription) },
    { id: 'social' as const, label: 'Social', has: !!(results.socialPosts?.twitter || results.socialPosts?.linkedin) },
    { id: 'email' as const, label: 'Email', has: !!results.emailCopy },
  ].filter(t => t.has)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {status === 'running' && (
        <GlassCard className="p-4 bg-blue-600/10 border border-blue-500/30" animated={false}>
          <p className="text-sm text-blue-300">Pipeline is running. Results will appear as they complete.</p>
        </GlassCard>
      )}

      {status === 'completed' && (
        <GlassCard className="p-4 bg-green-600/10 border border-green-500/30" animated={false}>
          <p className="text-sm text-green-300">Pipeline completed successfully!</p>
        </GlassCard>
      )}

      {status === 'failed' && (
        <GlassCard className="p-4 bg-red-600/10 border border-red-500/30" animated={false}>
          <p className="text-sm text-red-300">Pipeline failed. Please check the logs.</p>
        </GlassCard>
      )}

      {tabs.length === 0 ? (
        <GlassCard className="p-12 text-center" animated={false}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">No results yet. Running pipeline...</p>
        </GlassCard>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-purple-600/50 text-purple-100 border border-purple-500/50'
                    : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard className="p-6" animated={false}>
              {activeTab === 'article' && results.article && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Generated Article</h3>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleCopy('article', results.article || '')}
                        className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition"
                      >
                        {copiedField === 'article' ? (
                          <>
                            <Check className="h-4 w-4 text-green-400" />
                            <span className="text-xs text-green-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span className="text-xs">Copy</span>
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => handleDownload('article', results.article || '')}
                        className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-xs">Download</span>
                      </motion.button>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-6 max-h-96 overflow-y-auto text-muted-foreground whitespace-pre-wrap text-sm">
                    {results.article}
                  </div>
                </div>
              )}

              {activeTab === 'keywords' && results.keywords && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Keywords & Phrases</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.keywords.map((kw, idx) => (
                      <motion.div
                        key={idx}
                        className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        {kw}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">SEO Metadata</h3>
                  {results.seoTitle && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs font-semibold text-purple-300 mb-2">META TITLE</p>
                      <p className="text-sm text-white mb-3">{results.seoTitle}</p>
                      <motion.button
                        onClick={() => handleCopy('seo-title', results.seoTitle || '')}
                        className="text-xs text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
                      >
                        {copiedField === 'seo-title' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </motion.button>
                    </div>
                  )}
                  {results.seoDescription && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs font-semibold text-purple-300 mb-2">META DESCRIPTION</p>
                      <p className="text-sm text-white mb-3">{results.seoDescription}</p>
                      <motion.button
                        onClick={() => handleCopy('seo-desc', results.seoDescription || '')}
                        className="text-xs text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
                      >
                        {copiedField === 'seo-desc' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Social Media Posts</h3>
                  {results.socialPosts?.twitter && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-xs font-semibold text-blue-300 mb-2">TWITTER/X</p>
                      <p className="text-sm text-white mb-3">{results.socialPosts.twitter}</p>
                      <motion.button
                        onClick={() => handleCopy('twitter', results.socialPosts?.twitter || '')}
                        className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                      >
                        {copiedField === 'twitter' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </motion.button>
                    </div>
                  )}
                  {results.socialPosts?.linkedin && (
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                      <p className="text-xs font-semibold text-cyan-300 mb-2">LINKEDIN</p>
                      <p className="text-sm text-white mb-3">{results.socialPosts.linkedin}</p>
                      <motion.button
                        onClick={() => handleCopy('linkedin', results.socialPosts?.linkedin || '')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
                      >
                        {copiedField === 'linkedin' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'email' && results.emailCopy && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Email Copy</h3>
                    <motion.button
                      onClick={() => handleCopy('email', results.emailCopy || '')}
                      className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition"
                    >
                      {copiedField === 'email' ? (
                        <>
                          <Check className="h-4 w-4 text-green-400" />
                          <span className="text-xs text-green-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="text-xs">Copy</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                  <div className="bg-black/30 rounded-lg p-6 max-h-96 overflow-y-auto text-muted-foreground whitespace-pre-wrap text-sm">
                    {results.emailCopy}
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Cost Breakdown */}
          {results.costBreakdown && (
            <GlassCard className="p-4" animated={false}>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Prompt Tokens</p>
                  <p className="text-lg font-bold text-white">{results.costBreakdown.promptTokens}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completion Tokens</p>
                  <p className="text-lg font-bold text-white">{results.costBreakdown.completionTokens}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="text-lg font-bold text-purple-400">${results.costBreakdown.totalCost.toFixed(4)}</p>
                </div>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </motion.div>
  )
}
