'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Play, Upload, Share2, Settings } from 'lucide-react'

interface Command {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  shortcut: string
  action: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: Command[] = [
    {
      id: 'new-project',
      label: 'New Project',
      description: 'Create a new content project',
      icon: <Plus className="w-4 h-4" />,
      shortcut: '⌘N',
      action: () => { onClose() },
    },
    {
      id: 'save',
      label: 'Save',
      description: 'Save current project',
      icon: <Settings className="w-4 h-4" />,
      shortcut: '⌘S',
      action: () => { onClose() },
    },
    {
      id: 'run-pipeline',
      label: 'Run Pipeline',
      description: 'Start the content pipeline',
      icon: <Play className="w-4 h-4" />,
      shortcut: '⌘R',
      action: () => { onClose() },
    },
    {
      id: 'publish',
      label: 'Publish',
      description: 'Publish to platforms',
      icon: <Upload className="w-4 h-4" />,
      shortcut: '⌘P',
      action: () => { onClose() },
    },
    {
      id: 'share',
      label: 'Share Project',
      description: 'Share with team members',
      icon: <Share2 className="w-4 h-4" />,
      shortcut: '—',
      action: () => { onClose() },
    },
  ]

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % filtered.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + filtered.length) % filtered.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        filtered[selectedIndex]?.action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, filtered, selectedIndex, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-xl bg-card border border-white/10 rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground text-lg"
              />
            </div>

            {/* Commands */}
            <div className="max-h-96 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No commands found
                </div>
              ) : (
                filtered.map((cmd, index) => (
                  <motion.button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action()
                      onClose()
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition ${
                      selectedIndex === index
                        ? 'bg-accent/20'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="text-accent">{cmd.icon}</div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{cmd.label}</p>
                      <p className="text-xs text-muted-foreground">{cmd.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{cmd.shortcut}</span>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground bg-white/5">
              <div className="flex gap-2">
                <span>↑ ↓</span>
                <span className="text-muted-foreground">Navigate</span>
                <span className="ml-4">⏎</span>
                <span className="text-muted-foreground">Select</span>
              </div>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
