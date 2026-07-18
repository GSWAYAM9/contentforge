'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { generateContentWithClaude, generateOutlineWithClaude, generateKeywordsWithClaude } from '@/app/actions/ai-generation'
import { generateImageWithOpenAI } from '@/app/actions/image-generation'

export default function TestAIPIsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const testClaudeContent = async () => {
    setLoading(true)
    try {
      const result = await generateContentWithClaude(
        'Write an engaging introduction',
        'Artificial Intelligence and Machine Learning'
      )
      setResults(prev => [...prev, { type: 'Claude Content', result }])
    } catch (error) {
      setResults(prev => [...prev, { type: 'Claude Content', error: String(error) }])
    }
    setLoading(false)
  }

  const testClaudeOutline = async () => {
    setLoading(true)
    try {
      const result = await generateOutlineWithClaude('The Future of AI')
      setResults(prev => [...prev, { type: 'Claude Outline', result }])
    } catch (error) {
      setResults(prev => [...prev, { type: 'Claude Outline', error: String(error) }])
    }
    setLoading(false)
  }

  const testClaudeKeywords = async () => {
    setLoading(true)
    try {
      const result = await generateKeywordsWithClaude('Machine Learning')
      setResults(prev => [...prev, { type: 'Claude Keywords', result }])
    } catch (error) {
      setResults(prev => [...prev, { type: 'Claude Keywords', error: String(error) }])
    }
    setLoading(false)
  }

  const testOpenAIImage = async () => {
    setLoading(true)
    try {
      const result = await generateImageWithOpenAI(
        'A futuristic AI assistant helping with content creation',
        'modern and professional'
      )
      setResults(prev => [...prev, { type: 'OpenAI Image', result }])
    } catch (error) {
      setResults(prev => [...prev, { type: 'OpenAI Image', error: String(error) }])
    }
    setLoading(false)
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">API Integration Test</h1>
          <p className="text-muted-foreground">
            Test Claude and OpenAI API integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testClaudeContent}
            disabled={loading}
            className="p-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Test Claude Content
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testClaudeOutline}
            disabled={loading}
            className="p-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Test Claude Outline
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testClaudeKeywords}
            disabled={loading}
            className="p-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Test Claude Keywords
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testOpenAIImage}
            disabled={loading}
            className="p-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Test OpenAI Image
          </motion.button>
        </div>

        <div className="space-y-4">
          {results.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                {item.error ? (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{item.type}</h3>
                  {item.error ? (
                    <p className="text-red-400 text-sm">{item.error}</p>
                  ) : (
                    <>
                      {item.result.success ? (
                        <div className="space-y-2 text-sm">
                          {item.result.content && (
                            <div className="bg-black/30 p-3 rounded text-gray-300 max-h-40 overflow-y-auto">
                              {item.result.content}
                            </div>
                          )}
                          {item.result.outline && (
                            <div className="bg-black/30 p-3 rounded text-gray-300 max-h-40 overflow-y-auto">
                              <pre>{JSON.stringify(item.result.outline, null, 2)}</pre>
                            </div>
                          )}
                          {item.result.keywords && (
                            <div className="bg-black/30 p-3 rounded text-gray-300 max-h-40 overflow-y-auto">
                              <pre>{JSON.stringify(item.result.keywords, null, 2)}</pre>
                            </div>
                          )}
                          {item.result.imageUrl && (
                            <div>
                              <img src={item.result.imageUrl} alt="Generated" className="rounded max-w-full h-40" />
                              <p className="text-xs text-muted-foreground mt-2">
                                Cost: ${item.result.cost?.toFixed(2)}
                              </p>
                            </div>
                          )}
                          {item.result.tokensUsed && (
                            <p className="text-xs text-muted-foreground">
                              Tokens: {item.result.tokensUsed} | Cost: ${item.result.cost?.toFixed(4)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-red-400 text-sm">{item.result.error}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
