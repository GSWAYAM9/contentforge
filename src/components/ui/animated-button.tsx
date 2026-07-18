'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export function AnimatedButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled = false,
  ...props
}: AnimatedButtonProps) {
  const baseStyles =
    'relative font-medium rounded-xl transition-all duration-300 flex items-center gap-2 justify-center'

  const variants = {
    primary:
      'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/15',
    ghost: 'text-white hover:bg-white/10',
    outline:
      'border border-white/20 text-white hover:bg-white/5 hover:border-white/40',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && icon && icon}
      {children}
    </motion.button>
  )
}
