'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Eye, Share2, Download, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ArticlePreviewProps {
  title: string
  content: string
  author?: string
  featuredImage?: string
  readTime?: number
}

export function ArticlePreview({
  title,
  content,
  author = 'ContentForge AI',
  featuredImage,
  readTime = 5,
}: ArticlePreviewProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; title: string; level: number }>>([])
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    // Extract headings for TOC
    const headings = content.match(/#{1,6}\s+(.+)/g) || []
    const toc = headings.map((h, i) => {
      const level = h.match(/#{1,6}/)?.[0].length || 1
      const title = h.replace(/#{1,6}\s+/, '')
      return {
        id: `heading-${i}`,
        title,
        level,
      }
    })
    setTableOfContents(toc)

    // Count words
    const words = content.split(/\s+/).length
    setWordCount(words)
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const estimatedReadTime = Math.ceil(wordCount / 200) || readTime

  return (
    <div className="bg-gradient-to-b from-black via-black to-black/50 min-h-screen">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8 md:py-16"
      >
        {/* Featured Image */}
        {featuredImage && (
          <motion.img
            src={featuredImage}
            alt={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-96 object-cover rounded-xl mb-8 shadow-2xl"
          />
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
        >
          {title}
        </motion.h1>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
            <div>
              <p className="font-medium text-white text-sm">{author}</p>
              <p className="text-xs">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {wordCount} words
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {estimatedReadTime} min read
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-3"
        >
          <article className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                code: ({ node, ...props }) => (
                  <code className="bg-white/10 text-pink-300 px-2 py-1 rounded font-mono text-sm" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-purple-500 pl-4 py-2 mb-4 text-gray-400 italic" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>

          {/* Share Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/10 flex gap-4"
          >
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium">
              <Download className="w-4 h-4" />
              Download
            </button>
          </motion.div>
        </motion.div>

        {/* Table of Contents - Sticky */}
        {tableOfContents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 hidden md:block sticky top-20 h-fit"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Contents
              </h3>
              <nav className="space-y-2">
                {tableOfContents.map((item, i) => (
                  <motion.a
                    key={i}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground hover:text-white transition group flex items-center gap-2"
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                    <span>{item.title}</span>
                  </motion.a>
                ))}
              </nav>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Word Count</p>
                  <p className="font-semibold text-white">{wordCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Read Time</p>
                  <p className="font-semibold text-white">{estimatedReadTime} minutes</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
