'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, AlertTriangle, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/shared/cards/glass-card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { deleteAccount } from '@/app/actions/settings'

export default function DeleteAccountPage() {
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    if (!password || !confirmed) {
      setError('Please enter your password and confirm deletion')
      return
    }

    setLoading(true)
    setError(null)

    const result = await deleteAccount(password)
    if (result.success) {
      // Redirect to homepage after deletion
      router.push('/auth/login?deleted=true')
    } else {
      setError(result.error || 'Failed to delete account')
      setLoading(false)
    }
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
            <h1 className="text-4xl font-bold text-red-400">Delete Account</h1>
            <p className="text-muted-foreground">This action cannot be undone</p>
          </div>
        </div>

        {/* Danger Warning */}
        <GlassCard className="mb-6 p-6 bg-red-500/5 border-red-500/30">
          <div className="flex gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-300 mb-2">Warning: This is permanent</p>
              <ul className="text-sm text-red-300/70 space-y-1">
                <li>• Your account will be permanently deleted</li>
                <li>• All projects and data will be removed</li>
                <li>• This action cannot be reversed</li>
                <li>• You will lose access to all features</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Deletion Form */}
        <GlassCard className="p-8 border-red-500/20" animated={false}>
          <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Confirm Deletion</h2>
              <p className="text-muted-foreground mb-6">
                To delete your account, please enter your password below. This will immediately remove your account and all associated data.
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password to confirm"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20 cursor-pointer hover:bg-red-500/10 transition">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-4 h-4 rounded mt-1 accent-red-500"
              />
              <div>
                <p className="font-medium text-white">I understand this is permanent</p>
                <p className="text-sm text-muted-foreground">
                  I understand that deleting my account will permanently remove all my data and cannot be reversed.
                </p>
              </div>
            </label>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !password || !confirmed}
                className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg font-medium disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting Account...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Delete My Account
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
