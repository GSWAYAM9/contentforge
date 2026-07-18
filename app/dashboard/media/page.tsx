'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Image, Upload, Grid, List, Search, Trash2, Download, Share2, Eye } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'

interface MediaItem {
  id: number
  name: string
  type: 'image' | 'video' | 'document'
  size: number
  uploadedAt: Date
  url: string
  tags: string[]
  uses: number
}

const mediaItems: MediaItem[] = [
  {
    id: 1,
    name: 'AI Technology Concept',
    type: 'image',
    size: 2.4,
    uploadedAt: new Date(2024, 0, 15),
    url: 'https://images.unsplash.com/photo-1677442d019cecf8d5b3c3b53b8c31c66c7c6e3b?w=400&h=300&fit=crop',
    tags: ['AI', 'Technology', 'Abstract'],
    uses: 3,
  },
  {
    id: 2,
    name: 'Marketing Strategy Chart',
    type: 'image',
    size: 1.8,
    uploadedAt: new Date(2024, 0, 12),
    url: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&h=300&fit=crop',
    tags: ['Marketing', 'Chart', 'Analytics'],
    uses: 5,
  },
  {
    id: 3,
    name: 'Product Demo Video',
    type: 'video',
    size: 45.2,
    uploadedAt: new Date(2024, 0, 10),
    url: 'https://videos.example.com/product-demo.mp4',
    tags: ['Video', 'Product', 'Demo'],
    uses: 2,
  },
  {
    id: 4,
    name: 'Team Meeting Notes',
    type: 'document',
    size: 0.8,
    uploadedAt: new Date(2024, 0, 8),
    url: 'https://docs.example.com/meeting-notes.pdf',
    tags: ['Document', 'Meeting', 'Notes'],
    uses: 1,
  },
  {
    id: 5,
    name: 'Social Media Graphics Pack',
    type: 'image',
    size: 3.1,
    uploadedAt: new Date(2024, 0, 5),
    url: 'https://images.unsplash.com/photo-1677565508464-f6c1e55a3d1e?w=400&h=300&fit=crop',
    tags: ['Social', 'Graphics', 'Pack'],
    uses: 12,
  },
  {
    id: 6,
    name: 'Brand Guidelines PDF',
    type: 'document',
    size: 2.3,
    uploadedAt: new Date(2024, 0, 1),
    url: 'https://docs.example.com/brand-guidelines.pdf',
    tags: ['Brand', 'Guidelines', 'Document'],
    uses: 8,
  },
]

const typeColors: Record<string, string> = {
  image: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  video: 'bg-red-500/20 text-red-300 border-red-500/30',
  document: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
}

const typeIcons: Record<string, React.ReactNode> = {
  image: <Image className="w-6 h-6" />,
  video: <span className="text-lg">▶</span>,
  document: <span className="text-lg">📄</span>,
}

export default function MediaLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = !selectedType || item.type === selectedType
    return matchesSearch && matchesType
  })

  const totalSize = mediaItems.reduce((sum, item) => sum + item.size, 0)
  const storageUsed = totalSize
  const storageLimit = 500

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <Image className="w-10 h-10" />
            Media Library
          </h1>
          <p className="text-muted-foreground">Manage and organize all your project assets</p>
        </div>

        {/* Storage Info */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Storage Usage</p>
              <p className="text-2xl font-bold text-white">{storageUsed.toFixed(1)} GB / {storageLimit} GB</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
            >
              <Upload className="w-5 h-5" />
              Upload File
            </motion.button>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-cyan-500 h-full rounded-full transition-all"
              style={{ width: `${(storageUsed / storageLimit) * 100}%` }}
            />
          </div>
        </GlassCard>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search and View Mode */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition"
              />
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                }`}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                }`}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(null)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                !selectedType
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-white/10 text-muted-foreground hover:bg-white/20'
              }`}
            >
              All Files
            </motion.button>
            {['image', 'video', 'document'].map(type => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  selectedType === type
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                }`}
              >
                {type === 'document' ? 'Documents' : type === 'video' ? 'Videos' : 'Images'}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Media Items */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="overflow-hidden group hover:border-purple-500/50 transition">
                  {/* Preview */}
                  <div className="relative bg-white/5 aspect-video flex items-center justify-center overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="text-4xl opacity-50 group-hover:scale-105 transition">
                        {typeIcons[item.type]}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      >
                        <Eye className="w-5 h-5 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      >
                        <Download className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-white truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.size} MB • {item.uploadedAt.toLocaleDateString()}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded border font-medium ${typeColors[item.type]}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                      <span className="text-muted-foreground">{item.uses} uses</span>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-2 hover:bg-red-500/20 rounded transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-4 hover:border-purple-500/50 transition">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg ${typeColors[item.type]}`}>
                      {typeIcons[item.type]}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.size} MB • {item.uploadedAt.toLocaleDateString()} • {item.uses} uses
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-white/10 text-white/70 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-white/10 rounded transition"
                      >
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-white/10 rounded transition"
                      >
                        <Share2 className="w-5 h-5 text-muted-foreground" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-red-500/20 rounded transition"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {filteredMedia.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">No media files found</p>
          </GlassCard>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
