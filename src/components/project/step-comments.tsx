'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Trash2, Reply, X, Loader2 } from 'lucide-react'
import { saveComment } from '@/app/actions/project-operations'

interface Comment {
  id: number
  author: string
  text: string
  timestamp: Date
  replies?: Comment[]
  isReply?: boolean
}

interface StepCommentsProps {
  stepId: number
  comments?: Comment[]
  onCommentAdded?: () => void
}

export function StepComments({ stepId, comments = [], onCommentAdded }: StepCommentsProps) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [displayComments, setDisplayComments] = useState<Comment[]>(comments)

  useEffect(() => {
    setDisplayComments(comments)
  }, [comments])

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setIsLoading(true)
    try {
      await saveComment(stepId, newComment)
      setNewComment('')
      onCommentAdded?.()
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddReply = async (commentId: number) => {
    if (!replyText.trim()) return
    setIsLoading(true)
    try {
      await saveComment(stepId, replyText)
      setReplyText('')
      setReplyingTo(null)
      onCommentAdded?.()
    } catch (error) {
      console.error('Error adding reply:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalComments = comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)

  return (
    <div className="border-t border-white/10 pt-4">
      <motion.button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-white transition"
      >
        <MessageSquare className="w-4 h-4" />
        Comments ({totalComments})
      </motion.button>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {/* Add Comment */}
            <div className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-purple-500"
                rows={2}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isLoading}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded text-sm font-medium transition"
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
                Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {displayComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-white/5 rounded border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-white text-sm">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="p-1 hover:bg-white/10 rounded transition opacity-0 hover:opacity-100">
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-300 mb-2">{comment.text || comment.content}</p>

                  <motion.button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition"
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </motion.button>

                  {/* Reply Input */}
                  <AnimatePresence>
                    {replyingTo === comment.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2"
                      >
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full p-2 bg-white/5 border border-white/10 rounded text-white text-xs placeholder-muted-foreground focus:outline-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddReply(comment.id)}
                            disabled={!replyText.trim()}
                            className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded text-xs transition"
                          >
                            <Send className="w-3 h-3" />
                            Reply
                          </button>
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-300 rounded text-xs transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 space-y-2 pl-4 border-l border-white/10">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="p-2 bg-white/5 rounded text-xs">
                          <p className="font-medium text-purple-300">{reply.author}</p>
                          <p className="text-gray-300 mt-1">{reply.text || reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
