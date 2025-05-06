import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultAvatar from '../../../assets/avatar.png';
import { API_BASE_URL } from '../../../config/apiConfig';
import SharePostModal from '../../common/SharePostModal';
import CommentSection from '../../common/CommentSection';
import { useToast } from '../../common/Toast';
import ConfirmDialog from '../../common/ConfirmDialog';
import EditPostModal from '../../common/EditPostModal';

const PostsTab = ({
  isCurrentUserProfile,
  user,
  currentUser,
  setShowPostModal,
  postFileInputRef,
  isLoadingPosts,
  posts,
  formatPostDate,
  handleLikePost,
  handleSharePost,
  handlePostUpdated,
  setPosts
}) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [originalPosts, setOriginalPosts] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  
  // Fetch original posts for shared posts
  useEffect(() => {
    const fetchOriginalPosts = async () => {
      const token = localStorage.getItem('token');
      const sharedPosts = posts.filter(post => post.originalPostId);
      
      if (sharedPosts.length === 0) return;
      
      const uniqueOriginalPostIds = [...new Set(sharedPosts.map(post => post.originalPostId))];
      const fetchedPosts = {};
      
      for (const postId of uniqueOriginalPostIds) {
        try {
          const response = await fetch(`${API_BASE_URL}/posts/detail/${postId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            fetchedPosts[postId] = data;
          }
        } catch (error) {
          console.error('Error fetching original post:', error);
        }
      }
      
      setOriginalPosts(fetchedPosts);
    };
    
    if (posts.length > 0) {
      fetchOriginalPosts();
    }
  }, [posts]);

  const openShareModal = (post) => {
    setSelectedPost(post);
    setShowShareModal(true);
  };
  
  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const renderPost = (post, isOriginal = true) => (
    <div className={`${!isOriginal ? 'border border-gray-200 rounded-lg mt-2 bg-gray-50' : ''}`}>
      <div className="flex items-center p-3">
        <img
          src={post.authorProfilePicture || DefaultAvatar}
          alt={post.authorUsername}
          className="h-8 w-8 rounded-full object-cover cursor-pointer"
          onClick={() => navigateToProfile(post.authorId)}
        />
        <div className="ml-3">
          <p 
            className="font-medium text-gray-800 cursor-pointer hover:underline"
            onClick={() => navigateToProfile(post.authorId)}
          >
            {post.authorFirstName && post.authorLastName
              ? `${post.authorFirstName} ${post.authorLastName}`
              : post.authorFirstName || post.authorLastName || post.authorUsername}
          </p>
          <p className="text-xs text-gray-500">{formatPostDate(post.createdAt)}</p>
        </div>
      </div>

      <div className="px-3 pb-3">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
        
        {post.mediaUrl && (
          <div className="mt-3 rounded-lg overflow-hidden">
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
      </div>
    </div>
  );

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

  const handleDeletePost = (postId) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
  };

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

  const handleEditPost = (post) => {
    setPostToEdit(post);
    setShowEditModal(true);
  };

  const updatePostInState = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  return (
    <div className="space-y-6">
      {isCurrentUserProfile && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={user?.profilePicture || DefaultAvatar}
              alt={user?.username}
              className="h-10 w-10 rounded-full object-cover"
            />
            <button
              onClick={() => setShowPostModal(true)}
              className="bg-white text-gray-500 w-full text-left px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
            >
              What's on your mind?
            </button>
          </div>

          <div className="flex mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => {
                setShowPostModal(true);
                setTimeout(() => postFileInputRef.current?.click(), 100);
              }}
              className="flex-1 flex justify-center items-center text-gray-500 py-1 hover:bg-gray-100 rounded-md"
            >
              <i className='bx bx-image text-green-500 text-xl mr-2'></i> Photo/Video
            </button>
          </div>
        </div>
      )}

      {isLoadingPosts ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-DarkColor"></div>
          <p className="mt-2 text-gray-500">Loading posts...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-3 justify-between">
                <div className="flex items-center">
                  <img
                    src={post.authorProfilePicture || DefaultAvatar}
                    alt={post.authorUsername}
                    className="h-10 w-10 rounded-full object-cover cursor-pointer"
                    onClick={() => navigateToProfile(post.authorId)}
                  />
                  <div className="ml-3">
                    <p 
                      className="font-medium text-gray-800 cursor-pointer hover:underline"
                      onClick={() => navigateToProfile(post.authorId)}
                    >
                      {post.authorFirstName && post.authorLastName
                        ? `${post.authorFirstName} ${post.authorLastName}`
                        : post.authorFirstName || post.authorLastName || post.authorUsername}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{formatPostDate(post.createdAt)}</span>
                      {post.edited && <span className="ml-1 italic">(edited)</span>}
                    </div>
                  </div>
                </div>
                
                {currentUser && post.authorId === currentUser.id && (
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
                )}
              </div>

              {post.originalPostId && (
                <div className="mb-3">
                  {post.shareMessage && (
                    <p className="text-gray-800 whitespace-pre-line mb-2">{post.shareMessage}</p>
                  )}
                  
                  <div className="border border-gray-200 rounded-lg bg-gray-50">
                    {originalPosts[post.originalPostId] ? (
                      renderPost(originalPosts[post.originalPostId], false)
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p>Original post is no longer available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!post.originalPostId && (
                <>
                  <div className="mb-3">
                    <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
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
                </>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <button 
                  className={`flex items-center ${
                    post.likes && currentUser && post.likes.includes(currentUser.id) 
                      ? 'text-blue-500 font-medium' 
                      : 'text-gray-500 hover:text-DarkColor'
                  }`}
                  onClick={() => handleLikePost(post.id)}
                >
                  <i className={`bx ${
                    post.likes && currentUser && post.likes.includes(currentUser.id) 
                      ? 'bxs-like' 
                      : 'bx-like'
                  } mr-1`}></i> {post.likes ? post.likes.length : 0} Likes
                </button>
                <button className="flex items-center text-gray-500 hover:text-DarkColor">
                  <i className='bx bx-comment mr-1'></i> {post.comments?.length || 0} Comments
                </button>
                <button 
                  className="flex items-center text-gray-500 hover:text-DarkColor"
                  onClick={() => openShareModal(post.originalPostId ? originalPosts[post.originalPostId] || post : post)}
                >
                  <i className='bx bx-share mr-1'></i> 
                  {post.shares ? post.shares.length : 0} Shares
                </button>
              </div>

              <CommentSection 
                post={post}
                currentUser={currentUser}
                formatTime={formatPostDate}
                onCommentAdded={updatePostInState}
                onCommentDeleted={handleDeleteComment}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <i className='bx bx-message-square-add text-5xl text-gray-400 mb-3'></i>
          <p className="text-gray-600 mb-4">No posts yet. {isCurrentUserProfile ? 'Share your knowledge!' : 'This user has not posted anything yet.'}</p>
          {isCurrentUserProfile && (
            <button
              onClick={() => setShowPostModal(true)}
              className="px-5 py-2 bg-DarkColor text-white rounded-md hover:bg-ExtraDarkColor transition-colors shadow-sm inline-flex items-center"
            >
              <i className='bx bx-plus mr-2'></i> Create Post
            </button>
          )}
        </div>
      )}

      <SharePostModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={selectedPost}
        currentUser={currentUser}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone and any shared versions of this post will also be removed."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={postToEdit}
        currentUser={currentUser}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
};

export default PostsTab;
