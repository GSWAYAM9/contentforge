'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { changePassword } from '@/app/actions/settings'

const passwordStrengthLevels = [
  { level: 'Weak', color: 'bg-red-500/20 text-red-300', minScore: 0 },
  { level: 'Fair', color: 'bg-yellow-500/20 text-yellow-300', minScore: 2 },
  { level: 'Good', color: 'bg-blue-500/20 text-blue-300', minScore: 3 },
  { level: 'Strong', color: 'bg-green-500/20 text-green-300', minScore: 4 },
]

function getPasswordStrength(password: string): number {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[!@#$%^&*]/.test(password)) score++
  return score
}

export default function PasswordSettingsPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const passwordStrength = getPasswordStrength(formData.newPassword)
  const strengthLevel = passwordStrengthLevels[Math.min(passwordStrength, 3)]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const result = await changePassword(formData)
    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to change password' })
    }
    setLoading(false)
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard/settings">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Change Password</h1>
            <p className="text-muted-foreground">Update your account password to keep it secure</p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-300'
            }`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}

        {/* Security Info */}
        <GlassCard className="mb-6 p-6 bg-blue-500/5 border-blue-500/30">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-300 mb-1">Use a strong password</p>
              <p className="text-sm text-blue-300/70">
                Make it at least 8 characters long and include uppercase, lowercase, numbers, and symbols for maximum security.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Form */}
        <GlassCard className="p-8" animated={false}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Current Password</label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="Enter your current password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Enter your new password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${strengthLevel.color.split(' ')[0]}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${strengthLevel.color}`}>
                      {strengthLevel.level}
                    </span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className={passwordStrength >= 1 ? 'text-green-400' : ''}>
                      {passwordStrength >= 1 ? '✓' : '○'} At least 8 characters
                    </li>
                    <li className={passwordStrength >= 2 ? 'text-green-400' : ''}>
                      {passwordStrength >= 2 ? '✓' : '○'} Mix of uppercase and lowercase
                    </li>
                    <li className={passwordStrength >= 3 ? 'text-green-400' : ''}>
                      {passwordStrength >= 3 ? '✓' : '○'} Contains numbers
                    </li>
                    <li className={passwordStrength >= 4 ? 'text-green-400' : ''}>
                      {passwordStrength >= 4 ? '✓' : '○'} Contains special characters
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your new password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-red-400 text-sm mt-2">Passwords do not match</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || formData.newPassword !== formData.confirmPassword || !formData.newPassword}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Change Password
                  </>
                )}
              </motion.button>
              <Link href="/dashboard/settings">
                <AnimatedButton variant="secondary">Cancel</AnimatedButton>
              </Link>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </DashboardLayout>
  )
}
