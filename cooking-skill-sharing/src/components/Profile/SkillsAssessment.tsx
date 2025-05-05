import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  StarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BeakerIcon,
  ClockIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { api } from '@/lib/api'
import { useAuth } from '../Auth/AuthContext'

// Types for skills assessment
interface ProgressItem {
  date: string;
  note: string;
  type: 'achievement' | 'progress' | 'learning';
}

interface Skill {
  id: string;
  name: string;
  level: number;
  endorsements: number;
  hoursPracticed: number;
  recentProgress: ProgressItem[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  skillId: string;
  reward: string;
  deadline: string;
  progress: number;
}

interface RecommendedRecipe {
  id: string;
  title: string;
  skills: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  time: string;
}

interface SkillAssessmentResult {
  skillId: string;
  currentLevel: number;
  suggestedLevel: number;
  feedback: string;
  recommendedPractice: string[];
}

export default function SkillsAssessment({ userId }: { userId?: string }) {
  const { user } = useAuth()
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [skills, setSkills] = useState<Record<string, Skill>>({})
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [recommendedRecipes, setRecommendedRecipes] = useState<RecommendedRecipe[]>([])
  const [assessmentResults, setAssessmentResults] = useState<Record<string, SkillAssessmentResult>>({}) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch skills data when component mounts
  useEffect(() => {
    fetchSkillsData()
  }, [userId])

  // Fetch challenges and recommended recipes when skills are loaded
  useEffect(() => {
    if (Object.keys(skills).length > 0) {
      fetchChallenges()
      fetchRecommendedRecipes()
      fetchAssessmentResults()

      // Set the first skill as selected by default
      if (!selectedSkill && Object.keys(skills).length > 0) {
        setSelectedSkill(Object.keys(skills)[0])
      }
    }
  }, [skills])

  const fetchSkillsData = async () => {
    setLoading(true)
    try {
      const { data, error } = await api.get<Skill[]>(`/users/${userId || 'me'}/skills`)

      if (error) {
        throw new Error(`Failed to fetch skills: ${error}`)
      }

      // Convert array to object with id as key
      const skillsObject = (data || []).reduce((acc, skill) => {
        acc[skill.id] = skill
        return acc
      }, {} as Record<string, Skill>)

      setSkills(skillsObject)
    } catch (error) {
      console.error('Failed to fetch skills data:', error)
      setError('Failed to load skills data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchChallenges = async () => {
    try {
      const { data, error } = await api.get<Challenge[]>(`/users/${userId || 'me'}/challenges`)

      if (error) {
        throw new Error(`Failed to fetch challenges: ${error}`)
      }

      setChallenges(data || [])
    } catch (error) {
      console.error('Failed to fetch challenges:', error)
    }
  }

  const fetchRecommendedRecipes = async () => {
    try {
      const { data, error } = await api.get<RecommendedRecipe[]>(`/users/${userId || 'me'}/recommended-recipes`)

      if (error) {
        throw new Error(`Failed to fetch recommended recipes: ${error}`)
      }

      setRecommendedRecipes(data || [])
    } catch (error) {
      console.error('Failed to fetch recommended recipes:', error)
    }
  }

  const fetchAssessmentResults = async () => {
    try {
      const { data, error } = await api.get<SkillAssessmentResult[]>(`/users/${userId || 'me'}/skill-assessments`)

      if (error) {
        throw new Error(`Failed to fetch assessment results: ${error}`)
      }

      // Convert array to object with skillId as key
      const resultsObject = (data || []).reduce((acc, result) => {
        acc[result.skillId] = result
        return acc
      }, {} as Record<string, SkillAssessmentResult>)

      setAssessmentResults(resultsObject)
    } catch (error) {
      console.error('Failed to fetch assessment results:', error)
    }
  }

  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400">
            {star <= level ? (
              <StarIconSolid className="h-5 w-5" />
            ) : (
              <StarIcon className="h-5 w-5" />
            )}
          </span>
        ))}
      </div>
    )
  }

  const renderProgressTimeline = (progress: any[]) => {
    return (
      <div className="space-y-2">
        {progress.map((item, index) => (
          <div
            key={index}
            className="flex items-start space-x-2 rounded-md bg-gray-50 p-2"
          >
            <div className="mt-1">
              {item.type === 'achievement' ? (
                <TrophyIcon className="h-4 w-4 text-yellow-500" />
              ) : item.type === 'progress' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <AcademicCapIcon className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">{item.note}</p>
              <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Skills Assessment</h2>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Update Skills
        </button>
      </div>

      {/* Skills Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(skills).map(([key, skill]) => (
          <motion.div
            key={key}
            className={`cursor-pointer rounded-lg border p-4 ${selectedSkill === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
            onClick={() => setSelectedSkill(key)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-medium">{skill.name}</h3>
              <div className="mt-1">{renderSkillLevel(skill.level)}</div>
              {assessmentResults[key] && (
                <div className="mt-2 rounded-md bg-blue-50 p-2 text-sm">
                  <p className="font-medium text-blue-700">Assessment: {assessmentResults[key].feedback}</p>
                  {assessmentResults[key].currentLevel !== assessmentResults[key].suggestedLevel && (
                    <p className="text-blue-600">Suggested level: {renderSkillLevel(assessmentResults[key].suggestedLevel)}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="rounded-md bg-gray-50 p-2 text-center">
                <UserGroupIcon className="mx-auto h-5 w-5 text-gray-500" />
                <div className="mt-1 text-sm font-medium">{skill.endorsements}</div>
                <div className="text-xs text-gray-500">Endorsements</div>
              </div>
              <div className="rounded-md bg-gray-50 p-2 text-center">
                <ClockIcon className="mx-auto h-5 w-5 text-gray-500" />
                <div className="mt-1 text-sm font-medium">{skill.hoursPracticed}h</div>
                <div className="text-xs text-gray-500">Practice Time</div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">Recent Progress</h4>
              {renderProgressTimeline(skill.recentProgress)}
            </div>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800">
          {error}
          <button 
            onClick={fetchSkillsData}
            className="mt-2 rounded bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          {/* Active Challenges */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">Active Challenges</h3>
            <div className="space-y-4">
              {challenges.length > 0 ? challenges.map(challenge => (
                <div
                  key={challenge.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      {challenge.reward}
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">{challenge.description}</p>
                  <div className="mb-2">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-500">{challenge.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                  </div>
                </div>
              )) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                  <p className="text-gray-500">No active challenges at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Recipes */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">Recommended Recipes</h3>
            {recommendedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedRecipes.map(recipe => (
                  <div
                    key={recipe.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <h4 className="mb-2 font-medium">{recipe.title}</h4>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {recipe.skills.map(skillId => (
                        <span
                          key={skillId}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                        >
                          {skills[skillId]?.name || 'Unknown Skill'}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Difficulty: {recipe.difficulty}</span>
                      <span>{recipe.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-gray-500">No recommended recipes at the moment.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}