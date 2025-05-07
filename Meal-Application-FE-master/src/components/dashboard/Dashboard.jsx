import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/apiConfig';
import Navbar from '../common/Navbar';
import DefaultAvatar from '../../assets/avatar.png';
import { storage } from '../../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '../common/Toast';
import SharePostModal from '../common/SharePostModal';
import CommentSection from '../common/CommentSection';
import ConfirmDialog from '../common/ConfirmDialog';
import EditPostModal from '../common/EditPostModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Post state
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postMedia, setPostMedia] = useState(null);
  const [postMediaPreview, setPostMediaPreview] = useState(null);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const postFileInputRef = useRef(null);

  // Share state
  const [showShareModal, setShowShareModal] = useState(false);
  const [postToShare, setPostToShare] = useState(null);

  // Add state for confirm dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

    // Add state for edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    // Fetch user profile data for the navbar
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/auth');
            return;
          }
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Fetch posts when user is loaded
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      addToast('Failed to load posts', 'error');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Handle post media file changes
  const handlePostMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostMedia(file);
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setPostMediaPreview(previewUrl);
    }
  };

  // Handle post creation
  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!postContent.trim() && !postMedia) {
      addToast('Please add some content or media to your post', 'error');
      return;
    }

    setIsSubmittingPost(true);

    try {
      const token = localStorage.getItem('token');

      // Upload media file if present
      let mediaUrl = null;
      if (postMedia) {
        const mediaName = `post_${user.id}_${Date.now()}_${postMedia.name}`;
        const storageRef = ref(storage, `profileImages/${mediaName}`);

        await uploadBytes(storageRef, postMedia);
        mediaUrl = await getDownloadURL(storageRef);
      }

      // Create post data
      const postData = {
        content: postContent,
        mediaUrl: mediaUrl,
        mediaType: postMedia ? (postMedia.type.startsWith('image') ? 'IMAGE' : 'VIDEO') : null
      };

      // Send request to create post
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();

      // Add the new post to the posts list
      setPosts(prevPosts => [newPost, ...prevPosts]);

      // Reset form
      setPostContent('');
      setPostMedia(null);
      setPostMediaPreview(null);

      addToast('Post created successfully!', 'success');
    } catch (error) {
      console.error('Error creating post:', error);
      addToast('Failed to create post. Please try again.', 'error');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Function to format post date
  const formatPostDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString();
  };

  // Handle post like
  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const data = await response.json();
      
      // Update post likes in state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: data.liked 
                  ? [...(post.likes || []), user.id] 
                  : (post.likes || []).filter(id => id !== user.id)
              } 
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      addToast('Failed to like post', 'error');
    }
  };

  // Handle opening the share modal
  const handleOpenShareModal = (post) => {
    setPostToShare(post);
    setShowShareModal(true);
  };

  // Add handleEditPost function
  const handleEditPost = (post) => {
    setPostToEdit(post);
    setShowEditModal(true);
  };

  // Add this handler to update posts when comments are added
  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  // Add this function to handle comment deletion - remove window.confirm
  const handleDeleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      const data = await response.json();
      
      // Update the posts state with the updated post
      if (data.post) {
        handlePostUpdated(data.post);
      }
      
      addToast('Comment deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting comment:', error);
      addToast('Failed to delete comment', 'error');
    }
  };

  // Modify this function to show the confirmation dialog instead of using window.confirm
  const handleDeletePost = (postId) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
  };

  // This function will be called when the user confirms deletion
  const confirmDeletePost = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${postToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      // Remove the post from state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete));
      
      addToast('Post deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting post:', error);
      addToast('Failed to delete post', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setPostToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-PrimaryColor">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-DarkColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-PrimaryColor">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl text-red-600 font-semibold mb-4">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-DarkColor text-white rounded-md hover:bg-ExtraDarkColor"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reusing the Navbar component */}
      <Navbar user={user} />

      <div className="max-w-3xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-ExtraDarkColor mb-6">Dashboard</h1>
        
        {/* Post Creation Form */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <img 
              src={user?.profilePicture || DefaultAvatar} 
              alt={user?.username} 
              className="h-10 w-10 rounded-full object-cover"
            />
            <h2 className="ml-3 font-semibold">Create Post</h2>
          </div>
          
          <form onSubmit={handleCreatePost}>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors"
              rows="3"
              placeholder="What's on your mind?"
            ></textarea>
            
            {postMediaPreview && (
              <div className="mt-3 relative">
                {postMedia?.type.startsWith('image') ? (
                  <img 
                    src={postMediaPreview} 
                    alt="Preview" 
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                ) : (
                  <video 
                    src={postMediaPreview} 
                    controls 
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPostMedia(null);
                    setPostMediaPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full"
                >
                  <i className='bx bx-x text-xl'></i>
                </button>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
              <div>
                <input
                  type="file"
                  ref={postFileInputRef}
                  onChange={handlePostMediaChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => postFileInputRef.current?.click()}
                  className="flex items-center text-gray-700 hover:text-DarkColor transition-colors px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  <i className='bx bx-image text-green-500 text-xl mr-1'></i> 
                  <span>Photo/Video</span>
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isSubmittingPost || (!postContent.trim() && !postMedia)}
                className={`px-4 py-2 rounded-lg ${
                  isSubmittingPost || (!postContent.trim() && !postMedia)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-DarkColor text-white hover:bg-ExtraDarkColor'
                } transition-colors`}
              >
                {isSubmittingPost ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Posting...
                  </div>
                ) : 'Post'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Posts Feed */}
        <div className="space-y-4">
          {isLoadingPosts ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-DarkColor"></div>
              <p className="mt-2 text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-3 justify-between">
                  <div className="flex items-center">
                    <img 
                      src={post.authorProfilePicture || DefaultAvatar} 
                      alt={post.authorUsername} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <div 
                        className="font-medium text-gray-800 cursor-pointer hover:underline"
                        onClick={() => navigate(`/profile/${post.authorId}`)}
                      >
                        {post.authorFirstName && post.authorLastName 
                          ? `${post.authorFirstName} ${post.authorLastName}`
                          : post.authorFirstName || post.authorLastName || post.authorUsername}
                      </div>
                      <p className="text-xs text-gray-500">{formatPostDate(post.createdAt)}</p>
                    </div>
                  </div>
                  
                  {/* Add post delete option - only shown for post author */}
                  {user && post.authorId === user.id && (
                    <div className="relative group">
                      <div className="flex space-x-2">
                        {!post.originalPostId && (
                          <button 
                            className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100"
                            onClick={() => handleEditPost(post)}
                            title="Edit post"
                          >
                            <i className='bx bx-edit'></i>
                          </button>
                        )}
                        <button 
                          className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                          onClick={() => handleDeletePost(post.id)}
                          title="Delete post"
                        >
                          <i className='bx bx-trash'></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Show if this is a shared post */}
                {post.originalPostId && (
                  <div className="mb-3 px-3 py-2 bg-gray-50 rounded-md border-l-4 border-DarkColor">
                    <p className="text-sm font-medium text-gray-600">
                      <i className='bx bx-share bx-flip-horizontal mr-1'></i> 
                      {post.shareMessage ? post.shareMessage : "Shared a post"}
                    </p>
                  </div>
                )}
                
                <div className="mb-3">
                  <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                  {post.edited && <span className="text-xs italic text-gray-500">(edited)</span>}
                </div>
                
                {post.mediaUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    {post.mediaType === 'IMAGE' ? (
                      <img 
                        src={post.mediaUrl} 
                        alt="Post media" 
                        className="w-full h-auto"
                      />
                    ) : (
                      <video 
                        src={post.mediaUrl} 
                        controls 
                        className="w-full h-auto"
                      />
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <button 
                    className={`flex items-center ${
                      post.likes && post.likes.includes(user.id) 
                        ? 'text-blue-500 font-medium' 
                        : 'text-gray-500 hover:text-DarkColor'
                    }`}
                    onClick={() => handleLikePost(post.id)}
                  >
                    <i className={`bx ${
                      post.likes && post.likes.includes(user.id) 
                        ? 'bxs-like' 
                        : 'bx-like'
                    } mr-1`}></i> {post.likes ? post.likes.length : 0} Likes
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-DarkColor">
                    <i className='bx bx-comment mr-1'></i> {post.comments ? post.comments.length : 0} Comments
                  </button>
                  <button 
                    className="flex items-center text-gray-500 hover:text-DarkColor"
                    onClick={() => handleOpenShareModal(post)}
                  >
                    <i className='bx bx-share bx-flip-horizontal mr-1'></i> 
                    {post.shares ? post.shares.length : 0} Shares
                  </button>
                </div>
                
                <CommentSection 
                  post={post}
                  currentUser={user}
                  formatTime={formatPostDate}
                  onCommentAdded={handlePostUpdated}
                  onCommentDeleted={handleDeleteComment}
                />
              </div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg text-center shadow">
              <i className='bx bx-message-square-detail text-4xl text-gray-400 mb-3'></i>
              <p className="text-gray-600">No posts yet. Follow users or create your first post!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Share Modal */}
      <SharePostModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={postToShare}
        currentUser={user}
      />

      {/* Add ConfirmDialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone and any shared versions of this post will also be removed."
        confirmText="Delete"
        cancelText="Cancel"
      />

       {/* Add EditPostModal */}
       <EditPostModal
         isOpen={showEditModal}
         onClose={() => setShowEditModal(false)}
         post={postToEdit}
         currentUser={user}
         onPostUpdated={handlePostUpdated}
       />
    </div>
  );
};

export default Dashboard;
