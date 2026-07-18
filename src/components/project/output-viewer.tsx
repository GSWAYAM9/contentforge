'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Download, Maximize2, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface OutputViewerProps {
  content: string
  type: 'markdown' | 'code' | 'image' | 'table' | 'json'
  language?: string
  title?: string
}

export function OutputViewer({ content, type, language = 'javascript', title }: OutputViewerProps) {
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `output.${type}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const viewerContent = (
    <div className={`flex flex-col ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div>
          <h3 className="text-sm font-semibold text-white">{title || `${type.toUpperCase()} Output`}</h3>
          <p className="text-xs text-muted-foreground mt-1">{language}</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleCopy}
            className="p-2 hover:bg-white/10 rounded transition"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleDownload}
            className="p-2 hover:bg-white/10 rounded transition"
            title="Download"
          >
            <Download className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          {!fullscreen && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setFullscreen(true)}
              className="p-2 hover:bg-white/10 rounded transition"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          )}

          {fullscreen && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setFullscreen(false)}
              className="p-2 hover:bg-white/10 rounded transition"
              title="Close fullscreen"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-auto ${fullscreen ? '' : 'max-h-96'}`}>
        {type === 'code' && (
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            className="!bg-transparent !p-4 !m-0 text-xs"
            wrapLongLines
          >
            {content}
          </SyntaxHighlighter>
        )}

        {type === 'markdown' && (
          <div className="p-4 prose prose-invert max-w-none text-sm prose-headings:text-white prose-p:text-gray-300 prose-code:bg-white/10 prose-code:text-pink-300 prose-code:rounded prose-code:px-2 prose-code:py-1">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}

        {type === 'image' && (
          <div className="p-4 flex items-center justify-center">
            <img
              src={content}
              alt="Output"
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        )}

        {type === 'json' && (
          <div className="p-4 bg-black/40 text-gray-300 text-xs font-mono whitespace-pre-wrap break-words">
            {JSON.stringify(JSON.parse(content), null, 2)}
          </div>
        )}

        {type === 'table' && (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <tbody>
                {content.split('\n').map((row, i) => (
                  <tr
                    key={i}
                    className={i === 0 ? 'bg-white/10 font-semibold' : i % 2 === 0 ? 'bg-white/5' : ''}
                  >
                    {row.split('|').map((cell, j) => (
                      <td
                        key={j}
                        className="px-3 py-2 border border-white/10 text-gray-300"
                      >
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  if (fullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setFullscreen(false)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="w-full h-full bg-black rounded-lg border border-white/20 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {viewerContent}
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 rounded-lg overflow-hidden bg-white/5"
    >
      {viewerContent}
    </motion.div>
  )
}
