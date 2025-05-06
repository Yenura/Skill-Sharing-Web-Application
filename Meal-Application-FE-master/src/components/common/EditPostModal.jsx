import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../../config/apiConfig';
import DefaultAvatar from '../../assets/avatar.png';
import { storage } from '../../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from './Toast';

const EditPostModal = ({ isOpen, onClose, post, currentUser, onPostUpdated }) => {
  const [editContent, setEditContent] = useState(post?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMedia, setEditMedia] = useState(null);
  const [editMediaPreview, setEditMediaPreview] = useState(post?.mediaUrl || null);
  const [keepExistingMedia, setKeepExistingMedia] = useState(true);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();
  
  // Update content when post changes
  useEffect(() => {
    if (post) {
      setEditContent(post.content || '');
      setEditMediaPreview(post.mediaUrl || null);
      setKeepExistingMedia(true);
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditMedia(file);
      setKeepExistingMedia(false);
      const previewUrl = URL.createObjectURL(file);
      setEditMediaPreview(previewUrl);
    }
  };

  const removeMedia = () => {
    setEditMedia(null);
    setEditMediaPreview(null);
    setKeepExistingMedia(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editContent.trim() && !editMediaPreview) {
      addToast('Post content cannot be empty', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Handle media upload if needed
      let mediaUrl = keepExistingMedia ? post.mediaUrl : null;
      let mediaType = keepExistingMedia ? post.mediaType : null;
      
      if (editMedia) {
        const mediaName = `post_${currentUser.id}_${Date.now()}_${editMedia.name}`;
        const storageRef = ref(storage, `postMedia/${mediaName}`);
        
        await uploadBytes(storageRef, editMedia);
        mediaUrl = await getDownloadURL(storageRef);
        mediaType = editMedia.type.startsWith('image') ? 'IMAGE' : 'VIDEO';
      }
      
      const postData = {
        content: editContent.trim(),
        mediaUrl,
        mediaType
      };
      
      const response = await fetch(`${API_BASE_URL}/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });
      
      // Better error handling for different HTTP status codes
      if (!response.ok) {
        let errorMessage = `Failed to update post (${response.status})`;
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
      
      const updatedPost = await response.json();
      onPostUpdated(updatedPost);
      addToast('Post updated successfully', 'success');
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
      addToast(error.message || 'Failed to update post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center mb-4">
            <img
              src={currentUser?.profilePicture || DefaultAvatar}
              alt={currentUser?.username || 'User'}
              className="h-10 w-10 rounded-full object-cover mr-3"
            />
            <div>
              <p className="font-medium text-gray-800">
                {currentUser?.firstName && currentUser?.lastName
                  ? `${currentUser.firstName} ${currentUser.lastName}`
                  : currentUser?.username}
              </p>
            </div>
          </div>

          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-transparent"
            placeholder="What's on your mind?"
            rows="4"
          ></textarea>

          {editMediaPreview && (
            <div className="mt-3 relative">
              {editMedia?.type?.startsWith('image') || post?.mediaType === 'IMAGE' ? (
                <img
                  src={editMediaPreview}
                  alt="Preview"
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              ) : (
                <video
                  src={editMediaPreview}
                  controls
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              )}
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaChange}
                accept="image/*,video/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center text-gray-700 hover:bg-gray-100 px-3 py-1 rounded-md"
              >
                <i className="bx bx-image text-green-500 text-xl mr-1"></i>
                {editMediaPreview ? 'Change Media' : 'Add Media'}
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-DarkColor text-white rounded-lg hover:bg-ExtraDarkColor disabled:opacity-50 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
