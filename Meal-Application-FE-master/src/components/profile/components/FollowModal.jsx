import React from 'react';
import DefaultAvatar from '../../../assets/avatar.png';

const FollowModal = ({
  isOpen,
  onClose,
  title,
  data,
  isLoading,
  onFollowToggle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-ExtraDarkColor">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className='bx bx-x text-2xl'></i>
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-DarkColor"></div>
            </div>
          ) : data.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {data.map(user => (
                <li key={user.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={user.profilePicture || DefaultAvatar}
                        alt={user.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.firstName || user.lastName || user.username}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-medium ${user.isFollowing
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-DarkColor text-white hover:bg-ExtraDarkColor'
                        }`}
                      onClick={() => onFollowToggle(user.id, user.isFollowing)}
                    >
                      {user.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {title === 'Followers' ? 'No followers yet' : 'Not following anyone yet'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
