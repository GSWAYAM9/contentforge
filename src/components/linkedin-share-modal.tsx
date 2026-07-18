'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, CheckCircle2, Calendar } from 'lucide-react'
import { postToLinkedIn, scheduleLinkedInPost } from '@/app/actions/linkedin-integration'

interface LinkedInShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  accessToken: string
}

export function LinkedInShareModal({
  isOpen,
  onClose,
  title,
  content,
  accessToken,
}: LinkedInShareModalProps) {
  const [isPosting, setIsPosting] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0])
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [visibility, setVisibility] = useState<'PUBLIC' | 'CONNECTIONS'>('PUBLIC')
  const [posted, setPosted] = useState(false)
  const [error, setError] = useState('')

  const handlePostNow = async () => {
    setIsPosting(true)
    setError('')
    try {
      const result = await postToLinkedIn(title, content, accessToken, visibility)
      if (result.success) {
        setPosted(true)
        setTimeout(() => {
          onClose()
          setPosted(false)
        }, 2000)
      } else {
        setError(result.error || 'Failed to post')
      }
    } catch (err) {
      setError('An error occurred while posting')
    } finally {
      setIsPosting(false)
    }
  }

  const handleSchedule = async () => {
    setIsScheduling(true)
    setError('')
    try {
      const scheduledTime = new Date(`${scheduleDate}T${scheduleTime}`)
      const result = await scheduleLinkedInPost(title, content, accessToken, scheduledTime, visibility)
      if (result.success) {
        setPosted(true)
        setTimeout(() => {
          onClose()
          setPosted(false)
        }, 2000)
      } else {
        setError(result.error || 'Failed to schedule')
      }
    } catch (err) {
      setError('An error occurred while scheduling')
    } finally {
      setIsScheduling(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-background border border-white/10 rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {posted ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                <p className="text-white font-semibold">Successfully shared to LinkedIn!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Share to LinkedIn</h2>
                  <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Visibility</label>
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as 'PUBLIC' | 'CONNECTIONS')}
                      className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                    >
                      <option value="PUBLIC">Public</option>
                      <option value="CONNECTIONS">Connections Only</option>
                    </select>
                  </div>

                  {isScheduling && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Date</label>
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Time</label>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePostNow}
                      disabled={isPosting}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                    >
                      {isPosting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Post Now'
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsScheduling(!isScheduling)
                        if (!isScheduling) {
                          setError('')
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                      <Calendar className="w-4 h-4" />
                      {isScheduling ? 'Cancel' : 'Schedule'}
                    </motion.button>
                  </div>

                  {isScheduling && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSchedule}
                      disabled={isScheduling}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                    >
                      {isScheduling ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Scheduling...
                        </span>
                      ) : (
                        'Schedule Post'
                      )}
                    </motion.button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
