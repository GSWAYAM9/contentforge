'use client'

import React from 'react'

interface PremiumInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function PremiumInput({
  label,
  error,
  icon,
  className = '',
  ...props
}: PremiumInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 ${
            icon ? 'pl-10' : ''
          } text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 ${
            error ? 'border-red-500 focus:border-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
