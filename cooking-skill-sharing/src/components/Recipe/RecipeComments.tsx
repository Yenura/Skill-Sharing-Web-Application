import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UserCircleIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  FlagIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../Auth/AuthContext'
import { useToast } from '../ui/use-toast'
import { api } from '@/lib/api'

// Types for comments and replies
interface Author {
  id: string;
  name: string;
  avatar?: string;
}

interface Reply {
  id: string;
  author: Author;
  content: string;
  likes: number;
  isLiked: boolean;
  date: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  likes: number;
  isLiked: boolean;
  date: string;
  replies: Reply[];
}

export default function RecipeComments({ recipeId }: { recipeId: string }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch comments when component mounts or recipeId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const { data, error } = await api.get<Comment[]>(`/recipes/${recipeId}/comments`)
        
        if (error) {
          throw new Error(`Failed to fetch comments: ${error}`)
        }
        
        // Update isLiked status if user is logged in
        if (user && data) {
          const { data: likedComments } = await api.get<string[]>(`/users/${user.id}/liked-comments`)
          
          const updatedComments = data.map(comment => ({
            ...comment,
            isLiked: likedComments?.includes(comment.id) || false,
            replies: comment.replies.map(reply => ({
              ...reply,
              isLiked: false // We'll assume replies don't have like status tracking for now
            }))
          }))
          
          setComments(updatedComments)
        } else {
          setComments(data || [])
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
        setError('Failed to load comments. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [recipeId, user])

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like comments',
        variant: 'destructive',
      })
      return
    }

    try {
      const comment = comments.find(c => c.id === commentId)
      if (!comment) return

      // Optimistically update UI
      setComments(comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            isLiked: !c.isLiked
          }
        }
        return c
      }))

      // Send API request
      const { error } = await api[comment.isLiked ? 'delete' : 'post'](`/comments/${commentId}/like`, {
        userId: user.id
      })

      if (error) {
        // Revert changes if API call fails
        setComments(comments)
        throw new Error('Failed to update like status')
      }
    } catch (error) {
      console.error('Error liking comment:', error)
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      })
    }
  }

  const handleLikeReply = async (commentId: string, replyId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like replies',
        variant: 'destructive',
      })
      return
    }

    try {
      const comment = comments.find(c => c.id === commentId)
      if (!comment) return
      
      const reply = comment.replies.find(r => r.id === replyId)
      if (!reply) return

      // Optimistically update UI
      setComments(comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: c.replies.map(r => {
              if (r.id === replyId) {
                return {
                  ...r,
                  likes: r.isLiked ? r.likes - 1 : r.likes + 1,
                  isLiked: !r.isLiked
                }
              }
              return r
            })
          }
        }
        return c
      }))

      // Send API request
      const { error } = await api[reply.isLiked ? 'delete' : 'post'](`/comments/${commentId}/replies/${replyId}/like`, {
        userId: user.id
      })

      if (error) {
        // Revert changes if API call fails
        setComments(comments)
        throw new Error('Failed to update reply like status')
      }
    } catch (error) {
      console.error('Error liking reply:', error)
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      })
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to post comments',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await api.post<Comment>(`/recipes/${recipeId}/comments`, {
        content: newComment,
        userId: user.id
      })

      if (error) {
        throw new Error('Failed to post comment')
      }

      if (data) {
        setComments([data, ...comments])
        setNewComment('')
        
        toast({
          title: 'Comment Posted',
          description: 'Your comment has been posted successfully',
          variant: 'default',
        })
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      toast({
        title: 'Error',
        description: 'Failed to post your comment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim()) return
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to post replies',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await api.post<Reply>(`/comments/${commentId}/replies`, {
        content: replyContent,
        userId: user.id
      })

      if (error) {
        throw new Error('Failed to post reply')
      }

      if (data) {
        setComments(comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, data]
            }
          }
          return comment
        }))

        setReplyTo(null)
        setReplyContent('')
        
        toast({
          title: 'Reply Posted',
          description: 'Your reply has been posted successfully',
          variant: 'default',
        })
      }
    } catch (error) {
      console.error('Error posting reply:', error)
      toast({
        title: 'Error',
        description: 'Failed to post your reply. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>

      {/* Comment Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this recipe..."
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleSubmitComment}
                disabled={isSubmitting || !newComment.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            {/* Comment Header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {comment.author.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{comment.author.name}</h3>
                  <p className="text-sm text-gray-500">{formatDate(comment.date)}</p>
                </div>
              </div>
              <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                <EllipsisHorizontalIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Comment Content */}
            <p className="mb-3 text-gray-700">{comment.content}</p>

            {/* Comment Actions */}
            <div className="mb-3 flex items-center space-x-4">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
              >
                {comment.isLiked ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span className="text-sm">{comment.likes}</span>
              </button>
              <button
                onClick={() => setReplyTo(comment.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
              >
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span className="text-sm">Reply</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                <FlagIcon className="h-5 w-5" />
                <span className="text-sm">Report</span>
              </button>
            </div>

            {/* Reply Form */}
            {replyTo === comment.id && (
              <div className="mb-4 rounded-md bg-gray-50 p-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${comment.author.name}...`}
                      rows={2}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setReplyTo(null)
                          setReplyContent('')
                        }}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={isSubmitting || !replyContent.trim()}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Posting...' : 'Reply'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="ml-4 space-y-4 border-l-2 border-gray-100 pl-4">
                {comment.replies.map(reply => (
                  <div key={reply.id} className="rounded-md bg-gray-50 p-3">
                    {/* Reply Header */}
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          {reply.author.avatar ? (
                            <img
                              src={reply.author.avatar}
                              alt={reply.author.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{reply.author.name}</h4>
                          <p className="text-xs text-gray-500">{formatDate(reply.date)}</p>
                        </div>
                      </div>
                      <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                        <EllipsisHorizontalIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Reply Content */}
                    <p className="mb-2 text-sm text-gray-700">{reply.content}</p>

                    {/* Reply Actions */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleLikeReply(comment.id, reply.id)}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600"
                      >
                        {reply.isLiked ? (
                          <HeartIconSolid className="h-4 w-4 text-red-500" />
                        ) : (
                          <HeartIcon className="h-4 w-4" />
                        )}
                        <span>{reply.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600">
                        <FlagIcon className="h-4 w-4" />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
} 