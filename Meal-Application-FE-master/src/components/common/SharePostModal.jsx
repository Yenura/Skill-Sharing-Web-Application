import React, { useState } from 'react';
import { API_BASE_URL } from '../../config/apiConfig';
import DefaultAvatar from '../../assets/avatar.png';
import { useToast } from './Toast';

const SharePostModal = ({ isOpen, onClose, post, currentUser }) => {
  const [shareMessage, setShareMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const { addToast } = useToast();

  if (!isOpen || !post) return null;
  
  const handleShare = async (e) => {
    e.preventDefault();
    setIsSharing(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/posts/${post.id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ shareMessage })
      });
      
      // Check response status before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from response if possible
        let errorMessage = 'Failed to share post';
        try {
          if (response.headers.get('content-type')?.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            errorMessage = `Failed to share post: ${response.status} ${response.statusText}`;
          }
        } catch (jsonError) {
          // If JSON parsing fails, use status code in the error message
          errorMessage = `Failed to share post (${response.status})`;
        }
        throw new Error(errorMessage);
      }
      
      // Check if the response has content before trying to parse it
      const contentType = response.headers.get('content-type');
      let data = {};
      
      if (contentType && contentType.includes('application/json') && response.headers.get('content-length') !== '0') {
        data = await response.json();
        console.log("Shared post response:", data);
      }
      
      addToast('Post shared successfully!', 'success');
      setShareMessage('');
      onClose();
      
      // Force a reload to show the newly shared post
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error sharing post:', error);
      addToast(error.message || 'Failed to share post. Please try again.', 'error');
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-ExtraDarkColor">Share Post</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className='bx bx-x text-2xl'></i>
          </button>
        </div>
        
        <form onSubmit={handleShare}>
          <div className="p-4">
            <div className="flex items-center mb-4">
              <img
                src={currentUser?.profilePicture || DefaultAvatar}
                alt={currentUser?.username}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-800">
                  {currentUser?.firstName && currentUser?.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser?.firstName || currentUser?.lastName || currentUser?.username}
                </p>
              </div>
            </div>
            
            <textarea
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors"
              rows="3"
              placeholder="Write something about this post..."
            ></textarea>
            
            {/* Original Post Preview */}
            <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center mb-2">
                <img
                  src={post.authorProfilePicture || DefaultAvatar}
                  alt={post.authorUsername}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-800">
                    {post.authorFirstName && post.authorLastName
                      ? `${post.authorFirstName} ${post.authorLastName}`
                      : post.authorFirstName || post.authorLastName || post.authorUsername}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-800 line-clamp-3">{post.content}</p>
              
              {post.mediaUrl && (
                <div className="mt-2 h-32 overflow-hidden rounded-md">
                  {post.mediaType === 'IMAGE' ? (
                    <img
                      src={post.mediaUrl}
                      alt="Post media"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <i className='bx bx-video text-3xl text-white'></i>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSharing}
              className="px-4 py-2 bg-DarkColor text-white rounded-lg hover:bg-ExtraDarkColor transition-colors"
            >
              {isSharing ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sharing...
                </div>
              ) : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharePostModal;
