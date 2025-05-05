import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlusIcon, 
  CheckCircleIcon,
  XMarkIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BeakerIcon,
  ClockIcon,
  TrophyIcon,
  ShareIcon,
  TrashIcon,
  PencilIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import { api } from '@/lib/api'
import { useAuth } from '../Auth/AuthContext'
import { format } from 'date-fns'
import { Confetti } from '../ui/Confetti'

// Types for learning goals
interface Resource {
  id?: string;
  type: 'video' | 'article' | 'recipe' | 'course';
  title: string;
  url: string;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedDate?: string;
}

interface Goal {
  id: string;
  title: string;
  category: string;
  description: string;
  progress: number;
  deadline?: string;
  createdAt?: string;
  milestones: Milestone[];
  recommendedResources: Resource[];
  isPublic?: boolean;
}

// Mock data for learning goals
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Master Basic Knife Skills',
    category: 'Techniques',
    description: 'Learn and practice fundamental knife cuts including julienne, brunoise, and chiffonade',
    progress: 75,
    deadline: '2024-06-30',
    milestones: [
      { id: '1', title: 'Learn proper knife grip', completed: true },
      { id: '2', title: 'Practice basic cuts', completed: true },
      { id: '3', title: 'Speed and consistency training', completed: false },
      { id: '4', title: 'Advanced cuts mastery', completed: false }
    ],
    recommendedResources: [
      { type: 'video', title: 'Basic Knife Skills Tutorial', url: '#' },
      { type: 'recipe', title: 'Practice Recipe: Vegetable Stir Fry', url: '#' }
    ]
  },
  {
    id: '2',
    title: 'Explore Asian Cuisine',
    category: 'Cuisines',
    description: 'Learn to cook authentic dishes from various Asian cuisines including Japanese, Thai, and Korean',
    progress: 30,
    deadline: '2024-12-31',
    milestones: [
      { id: '1', title: 'Master rice cooking', completed: true },
      { id: '2', title: 'Learn basic stir-frying', completed: false },
      { id: '3', title: 'Understand key ingredients', completed: false },
      { id: '4', title: 'Cook 5 authentic dishes', completed: false }
    ],
    recommendedResources: [
      { type: 'article', title: 'Essential Asian Pantry Items', url: '#' },
      { type: 'recipe', title: 'Basic Fried Rice Recipe', url: '#' }
    ]
  }
]

// Available goal categories
const goalCategories = [
  { id: 'techniques', name: 'Techniques', icon: AcademicCapIcon },
  { id: 'cuisines', name: 'Cuisines', icon: BeakerIcon },
  { id: 'equipment', name: 'Equipment', icon: ChartBarIcon },
  { id: 'time-management', name: 'Time Management', icon: ClockIcon },
  { id: 'achievement', name: 'Achievement', icon: TrophyIcon }
]

// Resource type icons
const resourceTypeIcons = {
  video: '🎬',
  article: '📄',
  recipe: '📝',
  course: '🎓'
}

