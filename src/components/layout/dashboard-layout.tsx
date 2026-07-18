'use client'

import { Sidebar } from './sidebar'
import { Navbar } from './navbar'
import { motion } from 'framer-motion'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />

      {/* Main Content */}
      <motion.main
        className="ml-64 mt-20 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
