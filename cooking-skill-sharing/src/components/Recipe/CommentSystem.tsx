import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

// Mock data - replace with API call
const comments = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    },
    content: 'This recipe looks amazing! I can\'t wait to try it.',
    timestamp: '2024-02-25T10:30:00Z',
    likes: 5,
    replies: [
      {
        id: '2',
        user: {
          id: '2',
          name: 'Sarah Smith',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        },
        content: 'I made it yesterday and it was delicious!',
        timestamp: '2024-02-25T11:00:00Z',
        likes: 2,
      },
    ],
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
    content: 'Great recipe! I added some extra garlic and it was perfect.',
    timestamp: '2024-02-25T12:15:00Z',
    likes: 3,
    replies: [],
  },
]

interface CommentSystemProps {
  recipeId: string
}

export default function CommentSystem({ recipeId }: CommentSystemProps) {
  const [localComments, setLocalComments] = useState(comments)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      },
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    }

    setLocalComments([comment, ...localComments])
    setNewComment('')
  }

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const reply = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      },
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
    }

    setLocalComments(
      localComments.map((comment) =>
        comment.id === parentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    )
    setNewComment('')
    setReplyTo(null)
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    setLocalComments(
      localComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: editContent }
          : comment
      )
    )
    setEditingComment(null)
    setEditContent('')
  }

  const handleDeleteComment = async (commentId: string) => {
    setLocalComments(localComments.filter((comment) => comment.id !== commentId))
  }

  const handleLikeComment = async (commentId: string) => {
    setLocalComments(
      localComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Comments</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {localComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-start gap-3">
              <Image
                src={comment.user.avatar}
                alt={comment.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{comment.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingComment(comment.id)
                        setEditContent(comment.content)
                      }}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {editingComment === comment.id ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2"
                    >
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                        rows={2}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingComment(null)
                            setEditContent('')
                          }}
                          className="rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-gray-600"
                    >
                      {comment.content}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="mt-2 flex items-center gap-4">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="text-sm text-gray-500 hover:text-red-600"
                  >
                    Like ({comment.likes})
                  </button>
                  <button
                    onClick={() => setReplyTo(comment.id)}
                    className="text-sm text-gray-500 hover:text-blue-600"
                  >
                    Reply
                  </button>
                </div>

                {/* Reply Form */}
                <AnimatePresence>
                  {replyTo === comment.id && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={(e) => handleSubmitReply(e, comment.id)}
                      className="mt-4"
                    >
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                        rows={2}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReplyTo(null)
                            setNewComment('')
                          }}
                          className="rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="mt-4 space-y-4 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Image
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{reply.user.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(reply.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="mt-1 text-gray-600">{reply.content}</p>
                          <button
                            onClick={() => handleLikeComment(reply.id)}
                            className="mt-1 text-sm text-gray-500 hover:text-red-600"
                          >
                            Like ({reply.likes})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 