export default function LearningGoals({ userId }: { userId?: string }) {
  const { user } = useAuth();
  const isOwnProfile = !userId || (user && user.id === userId);
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedGoalTitle, setCompletedGoalTitle] = useState('');
  const [isAddingResource, setIsAddingResource] = useState<string | null>(null);
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: '',
    description: '',
    deadline: '',
    isPublic: false
  });
  
  const [newResource, setNewResource] = useState({
    type: 'recipe' as 'video' | 'article' | 'recipe' | 'course',
    title: '',
    url: ''
  });

  // Filter goals by category
  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category.toLowerCase() === selectedCategory.toLowerCase());

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      // In a real implementation, fetch from API
      // const response = await api.get(`/users/${userId || 'me'}/goals`);
      // setGoals(response.data);
      
      // Using mock data for now
      setGoals(mockGoals);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.category || !newGoal.description) return;

    try {
      // In a real implementation, send to API
      // const response = await api.post('/users/me/goals', newGoal);
      // const addedGoal = response.data;
      
      // Mock response
      const addedGoal: Goal = {
        id: String(Date.now()),
        ...newGoal,
        progress: 0,
        milestones: [],
        recommendedResources: [],
        createdAt: new Date().toISOString()
      };
      
      setGoals([...goals, addedGoal]);
      setNewGoal({
        title: '',
        category: '',
        description: '',
        deadline: '',
        isPublic: false
      });
      setIsAddingGoal(false);
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Failed to add goal');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      // In a real implementation, send to API
      // await api.delete(`/users/me/goals/${goalId}`);
      
      // Update local state
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal');
    }
  };

  const handleAddMilestone = async (goalId: string) => {
    try {
      // In a real implementation, send to API
      // const response = await api.post(`/users/me/goals/${goalId}/milestones`, { title: '' });
      // const newMilestone = response.data;
      
      // Mock response
      const newMilestone: Milestone = {
        id: String(Date.now()),
        title: '',
        completed: false
      };
      
      setGoals(goals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            milestones: [...goal.milestones, newMilestone]
          };
        }
        return goal;
      }));
    } catch (err) {
      console.error('Error adding milestone:', err);
      setError('Failed to add milestone');
    }
  };

  const handleUpdateMilestone = async (goalId: string, milestoneId: string, updates: Partial<Milestone>) => {
    try {
      // In a real implementation, send to API
      // await api.patch(`/users/me/goals/${goalId}/milestones/${milestoneId}`, updates);
      
      // Update local state
      setGoals(goals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            milestones: goal.milestones.map(milestone => {
              if (milestone.id === milestoneId) {
                return { ...milestone, ...updates };
              }
              return milestone;
            })
          };
        }
        return goal;
      }));
    } catch (err) {
      console.error('Error updating milestone:', err);
      setError('Failed to update milestone');
    }
  };

  const handleToggleMilestone = async (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const milestone = goal.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;
    
    const newCompletedState = !milestone.completed;
    const updates: Partial<Milestone> = { 
      completed: newCompletedState,
      completedDate: newCompletedState ? new Date().toISOString() : undefined
    };
    
    try {
      await handleUpdateMilestone(goalId, milestoneId, updates);
      
      // Check if all milestones are completed
      const updatedGoal = goals.find(g => g.id === goalId);
      if (updatedGoal) {
        const allCompleted = updatedGoal.milestones.length > 0 && 
          updatedGoal.milestones.every(m => m.completed || (m.id === milestoneId && newCompletedState));
        
        if (allCompleted) {
          // Update progress to 100%
          await handleUpdateGoal(goalId, { progress: 100 });
          
          // Show celebration
          setCompletedGoalTitle(updatedGoal.title);
          setShowConfetti(true);
        } else {
          // Calculate new progress
          const completedCount = updatedGoal.milestones.filter(m => 
            m.completed || (m.id === milestoneId && newCompletedState)
          ).length;
          const progress = Math.round((completedCount / updatedGoal.milestones.length) * 100);
          
          await handleUpdateGoal(goalId, { progress });
        }
      }
    } catch (err) {
      console.error('Error toggling milestone:', err);
      setError('Failed to update milestone');
    }
  };
  
  const handleUpdateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      // In a real implementation, send to API
      // await api.patch(`/users/me/goals/${goalId}`, updates);
      
      // Update local state
      setGoals(goals.map(goal => {
        if (goal.id === goalId) {
          return { ...goal, ...updates };
        }
        return goal;
      }));
    } catch (err) {
      console.error('Error updating goal:', err);
      setError('Failed to update goal');
    }
  };
  
  const handleAddResource = async (goalId: string) => {
    if (!newResource.title || !newResource.url) {
      setIsAddingResource(null);
      return;
    }
    
    try {
      // In a real implementation, send to API
      // const response = await api.post(`/users/me/goals/${goalId}/resources`, newResource);
      // const addedResource = response.data;
      
      // Mock response
      const addedResource: Resource = {
        id: String(Date.now()),
        ...newResource
      };
      
      setGoals(goals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            recommendedResources: [...goal.recommendedResources, addedResource]
          };
        }
        return goal;
      }));
      
      setNewResource({
        type: 'recipe',
        title: '',
        url: ''
      });
      
      setIsAddingResource(null);
    } catch (err) {
      console.error('Error adding resource:', err);
      setError('Failed to add resource');
    }
  };
  
  const handleShareGoal = async (goalId: string) => {
    try {
      // Toggle public status
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;
      
      const newPublicState = !goal.isPublic;
      
      // In a real implementation, send to API
      // await api.patch(`/users/me/goals/${goalId}`, { isPublic: newPublicState });
      
      // Update local state
      await handleUpdateGoal(goalId, { isPublic: newPublicState });
      
      // Show confirmation
      alert(newPublicState 
        ? 'Goal is now public and can be shared with others!' 
        : 'Goal is now private.');
    } catch (err) {
      console.error('Error sharing goal:', err);
      setError('Failed to update goal visibility');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      {/* Celebration confetti */}
      {showConfetti && (
        <>
          <Confetti 
            duration={5000} 
            onComplete={() => setShowConfetti(false)} 
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={() => setShowConfetti(false)}>
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
              <h2 className="text-2xl font-bold mb-4">🎉 Goal Completed! 🎉</h2>
              <p className="text-lg mb-6">Congratulations! You've completed your goal:</p>
              <p className="text-xl font-semibold text-orange-600 mb-6">{completedGoalTitle}</p>
              <button 
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                onClick={() => setShowConfetti(false)}
              >
                Continue Learning
              </button>
            </div>
          </div>
        </>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Learning Goals</h2>
        {isOwnProfile && (
          <button
            onClick={() => setIsAddingGoal(!isAddingGoal)}
            className="flex items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            {isAddingGoal ? (
              <>
                <XMarkIcon className="mr-1 h-5 w-5" />
                Cancel
              </>
            ) : (
              <>
                <PlusIcon className="mr-1 h-5 w-5" />
                Add Goal
              </>
            )}
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-full px-4 py-1 text-sm font-medium ${
            selectedCategory === 'all'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Goals
        </button>
        {goalCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center rounded-full px-4 py-1 text-sm font-medium ${
              selectedCategory === category.id
                ? 'bg-orange-100 text-orange-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <category.icon className="mr-1 h-4 w-4" />
            {category.name}
          </button>
        ))}
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {isAddingGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <h3 className="mb-4 text-lg font-medium">Add New Goal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="What do you want to learn?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  >
                    <option value="">Select a category</option>
                    {goalCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Describe your goal in detail"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newGoal.isPublic}
                    onChange={(e) => setNewGoal({ ...newGoal, isPublic: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                    Make this goal public (others can see and follow your progress)
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleAddGoal}
                    className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                  >
                    Create Goal
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length > 0 ? (
          filteredGoals.map(goal => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{goal.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                      {goal.category}
                    </span>
                    {goal.isPublic && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        Public
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-gray-600">{goal.description}</p>
                
                {goal.deadline && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <ClockIcon className="mr-1 h-4 w-4" />
                    <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">{Math.round(goal.progress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    className={`h-full rounded-full transition-all duration-500 ${
                      goal.progress === 100 ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isOwnProfile && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAddMilestone(goal.id)}
                    className="flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    <PlusIcon className="mr-1 h-4 w-4" />
                    Add Milestone
                  </button>
                  <button
                    onClick={() => setIsAddingResource(isAddingResource === goal.id ? null : goal.id)}
                    className="flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    <BookOpenIcon className="mr-1 h-4 w-4" />
                    {isAddingResource === goal.id ? 'Cancel' : 'Add Resource'}
                  </button>
                  <button
                    onClick={() => handleShareGoal(goal.id)}
                    className="flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    <ShareIcon className="mr-1 h-4 w-4" />
                    {goal.isPublic ? 'Make Private' : 'Share Goal'}
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="flex items-center rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                  >
                    <TrashIcon className="mr-1 h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}

              {/* Add Resource Form */}
              <AnimatePresence>
                {isAddingResource === goal.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                      <h4 className="mb-2 text-sm font-medium">Add Learning Resource</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">
                            Resource Type
                          </label>
                          <select
                            value={newResource.type}
                            onChange={(e) => setNewResource({ 
                              ...newResource, 
                              type: e.target.value as 'video' | 'article' | 'recipe' | 'course' 
                            })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                          >
                            <option value="video">Video</option>
                            <option value="article">Article</option>
                            <option value="recipe">Recipe</option>
                            <option value="course">Course</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">
                            Title
                          </label>
                          <input
                            type="text"
                            value={newResource.title}
                            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                            placeholder="Resource title"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">
                            URL
                          </label>
                          <input
                            type="url"
                            value={newResource.url}
                            onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleAddResource(goal.id)}
                            className="rounded-md bg-orange-500 px-3 py-1 text-sm font-medium text-white hover:bg-orange-600"
                          >
                            Add Resource
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Milestones */}
              <div className="mb-4">
                <h4 className="mb-2 font-medium">Milestones</h4>
                <div className="space-y-2">
                  {goal.milestones.length > 0 ? (
                    goal.milestones.map(milestone => (
                      <div
                        key={milestone.id}
                        className="flex items-center space-x-2 rounded-md bg-gray-50 p-2"
                      >
                        <button
                          onClick={() => isOwnProfile && handleToggleMilestone(goal.id, milestone.id)}
                          className={`text-${milestone.completed ? 'green' : 'orange'}-600 hover:text-${milestone.completed ? 'green' : 'orange'}-700`}
                          disabled={!isOwnProfile}
                        >
                          {milestone.completed ? (
                            <CheckCircleIconSolid className="h-5 w-5 text-green-500" />
                          ) : (
                            <CheckCircleIcon className="h-5 w-5 text-orange-500" />
                          )}
                        </button>
                        {isEditing === milestone.id ? (
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => handleUpdateMilestone(goal.id, milestone.id, { title: e.target.value })}
                            onBlur={() => setIsEditing(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(null)}
                            autoFocus
                            className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                          />
                        ) : (
                          <>
                            <span 
                              className={`flex-1 ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                              onClick={() => isOwnProfile && setIsEditing(milestone.id)}
                            >
                              {milestone.title || 'Untitled milestone'}
                            </span>
                            {milestone.completedDate && (
                              <span className="text-xs text-gray-500">
                                {new Date(milestone.completedDate).toLocaleDateString()}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No milestones added yet.</p>
                  )}
                </div>
              </div>

              {/* Recommended Resources */}
              {goal.recommendedResources.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium">Learning Resources</h4>
                  <div className="space-y-2">
                    {goal.recommendedResources.map((resource, index) => (
                      <a
                        key={resource.id || index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center rounded-md bg-gray-50 p-2 text-sm text-blue-600 hover:bg-gray-100"
                      >
                        <span className="mr-2">{resourceTypeIcons[resource.type]}</span>
                        <span className="flex-1">{resource.title}</span>
                        <span className="text-xs text-gray-500">{resource.type}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-700">No Goals Found</h3>
            <p className="text-gray-500">
              {selectedCategory === 'all'
                ? "You haven't created any learning goals yet."
                : `You don't have any goals in the ${selectedCategory} category.`}
            </p>
            {isOwnProfile && (
              <button
                onClick={() => setIsAddingGoal(true)}
                className="mt-4 inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
              >
                <PlusIcon className="mr-1 h-5 w-5" />
                Create Your First Goal
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}