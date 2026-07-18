'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Clock, User, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react'

interface Approval {
  id: number
  name: string
  status: 'pending' | 'approved' | 'rejected'
  approver?: string
  feedback?: string
  timestamp?: Date
}

interface ApprovalGateProps {
  stepName: string
  approvals: Approval[]
  onApprove?: (id: number, feedback?: string) => void
  onReject?: (id: number, feedback?: string) => void
  requiredApprovals?: number
}

export function ApprovalGate({
  stepName,
  approvals = [],
  onApprove,
  onReject,
  requiredApprovals = 1,
}: ApprovalGateProps) {
  const [feedback, setFeedback] = useState('')
  const [selectedApproval, setSelectedApproval] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const approvedCount = approvals.filter((a) => a.status === 'approved').length
  const rejectedCount = approvals.filter((a) => a.status === 'rejected').length
  const pendingCount = approvals.filter((a) => a.status === 'pending').length
  const isBlocked = rejectedCount > 0
  const isApproved = approvedCount >= requiredApprovals
  const canProceed = isApproved && !isBlocked

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />
    }
  }

  const handleApprove = () => {
    if (selectedApproval && onApprove) {
      onApprove(selectedApproval, feedback)
      setFeedback('')
      setSelectedApproval(null)
    }
  }

  const handleReject = () => {
    if (selectedApproval && onReject) {
      onReject(selectedApproval, feedback)
      setFeedback('')
      setSelectedApproval(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl border-2 transition ${
        canProceed
          ? 'bg-green-500/10 border-green-500/50'
          : isBlocked
            ? 'bg-red-500/10 border-red-500/50'
            : 'bg-yellow-500/10 border-yellow-500/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{stepName} - Approval Required</h3>
          <p className="text-sm text-muted-foreground">
            {requiredApprovals} approval{requiredApprovals > 1 ? 's' : ''} required • {approvedCount} approved, {pendingCount} pending
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            canProceed
              ? 'bg-green-500/30 text-green-300'
              : isBlocked
                ? 'bg-red-500/30 text-red-300'
                : 'bg-yellow-500/30 text-yellow-300'
          }`}
        >
          {canProceed ? 'Approved' : isBlocked ? 'Blocked' : 'Pending Review'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">Approval Progress</p>
          <p className="text-xs text-white font-semibold">
            {approvedCount} / {requiredApprovals}
          </p>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${(approvedCount / requiredApprovals) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
            className={`h-full rounded-full ${
              canProceed ? 'bg-green-500' : isBlocked ? 'bg-red-500' : 'bg-yellow-500'
            }`}
          />
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-3 mb-6">
        {approvals.map((approval) => (
          <motion.div
            key={approval.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(approval.status)}
                <div>
                  <p className="font-medium text-white">{approval.name}</p>
                  {approval.approver && (
                    <div className="flex items-center gap-1 mt-1">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{approval.approver}</p>
                    </div>
                  )}
                  {approval.feedback && (
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <MessageSquare className="w-3 h-3 text-muted-foreground" />
                      <p className="text-gray-400">{approval.feedback}</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedApproval(approval.id)}
                disabled={approval.status !== 'pending'}
                className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded transition disabled:cursor-not-allowed"
              >
                {approval.status === 'pending' ? 'Review' : approval.status}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Review Panel */}
      <AnimatePresence>
        {selectedApproval && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-white/10 rounded-lg border border-white/20 space-y-3"
          >
            <h4 className="font-medium text-white">Your Feedback</h4>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add comments for the creator..."
              className="w-full p-3 bg-black/40 border border-white/10 rounded text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-purple-500"
              rows={3}
            />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium text-sm transition"
              >
                <ThumbsUp className="w-4 h-4" />
                Approve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-sm transition"
              >
                <ThumbsDown className="w-4 h-4" />
                Reject
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedApproval(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium text-sm transition"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      {canProceed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg mt-4 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-300">All approvals received. You can proceed to the next stage.</p>
        </motion.div>
      )}

      {isBlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mt-4 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">This stage has been rejected. Please address the feedback and resubmit.</p>
        </motion.div>
      )}
    </motion.div>
  )
}
