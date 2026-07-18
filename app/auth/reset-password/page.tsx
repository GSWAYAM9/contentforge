'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyResetToken, resetPassword } from '@/app/actions/password-recovery'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function validateToken() {
      if (!token || !email) {
        setError('Invalid or missing reset link')
        setValidating(false)
        return
      }

      const result = await verifyResetToken(token, email)
      if (result.valid) {
        setTokenValid(true)
      } else {
        setError(result.error || 'Invalid or expired reset link')
      }
      setValidating(false)
    }

    validateToken()
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !email) return

    setLoading(true)
    setError(null)

    const result = await resetPassword({
      token,
      email,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    })

    if (result.success) {
      setSubmitted(true)
      setTimeout(() => {
        router.push('/auth/login?reset=success')
      }, 2000)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {validating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-4" />
              <p className="text-muted-foreground">Validating reset link...</p>
            </div>
          ) : error ? (
            <>
              <Link href="/auth/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mb-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition inline-flex"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </motion.button>
              </Link>

              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Invalid Link</h1>
                <p className="text-red-300">{error}</p>
              </div>

              <motion.div className="space-y-4">
                <Link href="/auth/forgot-password">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition"
                  >
                    Request New Link
                  </motion.button>
                </Link>
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition"
                  >
                    Back to Login
                  </motion.button>
                </Link>
              </motion.div>
            </>
          ) : submitted ? (
            <>
              <div className="mb-8 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4"
                >
                  <Check className="w-8 h-8 text-green-400" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-2">Password Reset</h1>
                <p className="text-muted-foreground">Your password has been successfully reset. Redirecting to login...</p>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mb-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition inline-flex"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </motion.button>
              </Link>

              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Create New Password</h1>
                <p className="text-muted-foreground">Enter your new password below</p>
              </div>

              <motion.form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white mb-2">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">At least 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Passwords do not match
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={
                    loading ||
                    !formData.newPassword ||
                    !formData.confirmPassword ||
                    formData.newPassword !== formData.confirmPassword
                  }
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Reset Password
                    </>
                  )}
                </motion.button>

                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition"
                  >
                    Back to Login
                  </motion.button>
                </Link>
              </motion.form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
