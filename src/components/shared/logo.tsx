'use client'

import { Sparkles } from 'lucide-react'
import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg blur opacity-75 animate-pulse" />
        <div className="relative h-full w-full bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      </div>
      <span
        className={`font-heading font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent ${textSizes[size]}`}
      >
        ContentForge AI
      </span>
    </div>
  )
}
