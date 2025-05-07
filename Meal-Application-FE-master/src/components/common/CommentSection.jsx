import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../../config/apiConfig';
import DefaultAvatar from '../../assets/avatar.png';
import { useToast } from './Toast';

const CommentSection = ({ post, currentUser, formatTime, onCommentAdded, onCommentDeleted }) => {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const commentInputRef = useRef(null);
  const { addToast } = useToast();
  
  useEffect(() => {
    if (editingCommentId) {
      commentInputRef.current?.focus();
    }
  }, [editingCommentId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText.trim() })
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to add comment';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      onCommentAdded(data.post);
      setCommentText('');
      setExpanded(true);
      addToast('Comment added successfully', 'success');
    } catch (error) {
      console.error('Error adding comment:', error);
      addToast(error.message || 'Failed to add comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${post.id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to delete comment';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      onCommentDeleted && onCommentDeleted(post.id, commentId);
      onCommentAdded(data.post);
      addToast('Comment deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting comment:', error);
      addToast(error.message || 'Failed to delete comment', 'error');
    }
  };
  
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };
  
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };
  
  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;
    
    setIsEditSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${post.id}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: editText.trim() })
      });
      
      // Better error handling
      if (!response.ok) {
        let errorMessage = `Failed to update comment (${response.status})`;
        if (response.status === 403) {
          errorMessage = "You don't have permission to edit this comment";
        }
        
        try {
          if (response.headers.get("content-type")?.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      onCommentAdded(data.post);
      setEditingCommentId(null);
      setEditText('');
      addToast('Comment updated successfully', 'success');
    } catch (error) {
      console.error('Error updating comment:', error);
      addToast(error.message || 'Failed to update comment', 'error');
    } finally {
      setIsEditSubmitting(false);
    }
  };
  
  return (
    <div className="mt-4">
      <div className="mb-3">
        {!expanded && post.comments && post.comments.length > 0 && (
          <button 
            onClick={() => setExpanded(true)}
            className="text-sm font-medium text-DarkColor hover:underline"
          >
            View {post.comments.length} comment{post.comments.length > 1 ? 's' : ''}
          </button>
        )}
      </div>
      
      {expanded && post.comments && post.comments.length > 0 && (
        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
          {post.comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
              {editingCommentId === comment.id ? (
                <div className="space-y-2">
                  <div className="flex items-center mb-2">
                    <img 
                      src={comment.userProfilePicture || DefaultAvatar} 
                      alt={comment.username} 
                      className="h-8 w-8 rounded-full mr-2 object-cover"
                    />
                    <span className="font-medium text-gray-800">{comment.username}</span>
                  </div>
                  <textarea 
                    ref={commentInputRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-DarkColor text-sm"
                    rows="2"
                    placeholder="Edit your comment..."
                    disabled={isEditSubmitting}
                  ></textarea>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs disabled:opacity-50"
                      disabled={isEditSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateComment(comment.id)}
                      className="px-3 py-1 bg-DarkColor text-white rounded-md text-xs flex items-center disabled:opacity-50"
                      disabled={isEditSubmitting || !editText.trim()}
                    >
                      {isEditSubmitting ? (
                        <>
                          <span className="w-3 h-3 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></span>
                          Saving...
                        </>
                      ) : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <img 
                        src={comment.userProfilePicture || DefaultAvatar} 
                        alt={comment.username} 
                        className="h-8 w-8 rounded-full mr-2 object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{comment.username}</div>
                        <div className="text-xs text-gray-500">
                          {formatTime(comment.createdAt)}
                          {comment.edited && <span className="italic ml-1">(edited)</span>}
                        </div>
                      </div>
                    </div>
                    
                    {currentUser && comment.userId === currentUser.id && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="text-gray-400 hover:text-blue-500 p-1"
                          title="Edit comment"
                        >
                          <i className='bx bx-edit-alt'></i>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Delete comment"
                        >
                          <i className='bx bx-trash'></i>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-line pl-10">{comment.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {expanded && post.comments && post.comments.length > 3 && (
        <button 
          onClick={() => setExpanded(false)}
          className="text-sm text-gray-500 hover:underline mb-3 block"
        >
          Hide comments
        </button>
      )}
      
      <div className="flex items-center">
        <img 
          src={currentUser?.profilePicture || DefaultAvatar} 
          alt={currentUser?.username || 'User'} 
          className="h-8 w-8 rounded-full mr-2 object-cover"
        />
        <form onSubmit={handleSubmitComment} className="flex-1 flex">
          <input 
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-gray-100 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-DarkColor"
            disabled={isSubmitting}
          />
          <button 
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className={`bg-DarkColor text-white rounded-r-full px-4 ${
              !commentText.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-ExtraDarkColor'
            }`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              </div>
            ) : (
              <i className='bx bx-send'></i>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
