import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/apiConfig';
import { useToast } from '../../common/Toast';
import LearningUpdateModal from './LearningUpdateModal';
import ConfirmDialog from '../../common/ConfirmDialog';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AchievementsTab = ({ user, currentUser, onUserUpdated }) => {
  const { addToast } = useToast();
  const [learningUpdates, setLearningUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLearningModal, setShowLearningModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updateToDelete, setUpdateToDelete] = useState(null);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [updateToEdit, setUpdateToEdit] = useState(null);
  
  const isCurrentUserProfile = user && currentUser && user.id === currentUser.id;

  useEffect(() => {
    if (user) {
      fetchLearningUpdates();
      fetchTemplates();
    }
  }, [user]);

  const fetchLearningUpdates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/learning/updates/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch learning updates');
      }

      const data = await response.json();
      setLearningUpdates(data);
    } catch (error) {
      console.error('Error fetching learning updates:', error);
      addToast('Failed to load learning updates', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/learning/templates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleAddLearningUpdate = async (learningData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (isEditMode && updateToEdit) {
        const response = await fetch(`${API_BASE_URL}/learning/updates/${updateToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(learningData)
        });

        if (!response.ok) {
          throw new Error('Failed to update learning progress');
        }

        const data = await response.json();
        
        setLearningUpdates(prev => 
          prev.map(item => item.id === updateToEdit.id ? data.learningUpdate : item)
        );
        
        if (onUserUpdated && data.user) {
          onUserUpdated(data.user);
        }
        
        addToast('Learning update edited successfully!', 'success');
      } else {
        const response = await fetch(`${API_BASE_URL}/learning/updates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(learningData)
        });

        if (!response.ok) {
          throw new Error('Failed to add learning update');
        }

        const data = await response.json();
        setLearningUpdates(prev => [data.learningUpdate, ...prev]);
        
        if (onUserUpdated && data.user) {
          onUserUpdated(data.user);
        }
        
        addToast('Learning update added successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating learning progress:', error);
      addToast(`Failed to ${isEditMode ? 'update' : 'add'} learning update`, 'error');
    } finally {
      setShowLearningModal(false);
      setIsEditMode(false);
      setUpdateToEdit(null);
    }
  };

  const handleDeleteClick = (updateId) => {
    setUpdateToDelete(updateId);
    setShowDeleteConfirm(true);
  };

  const handleEditClick = (update) => {
    setUpdateToEdit(update);
    setIsEditMode(true);
    setShowLearningModal(true);
  };

  const handleCloseModal = () => {
    setShowLearningModal(false);
    setIsEditMode(false);
    setUpdateToEdit(null);
  };

  const confirmDeleteLearningUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/learning/updates/${updateToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete learning update');
      }

      setLearningUpdates(prev => prev.filter(update => update.id !== updateToDelete));
      addToast('Learning update deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting learning update:', error);
      addToast('Failed to delete learning update', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setUpdateToDelete(null);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'TUTORIAL': return 'fa-utensils';
      case 'COURSE': return 'fa-lemon';
      case 'PROJECT': return 'fa-clipboard-list';
      default: return 'fa-layer-group';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'BEGINNER': return 'text-green-500';
      case 'INTERMEDIATE': return 'text-yellow-500';
      case 'ADVANCED': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const generateAchievements = () => {
    const achievements = [];
    
    if (learningUpdates.length > 0) {
      achievements.push({
        title: '	First Meal Logged',
        icon: 'fa-utensils',
        color: 'text-yellow-500',
        achieved: true
      });
    }
    
    const uniqueSkills = new Set();
    learningUpdates.forEach(update => 
      update.skillsLearned?.forEach(skill => uniqueSkills.add(skill))
    );
    
    achievements.push({
      title: 'Recipe Collector',
      icon: 'fa-book-open',
      color: 'text-purple-500',
      achieved: uniqueSkills.size >= 5
    });
    
    achievements.push({
      title: 'Meal Prep Enthusiast',
      icon: 'fa-calendar-check',
      color: 'text-blue-500',
      achieved: learningUpdates.length >= 10
    });
    
    if (learningUpdates.length >= 2) {
      const dates = learningUpdates.map(update => new Date(update.completedAt));
      const earliestDate = new Date(Math.min(...dates));
      const latestDate = new Date(Math.max(...dates));
      const daysDifference = Math.floor((latestDate - earliestDate) / (1000 * 60 * 60 * 24));
      
      achievements.push({
        title: 'Consistent Eater',
        icon: 'fa-history',
        color: 'text-green-500',
        achieved: daysDifference >= 30
      });
    } else {
      achievements.push({
        title: 'Consistent Eater',
        icon: 'fa-history',
        color: 'text-green-500',
        achieved: false
      });
    }
    
    const totalHours = learningUpdates.reduce((sum, update) => sum + (update.hoursSpent || 0), 0);
    achievements.push({
      title: 'Healthy Habit Builder',
      icon: 'fa-heart',
      color: 'text-pink-500',
      achieved: totalHours >= 50
    });
    
    const hasAdvanced = learningUpdates.some(update => update.difficulty === 'ADVANCED');
    achievements.push({
      title: 'Master Meal Planner',
      icon: 'fa-clipboard-list',
      color: 'text-red-500',
      achieved: hasAdvanced
    });
    
    return achievements;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-DarkColor"></div>
      </div>
    );
  }

  const achievements = generateAchievements();

  return (
    <div className="space-y-6">
      {/* Achievements Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Plan Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg shadow-sm border text-center ${achievement.achieved ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-50'}`}
            >
              <i className={`fa ${achievement.icon} text-3xl ${achievement.achieved ? achievement.color : 'text-gray-400'} mb-2`}></i>
              <p className="text-sm font-medium">{achievement.title}</p>
              {!achievement.achieved && <p className="text-xs text-gray-500 mt-1">Not achieved yet</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Learning Progress Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Meal Journey</h2>
          {isCurrentUserProfile && (
            <button
              onClick={() => {
                setIsEditMode(false);
                setUpdateToEdit(null);
                setShowLearningModal(true);
              }}
              className="px-4 py-2 bg-DarkColor text-white rounded-md hover:bg-ExtraDarkColor transition-colors"
            >
              <i className='bx bx-plus mr-2'></i> Add Update
            </button>
          )}
        </div>

        {learningUpdates.length > 0 ? (
          <div className="space-y-4">
            {learningUpdates.map(update => (
              <div key={update.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-DarkColor rounded-full flex items-center justify-center text-white">
                      <i className={`fa ${getCategoryIcon(update.category)} text-xl`}></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-lg">{update.title || update.resourceName}</h3>
                      <p className="text-sm text-gray-500">
                        Completed on {formatDate(update.completedAt)}
                      </p>
                    </div>
                  </div>
                  {isCurrentUserProfile && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(update)}
                        className="text-gray-400 hover:text-blue-500"
                        title="Edit this update"
                      >
                        <i className='bx bx-edit-alt'></i>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(update.id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Delete this update"
                      >
                        <i className='bx bx-trash'></i>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mt-3">
                  {update.description && (
                    <p className="text-gray-700 mb-3">{update.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {update.skillsLearned && update.skillsLearned.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className={`flex items-center ${getDifficultyColor(update.difficulty)}`}>
                      <i className='bx bx-signal-4 mr-1'></i> {update.difficulty}
                    </span>
                    {update.hoursSpent && (
                      <span className="flex items-center">
                        <i className='bx bx-time mr-1'></i> {update.hoursSpent} hours
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <div className="inline-block mx-auto">
              <i className='bx bx-book-open text-5xl text-gray-400'></i>
            </div>
            <p className="mt-2 text-gray-600">
              {isCurrentUserProfile 
                ? "You haven't tracked any learning progress yet." 
                : "This user hasn't shared any learning progress yet."}
            </p>
            {isCurrentUserProfile && (
              <button
                onClick={() => setShowLearningModal(true)}
                className="mt-4 px-4 py-2 bg-DarkColor text-white rounded-md hover:bg-ExtraDarkColor"
              >
                Track Your First Progress
              </button>
            )}
          </div>
        )}
        
        {learningUpdates.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-md font-semibold mb-4">Meal Log</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-DarkColor">{learningUpdates.length}</div>
                <div className="text-sm text-gray-500">Updates</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-DarkColor">
                  {learningUpdates.reduce((sum, update) => sum + (update.hoursSpent || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Hours</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-DarkColor">
                  {new Set(learningUpdates.flatMap(update => update.skillsLearned || [])).size}
                </div>
                <div className="text-sm text-gray-500">Focus on</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-DarkColor">
                  {learningUpdates.filter(update => update.difficulty === 'ADVANCED').length}
                </div>
                <div className="text-sm text-gray-500">Advanced</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <LearningUpdateModal
        isOpen={showLearningModal}
        onClose={handleCloseModal}
        onSubmit={handleAddLearningUpdate}
        templates={templates}
        isEditMode={isEditMode}
        updateToEdit={updateToEdit}
      />
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteLearningUpdate}
        title="Delete Learning Update"
        message="Are you sure you want to delete this learning update? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AchievementsTab;
