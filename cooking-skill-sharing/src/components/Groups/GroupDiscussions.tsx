import { useState, useEffect } from 'react'
import { MessageSquare, Send, User } from 'lucide-react'
import { useAuth } from '../Auth/AuthContext'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'

interface Discussion {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    id: string
    username: string
    profilePicture?: string
  }
  replyCount: number
}

interface GroupDiscussionsProps {
  groupId: string
  isMember: boolean
}

export default function GroupDiscussions({ groupId, isMember }: GroupDiscussionsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('')
  const [newDiscussionContent, setNewDiscussionContent] = useState('')
  const [showNewDiscussionForm, setShowNewDiscussionForm] = useState(false)
  
  useEffect(() => {
    fetchDiscussions()
  }, [groupId])
  
  const fetchDiscussions = async () => {
    setLoading(true)
    try {
      const { data, error } = await api.get<Discussion[]>(`/groups/${groupId}/discussions`)
      
      if (error) {
        throw new Error(error)
      }
      
      setDiscussions(data)
    } catch (err) {
      console.error('Error fetching discussions:', err)
      toast({
        title: "Error",
        description: "Failed to load discussions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a discussion",
        variant: "destructive",
      })
      return
    }
    
    if (!newDiscussionTitle.trim() || !newDiscussionContent.trim()) {
      toast({
        title: "Validation error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }
    
    try {
      const { data, error } = await api.post<Discussion>(`/groups/${groupId}/discussions`, {
        title: newDiscussionTitle,
        content: newDiscussionContent,
        authorId: user.id
      })
      
      if (error) {
        throw new Error(error)
      }
      
      setDiscussions([data, ...discussions])
      setNewDiscussionTitle('')
      setNewDiscussionContent('')
      setShowNewDiscussionForm(false)
      
      toast({
        title: "Discussion created",
        description: "Your discussion has been posted successfully",
        variant: "default",
      })
    } catch (err) {
      console.error('Error creating discussion:', err)
      toast({
        title: "Error",
        description: "Failed to create discussion. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }
  
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
        <span className="ml-2 text-lg text-gray-600">Loading discussions...</span>
      </div>
    )
  }
  
  return (
    <div>
      {/* Create Discussion Button */}
      {isMember && (
        <div className="mb-6">
          {!showNewDiscussionForm ? (
            <button
              onClick={() => setShowNewDiscussionForm(true)}
              className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start New Discussion
            </button>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Start a New Discussion</h3>
              
              <form onSubmit={handleCreateDiscussion}>
                <div className="mb-4">
                  <label htmlFor="discussionTitle" className="mb-1 block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="discussionTitle"
                    value={newDiscussionTitle}
                    onChange={(e) => setNewDiscussionTitle(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                    placeholder="Enter a descriptive title"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="discussionContent" className="mb-1 block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    id="discussionContent"
                    value={newDiscussionContent}
                    onChange={(e) => setNewDiscussionContent(e.target.value)}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                    placeholder="Share your thoughts, questions, or ideas..."
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewDiscussionForm(false)}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Post Discussion
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
      
      {/* Discussions List */}
      {discussions.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No discussions yet</h3>
          <p className="mt-1 text-gray-500">
            {isMember 
              ? 'Be the first to start a discussion in this group!'
              : 'Join this group to participate in discussions.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {discussion.author.profilePicture ? (
                    <img
                      src={discussion.author.profilePicture}
                      alt={discussion.author.username}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium text-gray-900">{discussion.author.username}</p>
                    <p className="text-sm text-gray-500">{formatDate(discussion.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{discussion.title}</h3>
              <p className="text-gray-700">{discussion.content}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  <span>{discussion.replyCount} {discussion.replyCount === 1 ? 'reply' : 'replies'}</span>
                </div>
                
                {isMember && (
                  <button
                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                    onClick={() => {
                      // In a real implementation, navigate to discussion detail page
                      toast({
                        title: "Feature coming soon",
                        description: "Viewing discussion details will be available soon.",
                        variant: "default",
                      })
                    }}
                  >
                    View Discussion
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
