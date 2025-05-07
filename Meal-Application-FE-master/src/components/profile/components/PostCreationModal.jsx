import React from 'react';
import DefaultAvatar from '../../../assets/avatar.png';

const PostCreationModal = ({
  isOpen,
  onClose,
  user,
  postContent,
  setPostContent,
  postMedia,
  postMediaPreview,
  setPostMedia,
  setPostMediaPreview,
  isSubmittingPost,
  handleCreatePost,
  postFileInputRef
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-ExtraDarkColor">Create Post</h3>
          <button
            onClick={() => {
              onClose();
              setPostContent('');
              setPostMedia(null);
              setPostMediaPreview(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className='bx bx-x text-2xl'></i>
          </button>
        </div>

        <form onSubmit={handleCreatePost}>
          <div className="p-4">
            <div className="flex items-center mb-4">
              <img
                src={user?.profilePicture || DefaultAvatar}
                alt={user?.username}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-800">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || user?.lastName || user?.username}
                </p>
              </div>
            </div>

            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors"
              rows="4"
              placeholder="What's on your mind?"
            ></textarea>

            {postMediaPreview && (
              <div className="mt-4 relative">
                {postMedia?.type.startsWith('image') ? (
                  <img
                    src={postMediaPreview}
                    alt="Preview"
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <video
                    src={postMediaPreview}
                    controls
                    className="w-full h-auto rounded-lg"
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
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <input
                  type="file"
                  ref={postFileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPostMedia(file);
                      const previewUrl = URL.createObjectURL(file);
                      setPostMediaPreview(previewUrl);
                    }
                  }}
                  accept="image/*,video/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => postFileInputRef.current?.click()}
                  className="flex items-center text-gray-700 hover:text-DarkColor"
                >
                  <i className='bx bx-image text-green-500 text-xl mr-1'></i> Add Photo/Video
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreationModal;
