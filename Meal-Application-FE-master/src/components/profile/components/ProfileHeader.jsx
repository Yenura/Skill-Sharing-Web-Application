import React from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultCover from '../../../assets/p.png';
import DefaultAvatar from '../../../assets/avatar.png';

const ProfileHeader = ({ 
  user, 
  currentUser, 
  isCurrentUserProfile, 
  isEditing, 
  imagePreview, 
  triggerFileInput, 
  fileInputRef, 
  handleImageChange, 
  isUploading, 
  setIsEditing, 
  handleLogout, 
  handleFollowAction, 
  handleShowFollowers, 
  handleShowFollowing 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto mt-6">
      <div className="h-80 overflow-hidden relative">
        <img
          className="w-full object-cover h-full object-center transform hover:scale-105 transition-transform duration-500"
          src={DefaultCover}
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Profile Information Section */}
      <div className="relative px-6 pb-6">
        {/* Profile Picture */}
        <div className="absolute -top-20 left-6 sm:left-8 z-20">
          <div className="h-40 w-40 rounded-xl border-4 border-white shadow-xl overflow-hidden group relative">
            <img
              className="h-full w-full object-cover"
              src={imagePreview || user.profilePicture || DefaultAvatar}
              alt={user.username}
            />
            {isEditing && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={triggerFileInput}
              >
                <i className='bx bx-camera text-3xl text-white'></i>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="w-16 h-16 border-4 border-t-4 border-DarkColor rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* User Info and Actions */}
        <div className="ml-0 sm:ml-48 pt-24 sm:pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <h1 className="text-3xl font-bold text-ExtraDarkColor mb-1 sm:mb-0">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.lastName || user.username}
              </h1>
              <span className="sm:ml-4 px-3 py-1 text-xs inline-flex items-center rounded-full bg-DarkColor text-white font-medium">
                {user.role}
              </span>
            </div>
            <p className="text-gray-600 mt-1 text-sm flex items-center">
              <i className='bx bx-user mr-1'></i> @{user.username}
            </p>
            <p className="text-gray-600 mt-1 text-sm flex items-center">
              <i className='bx bx-envelope mr-1'></i> {user.email}
            </p>
            <div className="mt-3 flex space-x-4">
              <button
                onClick={handleShowFollowers}
                className="flex items-center text-sm text-gray-700 hover:text-DarkColor transition-colors"
              >
                <i className='bx bx-user-plus text-DarkColor'></i>
                <span className="ml-1 font-medium">{user.followers ? user.followers.length : 0} Followers</span>
              </button>
              <button
                onClick={handleShowFollowing}
                className="flex items-center text-sm text-gray-700 hover:text-DarkColor transition-colors"
              >
                <i className='bx bx-user-check text-DarkColor'></i>
                <span className="ml-1 font-medium">{user.following ? user.following.length : 0} Following</span>
              </button>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="mt-4 sm:mt-0 flex space-x-2">
            {isCurrentUserProfile ? (
              // Current user's profile actions
              <>
                {isEditing ? (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center"
                  >
                    <i className='bx bx-edit mr-1'></i> Edit Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-DarkColor text-white rounded-lg hover:bg-ExtraDarkColor transition-colors shadow-sm flex items-center"
                >
                  <i className='bx bx-log-out mr-1'></i> Logout
                </button>
              </>
            ) : (
              // Other user's profile actions
              <>
                <button
                  onClick={handleFollowAction}
                  className={`px-4 py-2 ${user?.isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-DarkColor text-white hover:bg-ExtraDarkColor'
                    } rounded-lg transition-colors shadow-sm flex items-center`}
                >
                  <i className={`bx ${user?.isFollowing ? 'bx-user-minus' : 'bx-user-plus'} mr-1`}></i>
                  {user?.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                <button
                  onClick={() => navigate(`/messages/${user.id}`)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm flex items-center"
                >
                  <i className='bx bx-message-square-detail mr-1'></i> Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
