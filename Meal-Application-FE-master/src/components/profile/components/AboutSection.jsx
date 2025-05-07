import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AboutSection = ({
  user,
  isEditing,
  editForm,
  setEditForm,
  handleEditSubmit,
  handleSkillChange,
  isUploading,
  imageUpload,
  imagePreview,
  setImageUpload,
  setImagePreview,
  triggerFileInput,
  fileInputRef
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-ExtraDarkColor mb-4 flex items-center">
        <i className='bx bx-user-circle mr-2'></i>About
      </h2>
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {/* Mobile profile picture upload */}
          <div className="md:hidden mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <button
              type="button"
              onClick={triggerFileInput}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <i className='bx bx-camera mr-2'></i>
              {imageUpload ? 'Change Image' : 'Upload Image'}
            </button>
            {imagePreview && (
              <div className="mt-2 relative h-24 w-24 mx-auto">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageUpload(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md"
                >
                  <i className='bx bx-x'></i>
                </button>
              </div>
            )}
          </div>

          {/* Personal information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={editForm.firstName || ''}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={editForm.lastName || ''}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors"
              rows="4"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nutrients (comma separated)</label>
            <input
              type="text"
              value={editForm.skills.join(', ')}
              onChange={handleSkillChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor transition-colors"
              placeholder="JavaScript, React, etc."
            />
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full px-4 py-2 bg-DarkColor text-white rounded-md hover:bg-ExtraDarkColor transition-colors shadow-sm flex items-center justify-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <i className='bx bx-save mr-1'></i> Save Changes
              </>
            )}
          </button>
        </form>
      ) : (
        <>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 leading-relaxed">{user.bio || 'No bio provided yet.'}</p>
          </div>
          <h3 className="text-md font-semibold text-ExtraDarkColor mb-2 flex items-center">
            <i className='fa fa-leaf mr-2'></i>Focus On
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-DarkColor rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No added yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AboutSection;
