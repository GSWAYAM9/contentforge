'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  gradient?: boolean
  hover?: boolean
  animated?: boolean
  delay?: number
}

export function GlassCard({
  children,
  className = '',
  gradient = false,
  hover = true,
  animated = true,
  delay = 0,
}: GlassCardProps) {
  const Component = animated ? motion.div : 'div'

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  const hoverVariants = hover
    ? {
        hover: {
          y: -4,
          boxShadow: '0 20px 40px rgba(124, 58, 237, 0.1)',
        },
      }
    : {}

  const props = animated
    ? {
        variants: { ...variants, ...hoverVariants },
        initial: 'initial',
        animate: 'animate',
        whileHover: hover ? 'hover' : undefined,
        transition: { delay: delay * 0.1, duration: 0.3 },
      }
    : {}

  return (
    <Component
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 ${
        gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : ''
      } ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
    </Component>
  )
}
