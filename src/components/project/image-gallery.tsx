'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, Trash2, RotateCw, Maximize2, X, Loader2 } from 'lucide-react'
import { generateImageWithOpenAI, saveGeneratedImage } from '@/app/actions/image-generation'

interface GalleryImage {
  id: string
  stepId?: number
  url: string
  alt: string
  prompt?: string
  generated: boolean
}

interface ImageGalleryProps {
  images: GalleryImage[]
  projectId?: string
  onRegenerate?: (id: string) => void
  onDelete?: (id: string) => void
  onDownload?: (id: string) => void
  onImagesUpdated?: () => void
}

export function ImageGallery({ images = [], projectId, onRegenerate, onDelete, onDownload, onImagesUpdated }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No images yet. Generate AI images or upload them.</p>
      </div>
    )
  }

  const currentImage = images[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleRegenerate = async (id: string) => {
    setIsRegenerating(true)
    try {
      const currentImg = images.find(img => img.id === id)
      if (currentImg?.prompt && projectId && currentImg.stepId) {
        const result = await generateImageWithOpenAI(currentImg.prompt)
        if (result.success && result.imageUrl) {
          await saveGeneratedImage(Number(projectId), currentImg.stepId, result.imageUrl, currentImg.alt)
          onImagesUpdated?.()
        } else {
          console.error('Error regenerating image:', result.error)
        }
      } else if (onRegenerate) {
        onRegenerate(id)
      }
    } catch (error) {
      console.error('Error regenerating image:', error)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleDownload = async (id: string) => {
    const img = images.find(image => image.id === id)
    if (img) {
      const link = document.createElement('a')
      link.href = img.url
      link.download = `${img.alt}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    onDownload?.(id)
  }

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id)
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-black/40 rounded-xl overflow-hidden border border-white/10"
      >
        <div className="relative aspect-video flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage.id}
              src={currentImage.url}
              alt={currentImage.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition z-10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition z-10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>

          {/* Counter */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 rounded-full text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Generated Badge */}
          {currentImage.generated && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-purple-600 rounded-full text-xs text-white font-medium">
              AI Generated
            </div>
          )}
        </div>

        {/* Image Info */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-sm font-medium text-white mb-1">{currentImage.alt}</p>
          {currentImage.prompt && (
            <p className="text-xs text-muted-foreground">{currentImage.prompt}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 p-4 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFullscreen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition"
          >
            <Maximize2 className="w-4 h-4" />
            Preview
          </motion.button>

          {currentImage.generated && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRegenerate(currentImage.id)}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded font-medium text-sm transition"
            >
              {isRegenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCw className="w-4 h-4" />
              )}
              Regenerate
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload(currentImage.id)}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium text-sm transition"
          >
            <Download className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(currentImage.id)}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-sm transition"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {images.map((img, idx) => (
          <motion.div
            key={img.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentIndex(idx)}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition ${
              currentIndex === idx ? 'border-purple-500' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <img src={img.url} alt={img.alt} className="w-full h-16 object-cover" />
            {img.generated && (
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
            onClick={() => setFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-auto rounded-lg"
              />

              <button
                onClick={() => setFullscreen(false)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full transition"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
