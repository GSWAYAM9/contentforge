'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layout, Plus, Copy, Trash2, Star, Search, Filter } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'

interface Template {
  id: number
  name: string
  description: string
  category: 'blog' | 'social' | 'email' | 'landing' | 'product'
  wordCount: number
  tone: string
  popularity: number
  isFavorite: boolean
  preview: string
}

const templates: Template[] = [
  {
    id: 1,
    name: 'Blog Post - How-To Guide',
    description: 'A comprehensive how-to guide template for technical and non-technical topics',
    category: 'blog',
    wordCount: 1500,
    tone: 'Educational',
    popularity: 4.8,
    isFavorite: true,
    preview: 'Introduction, Steps, Tips, Conclusion',
  },
  {
    id: 2,
    name: 'Social Media Caption - Engaging',
    description: 'Eye-catching social media captions with hashtags and CTAs',
    category: 'social',
    wordCount: 280,
    tone: 'Casual & Trendy',
    popularity: 4.6,
    isFavorite: false,
    preview: 'Opening Hook, Content, Call-to-Action, Hashtags',
  },
  {
    id: 3,
    name: 'Product Launch Announcement',
    description: 'Professional template for announcing new products or features',
    category: 'product',
    wordCount: 800,
    tone: 'Professional',
    popularity: 4.9,
    isFavorite: true,
    preview: 'Headline, Problem, Solution, Features, Benefits, CTA',
  },
  {
    id: 4,
    name: 'Email Newsletter',
    description: 'Engaging newsletter template with sections and CTAs',
    category: 'email',
    wordCount: 600,
    tone: 'Friendly',
    popularity: 4.5,
    isFavorite: false,
    preview: 'Subject, Introduction, Main Content, Resources, Footer',
  },
  {
    id: 5,
    name: 'Landing Page Copy',
    description: 'High-converting landing page copy template',
    category: 'landing',
    wordCount: 1200,
    tone: 'Persuasive',
    popularity: 4.7,
    isFavorite: false,
    preview: 'Headline, Subheading, Benefits, Features, Testimonials, CTA',
  },
  {
    id: 6,
    name: 'Product Review',
    description: 'Detailed product review template with pros and cons',
    category: 'blog',
    wordCount: 1000,
    tone: 'Balanced',
    popularity: 4.4,
    isFavorite: false,
    preview: 'Intro, Overview, Pros, Cons, Verdict, Comparison',
  },
]

const categoryColors: Record<string, string> = {
  blog: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  social: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  email: 'bg-green-500/20 text-green-300 border-green-500/30',
  landing: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  product: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
}

const categoryLabels: Record<string, string> = {
  blog: 'Blog',
  social: 'Social',
  email: 'Email',
  landing: 'Landing',
  product: 'Product',
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState(new Set(templates.filter(t => t.isFavorite).map(t => t.id)))

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

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
            <Layout className="w-10 h-10" />
            Content Templates
          </h1>
          <p className="text-muted-foreground">Get started faster with pre-built content templates</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                !selectedCategory
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-white/10 text-muted-foreground hover:bg-white/20'
              }`}
            >
              <Filter className="w-4 h-4" />
              All Templates
            </motion.button>
            {Object.entries(categoryLabels).map(([category, label]) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 h-full flex flex-col hover:border-purple-500/50 transition">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(template.id)}
                    className="ml-2 p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        favorites.has(template.id)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Category and Ratings */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[template.category]}`}>
                    {categoryLabels[template.category]}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-yellow-400">★ {template.popularity}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6 flex-1">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Tone</p>
                    <p className="text-white font-medium">{template.tone}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Typical Length</p>
                    <p className="text-white font-medium">{template.wordCount} words</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Preview</p>
                    <p className="text-white text-xs">{template.preview}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                  >
                    <Plus className="w-4 h-4" />
                    Use Template
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <Copy className="w-5 h-5 text-muted-foreground hover:text-white transition" />
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <GlassCard className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No templates found matching your criteria</p>
          </GlassCard>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
