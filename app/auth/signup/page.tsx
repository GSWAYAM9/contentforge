'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatedButton } from '@/components/ui/animated-button'
import { PremiumInput } from '@/components/ui/premium-input'
import { Logo } from '@/components/shared/logo'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [accepted, setAccepted] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!accepted) {
      setError('Please accept the terms and conditions')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      // TODO: Implement actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Signup:', formData)
    } catch (err) {
      setError('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl"
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
          {/* Header */}
          <motion.div className="mb-8 text-center">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">
              Get Started
            </h1>
            <p className="text-muted-foreground">
              Create your ContentForge AI account today
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <motion.div
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <PremiumInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={<User className="h-4 w-4" />}
              required
            />

            <PremiumInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail className="h-4 w-4" />}
              required
            />

            <PremiumInput
              label="Password"
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock className="h-4 w-4" />}
              required
            />

            <PremiumInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<Lock className="h-4 w-4" />}
              required
            />

            <label className="flex items-start gap-3 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-purple-600 mt-1 flex-shrink-0"
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link href="#" className="text-purple-400 hover:text-purple-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-purple-400 hover:text-purple-300">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <AnimatedButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-6"
              icon={!loading && <ArrowRight className="h-4 w-4" />}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </AnimatedButton>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-purple-400 font-medium hover:text-purple-300 transition"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <motion.p
          className="text-center text-xs text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Enterprise ready from day one
        </motion.p>
      </motion.div>
    </div>
  )
}
