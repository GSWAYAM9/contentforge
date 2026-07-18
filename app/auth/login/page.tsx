'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatedButton } from '@/components/ui/animated-button'
import { PremiumInput } from '@/components/ui/premium-input'
import { Logo } from '@/components/shared/logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Implement actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Login:', { email, password })
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
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
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue to ContentForge AI
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
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
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />

            <PremiumInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-purple-600"
                />
                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </label>
              <Link
                href="#"
                className="text-sm text-purple-400 hover:text-purple-300 transition"
              >
                Forgot?
              </Link>
            </div>

            <AnimatedButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-6"
              icon={!loading && <ArrowRight className="h-4 w-4" />}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-purple-400 font-medium hover:text-purple-300 transition"
              >
                Create one
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
          By signing in, you agree to our Terms and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  )
}
