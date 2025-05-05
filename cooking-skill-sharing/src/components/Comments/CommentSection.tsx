import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '../Auth/AuthContext';
import { Heart, MessageCircle, MoreVertical, Flag, Edit, Trash, X, Check, ChevronDown, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Popover } from '@headlessui/react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    profilePicture: string;
  };
  likesCount: number;
  isLiked: boolean;
  replies?: Comment[];
  isEdited?: boolean;
}

interface CommentSectionProps {
  postId: string;
  isPostOwner?: boolean;
}

export const CommentSection = ({ postId, isPostOwner = false }: CommentSectionProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmReport, setConfirmReport] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchComments();
  }, [postId, page]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      
      if (page === 1) {
        setComments(data.comments);
      } else {
        setComments(prev => [...prev, ...data.comments]);
      }
      
      setHasMore(data.hasMore);
      setError('');
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          parentId: replyTo,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const newCommentData = await response.json();
      
      if (replyTo) {
        // Add reply to the parent comment
        setComments(prev => 
          prev.map(comment => 
            comment.id === replyTo 
              ? { 
                  ...comment, 
                  replies: [...(comment.replies || []), newCommentData] 
                }
              : comment
          )
        );
      } else {
        // Add as a new top-level comment
        setComments(prev => [newCommentData, ...prev]);
      }
      
      setNewComment('');
      setReplyTo(null);
      setSuccessMessage('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const updatedComment = await response.json();
      
      // Update the comment in state
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: updatedComment.content, isEdited: true }
            : comment
        )
      );
      
      setEditingComment(null);
      setEditContent('');
      setSuccessMessage('Comment updated successfully!');
    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment. Please try again.');
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // Remove the comment from state
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setConfirmDelete(null);
      setSuccessMessage('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment. Please try again.');
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }

      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likesCount: comment.isLiked
                  ? comment.likesCount - 1
                  : comment.likesCount + 1,
              }
            : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
      setError('Failed to like comment. Please try again.');
    }
  };

  const handleReport = async (commentId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/comments/${commentId}/report`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to report comment');
      }
      
      setConfirmReport(null);
      setSuccessMessage('Comment reported successfully. Our team will review it.');
    } catch (error) {
      console.error('Error reporting comment:', error);
      setError('Failed to report comment. Please try again.');
    }
  };

  const handleModerate = async (commentId: string, action: 'approve' | 'reject') => {
    if (!isPostOwner) return;

    try {
      const response = await fetch(`/api/comments/${commentId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} comment`);
      }

      if (action === 'reject') {
        // Remove the comment from state
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }
      
      setSuccessMessage(`Comment ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing comment:`, error);
      setError(`Failed to ${action} comment. Please try again.`);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
    // Focus the input after state update
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 0);
  };

  const loadMoreComments = () => {
    setPage(prev => prev + 1);
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isAuthor = user?.id === comment.author.id;
    const isEditing = editingComment === comment.id;
    
    return (
      <div className={`${isReply ? 'ml-8 mt-4' : 'mb-6'} animate-fadeIn`}>
        <div className="flex items-start space-x-3">
          <Image
            src={comment.author.profilePicture || '/default-avatar.png'}
            alt={comment.author.username}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex-1">
            {isEditing ? (
              <div className="bg-white border border-orange-200 rounded-lg p-3">
                <textarea
                  ref={commentInputRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingComment(null)}
                    className="px-3 py-1 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEdit(comment.id)}
                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{comment.author.username}</span>
                    {comment.isEdited && (
                      <span className="text-xs text-gray-500">(edited)</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center space-x-1 ${
                        comment.isLiked ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{comment.likesCount}</span>
                    </button>
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className={`text-gray-500 hover:text-gray-700 ${replyTo === comment.id ? 'text-orange-500' : ''}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                    
                    <Popover className="relative">
                      <Popover.Button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <MoreVertical className="h-4 w-4" />
                      </Popover.Button>
                      <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {isAuthor && (
                            <>
                              <button
                                onClick={() => startEditing(comment)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => setConfirmDelete(comment.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </>
                          )}
                          {!isAuthor && (
                            <button
                              onClick={() => setConfirmReport(comment.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              Report
                            </button>
                          )}
                          {isPostOwner && !isAuthor && (
                            <button
                              onClick={() => handleModerate(comment.id, 'reject')}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </button>
                          )}
                        </div>
                      </Popover.Panel>
                    </Popover>
                  </div>
                </div>
                <p className="mt-1 text-gray-700 whitespace-pre-line">{comment.content}</p>
              </div>
            )}
            <div className="mt-1 text-xs text-gray-500 flex items-center">
              <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
              {replyTo === comment.id && (
                <button 
                  onClick={() => setReplyTo(null)}
                  className="ml-2 text-orange-500 hover:text-orange-600"
                >
                  Cancel Reply
                </button>
              )}
            </div>
            
            {replyTo === comment.id && (
              <div className="mt-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={2}
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => setReplyTo(null)}
                    className="px-3 py-1 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !newComment.trim()}
                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    {submitting ? 'Posting...' : 'Reply'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
          <Check className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}

      {!replyTo && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start space-x-3">
            <Image
              src={user?.profilePicture || '/default-avatar.png'}
              alt={user?.username || 'User'}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim() || !user}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Comment'}
                </button>
              </div>
              {!user && (
                <p className="mt-2 text-sm text-gray-500">
                  Please sign in to comment.
                </p>
              )}
            </div>
          </div>
        </form>
      )}

      {loading && page === 1 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>

          {loading && page > 1 && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            </div>
          )}

          {hasMore && !loading && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreComments}
                className="flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ChevronDown className="h-4 w-4 mr-2" />
                Load More Comments
              </button>
            </div>
          )}

          {comments.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </>
      )}

      {/* Confirmation Dialogs */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Comment</h3>
            <p className="text-gray-700 mb-4">Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Comment</h3>
            <p className="text-gray-700 mb-4">Are you sure you want to report this comment for inappropriate content?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmReport(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReport(confirmReport)}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};