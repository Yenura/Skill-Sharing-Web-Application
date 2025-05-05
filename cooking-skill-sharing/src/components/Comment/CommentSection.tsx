import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../Auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    profilePicture: string
  }
  createdAt: string
  likes: number
}

interface CommentSectionProps {
  recipeId: string
}

export const CommentSection: React.FC<CommentSectionProps> = ({ recipeId }) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [recipeId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}/comments`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      const data = await response.json()
      setComments(data.comments)
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to comment',
        variant: 'destructive',
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      })
      return
    }

    if (!user || !user.id) { // Ensure user and user.id are available
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      });
      return;
    }

    try {
      const commentData = {
        content: newComment,
        // Assuming backend links comment to recipe via URL path,
        // but including recipeId in body for clarity/potential backend use
        post: { id: recipeId }, // Link to the recipe (post)
        author: { id: user.id }, // Include author's ID
      };

      const response = await fetch(`/api/recipes/${recipeId}/comments?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization token if required by backend
          // 'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to post comment: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      // Assuming backend returns the created comment object
      setComments((prev) => [data, ...prev]); // Add the new comment to the list
      setNewComment('');
      
      toast({
        title: 'Success',
        description: 'Comment posted successfully',
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: `Failed to post comment: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div id="comments" className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Comments</h2>

      {/* Comment Form */}
      <Card className="mb-8 p-4">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Share your thoughts..." : "Please log in to comment"}
            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            disabled={!user}
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!user || !newComment.trim()}
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              Post Comment
            </Button>
          </div>
        </form>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="relative h-10 w-10">
                  <Image
                    src={comment.author.profilePicture}
                    alt={comment.author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{comment.author.name}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{comment.content}</p>
              </div>
            </div>
          </Card>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  )
}
