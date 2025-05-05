import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { useAuth } from '../Auth/AuthContext'
import { PlusCircle, Filter, Calendar, Award, Users, ChefHat, X, Check } from 'lucide-react'
import { format } from 'date-fns'

// Types
interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  type: 'milestone' | 'achievement' | 'social';
}

interface SkillProgress {
  date: string;
  level: number;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  progress: SkillProgress[];
}

interface TimelineFilters {
  dateRange: 'all' | 'month' | 'year';
  categories: string[];
  importance: string[];
}

// Icon mapping for achievement types
const achievementIcons: Record<string, string> = {
  'milestone': '🎉',
  'achievement': '👨‍🍳',
  'social': '🤝',
  'technique': '🔪',
  'recipe': '📝',
  'cuisine': '🌍',
  'challenge': '🏆'
}

const milestoneCategories = [
  { id: 'technique', label: 'Technique Mastery' },
  { id: 'recipe', label: 'Recipe Creation' },
  { id: 'cuisine', label: 'Cuisine Exploration' },
  { id: 'social', label: 'Community Engagement' },
  { id: 'challenge', label: 'Challenge Completion' },
]

const importanceLevels = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

export default function LearningTimeline({ userId }: { userId?: string }) {
  const { user } = useAuth();
  const isOwnProfile = !userId || (user && user.id === userId);
  
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New milestone form
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'technique',
    importance: 'medium',
  });
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TimelineFilters>({
    dateRange: 'all',
    categories: [],
    importance: [],
  });
  
  // Success message
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTimelineData();
  }, [userId]);
  
  useEffect(() => {
    if (skills.length > 0) {
      setSelectedSkill(skills[0]);
    }
  }, [skills]);
  
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchTimelineData = async () => {
    setLoading(true);
    try {
      // Fetch achievements and skills from API
      const [achievementsResponse, skillsResponse] = await Promise.all([
        api.get<Achievement[]>(`/users/${userId || 'me'}/achievements`),
        api.get<Skill[]>(`/users/${userId || 'me'}/skills`)
      ]);
      
      if (achievementsResponse.error) {
        throw new Error(`Failed to fetch achievements: ${achievementsResponse.error}`);
      }
      
      if (skillsResponse.error) {
        throw new Error(`Failed to fetch skills: ${skillsResponse.error}`);
      }
      
      // Map achievements to ensure they have icons
      const achievementsWithIcons = (achievementsResponse.data || []).map(achievement => ({
        ...achievement,
        icon: achievement.icon || achievementIcons[achievement.type] || '🏅'
      }));
      
      setAchievements(achievementsWithIcons);
      setSkills(skillsResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch timeline data:', error);
      setError('Failed to load timeline data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim() || !newMilestone.description.trim()) {
      return;
    }

    try {
      const { data, error } = await api.post<Achievement>(`/users/${userId || 'me'}/achievements`, {
        title: newMilestone.title,
        description: newMilestone.description,
        date: newMilestone.date,
        type: 'milestone',
        category: newMilestone.category,
        importance: newMilestone.importance
      });
      
      if (error) {
        throw new Error(`Failed to add milestone: ${error}`);
      }
      
      if (data) {
        // Add icon to the new milestone
        const milestoneWithIcon = {
          ...data,
          icon: data.icon || achievementIcons[data.type] || '🏅'
        };
        
        setAchievements([milestoneWithIcon, ...achievements]);
        setNewMilestone({
          title: '',
          description: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          category: 'technique',
          importance: 'medium',
        });
        setShowMilestoneForm(false);
        setSuccessMessage('Milestone added successfully!');
      }
    } catch (error) {
      console.error('Failed to add milestone:', error);
      setError('Failed to add milestone. Please try again.');
    }
  };
  
  const handleFilterChange = (key: keyof TimelineFilters, value: any) => {
    setFilters(prev => {
      if (key === 'dateRange') {
        return { ...prev, [key]: value };
      }
      
      // For array values (categories, importance)
      const currentValues = prev[key] as string[];
      if (currentValues.includes(value)) {
        return { ...prev, [key]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...currentValues, value] };
      }
    });
  };
  
  const getFilteredAchievements = () => {
    return achievements.filter(achievement => {
      // Date range filter
      if (filters.dateRange !== 'all') {
        const achievementDate = new Date(achievement.date);
        const now = new Date();
        
        if (filters.dateRange === 'month') {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          if (achievementDate < oneMonthAgo) return false;
        } else if (filters.dateRange === 'year') {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          if (achievementDate < oneYearAgo) return false;
        }
      }
      
      // If no category filters are selected, show all
      if (filters.categories.length > 0) {
        // This is a simplified example - in a real app, achievements would have a category field
        if (achievement.type === 'milestone' && !filters.categories.includes('technique')) return false;
        if (achievement.type === 'achievement' && !filters.categories.includes('recipe')) return false;
        if (achievement.type === 'social' && !filters.categories.includes('social')) return false;
      }
      
      return true;
    });
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Learning Journey</h2>
        <div className="flex space-x-2">
          {isOwnProfile && (
            <button
              onClick={() => setShowMilestoneForm(!showMilestoneForm)}
              className="flex items-center text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              {showMilestoneForm ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Milestone
                </>
              )}
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </button>
        </div>
      </div>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
          <Check className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}
      
      {showMilestoneForm && (
        <div className="mb-6 p-4 border border-orange-200 rounded-lg bg-orange-50">
          <h3 className="text-lg font-medium mb-4">Add New Milestone</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="What did you achieve?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
                placeholder="Describe your achievement..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newMilestone.date}
                  onChange={(e) => setNewMilestone({...newMilestone, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newMilestone.category}
                  onChange={(e) => setNewMilestone({...newMilestone, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {milestoneCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Importance
                </label>
                <select
                  value={newMilestone.importance}
                  onChange={(e) => setNewMilestone({...newMilestone, importance: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {importanceLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddMilestone}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Add Milestone
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showFilters && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Filter Timeline</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="flex space-x-4">
                {[
                  { id: 'all', label: 'All Time' },
                  { id: 'year', label: 'Past Year' },
                  { id: 'month', label: 'Past Month' },
                ].map(range => (
                  <label key={range.id} className="flex items-center">
                    <input
                      type="radio"
                      name="dateRange"
                      checked={filters.dateRange === range.id}
                      onChange={() => handleFilterChange('dateRange', range.id)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {milestoneCategories.map(category => (
                  <label
                    key={category.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      filters.categories.includes(category.id)
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={() => handleFilterChange('categories', category.id)}
                      className="sr-only"
                    />
                    <span>{category.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills Progress */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium">Skills Progress</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => setSelectedSkill(skill)}
              className={`rounded-lg p-4 text-left transition-colors ${
                selectedSkill?.id === skill.id
                  ? 'bg-orange-50 ring-2 ring-orange-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <h4 className="font-medium">{skill.name}</h4>
              <div className="mt-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    className="h-full bg-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-600">{skill.level}%</p>
              </div>
            </button>
          ))}
        </div>

        {/* Skill Progress Timeline */}
        {selectedSkill && (
          <div className="mt-6">
            <h4 className="mb-4 font-medium">{selectedSkill.name} Progress</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
              {selectedSkill.progress.map((point, index) => (
                <div
                  key={index}
                  className="relative mb-6 flex items-start pl-10 last:mb-0"
                >
                  <div className="absolute left-2 top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-orange-500" />
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(point.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Level: {point.level}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div>
        <h3 className="mb-4 text-lg font-medium">Milestones & Achievements</h3>
        <div className="space-y-4">
          {getFilteredAchievements().length > 0 ? (
            getFilteredAchievements().map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 rounded-lg bg-gray-50 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      achievement.type === 'milestone' 
                        ? 'bg-blue-100 text-blue-800' 
                        : achievement.type === 'achievement'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                    }`}>
                      {achievement.type === 'milestone' && <ChefHat className="mr-1 h-3 w-3" />}
                      {achievement.type === 'achievement' && <Award className="mr-1 h-3 w-3" />}
                      {achievement.type === 'social' && <Users className="mr-1 h-3 w-3" />}
                      {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No milestones or achievements match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}