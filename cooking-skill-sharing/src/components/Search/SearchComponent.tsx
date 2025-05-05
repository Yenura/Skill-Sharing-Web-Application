import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

// Mock data for search results
const mockRecipes = [
  {
    id: '1',
    title: 'Homemade Pizza Margherita',
    description: 'Classic Italian pizza with tomatoes, mozzarella, and basil',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    author: {
      id: 'user1',
      name: 'Maria Rossi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    likes: 87,
    comments: 24,
    tags: ['Italian', 'Pizza', 'Mediterranean']
  },
  {
    id: '2',
    title: 'Vegetarian Buddha Bowl',
    description: 'Healthy and colorful bowl with quinoa, roasted vegetables, and tahini dressing',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    author: {
      id: 'user2',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    },
    likes: 65,
    comments: 18,
    tags: ['Vegetarian', 'Healthy', 'Quick Meals']
  }
]

const mockCommunities = [
  {
    id: '1',
    name: 'Italian Cooking Enthusiasts',
    description: 'A community for lovers of Italian cuisine',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    memberCount: 1243,
    postCount: 567,
    tags: ['Italian', 'Mediterranean', 'Pasta', 'Pizza']
  },
  {
    id: '2',
    name: 'Vegetarian & Vegan Recipes',
    description: 'A community dedicated to plant-based cooking',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    memberCount: 2156,
    postCount: 876,
    tags: ['Vegetarian', 'Vegan', 'Healthy', 'Plant-Based']
  }
]

const mockUsers = [
  {
    id: 'user1',
    name: 'Maria Rossi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    bio: 'Italian cooking enthusiast and food photographer',
    followers: 1243,
    recipes: 45
  },
  {
    id: 'user2',
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    bio: 'Home chef specializing in vegetarian and vegan cuisine',
    followers: 892,
    recipes: 32
  }
]

// Available tags for filtering
const availableTags = [
  'Italian', 'Asian', 'Vegetarian', 'Vegan', 'Baking', 'BBQ', 
  'Grilling', 'Quick Meals', 'Healthy', 'Mediterranean', 'Fusion',
  'Pasta', 'Pizza', 'Street Food', 'Desserts', 'Bread', 'Pastries',
  'Smoking', 'Outdoor Cooking', 'Weeknight Dinners', 'Time-Saving',
  'Plant-Based', 'Gluten-Free', 'Low-Carb', 'Keto', 'Paleo',
  'Budget-Friendly', 'Family-Friendly', 'Gourmet', 'Traditional',
  'Modern', 'Seasonal', 'Holiday', 'Breakfast', 'Lunch', 'Dinner',
  'Appetizers', 'Soups', 'Salads', 'Main Dishes', 'Side Dishes'
]

type SearchResultType = 'recipes' | 'communities' | 'users'

export default function SearchComponent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<SearchResultType>('recipes')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'relevance' | 'popular' | 'newest'>('relevance')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState({
    recipes: mockRecipes,
    communities: mockCommunities,
    users: mockUsers
  })
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])
  
  // Simulate search with filters
  useEffect(() => {
    if (!searchQuery) {
      setResults({
        recipes: mockRecipes,
        communities: mockCommunities,
        users: mockUsers
      })
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase()
      
      // Filter recipes
      const filteredRecipes = mockRecipes.filter(recipe => {
        const matchesQuery = 
          recipe.title.toLowerCase().includes(query) || 
          recipe.description.toLowerCase().includes(query) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(query))
        
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.some(tag => recipe.tags.includes(tag))
        
        return matchesQuery && matchesTags
      })
      
      // Filter communities
      const filteredCommunities = mockCommunities.filter(community => {
        const matchesQuery = 
          community.name.toLowerCase().includes(query) || 
          community.description.toLowerCase().includes(query) ||
          community.tags.some(tag => tag.toLowerCase().includes(query))
        
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.some(tag => community.tags.includes(tag))
        
        return matchesQuery && matchesTags
      })
      
      // Filter users
      const filteredUsers = mockUsers.filter(user => {
        const matchesQuery = 
          user.name.toLowerCase().includes(query) || 
          user.bio.toLowerCase().includes(query)
        
        return matchesQuery
      })
      
      // Sort results
      const sortResults = <T extends { likes?: number }>(items: T[]) => {
        if (sortBy === 'popular') {
          return [...items].sort((a, b) => (b.likes || 0) - (a.likes || 0))
        }
        return items
      }
      
      setResults({
        recipes: sortResults(filteredRecipes),
        communities: sortResults(filteredCommunities),
        users: filteredUsers
      })
      
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchQuery, selectedTags, sortBy])
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      } else {
        return [...prev, tag]
      }
    })
  }
  
  const clearFilters = () => {
    setSelectedTags([])
    setSortBy('relevance')
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger a search
    // For now, we're using the useEffect to simulate search
  }
  
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, communities, or users..."
            className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
      </form>
      
      {/* Tabs and Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
              activeTab === 'recipes'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Recipes
          </button>
          <button
            onClick={() => setActiveTab('communities')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
              activeTab === 'communities'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Communities
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
              activeTab === 'users'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Users
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              showFilters || selectedTags.length > 0 || sortBy !== 'relevance'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FunnelIcon className="mr-1.5 h-4 w-4" />
            Filters
          </button>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'relevance' | 'popular' | 'newest')}
              className="appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="popular">Sort by: Most Popular</option>
              <option value="newest">Sort by: Newest</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
          >
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Filter by Tags</h3>
                {selectedTags.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Results */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* Recipes Results */}
            {activeTab === 'recipes' && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.recipes.length > 0 ? (
                  results.recipes.map((recipe) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <Link href={`/recipe/${recipe.id}`}>
                        <div className="relative h-40 w-full">
                          <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      
                      <div className="p-4">
                        <Link href={`/recipe/${recipe.id}`}>
                          <h3 className="mb-1 text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {recipe.title}
                          </h3>
                        </Link>
                        
                        <p className="mb-3 text-sm text-gray-500 line-clamp-2">
                          {recipe.description}
                        </p>
                        
                        <div className="mb-4 flex items-center space-x-2">
                          <div className="relative h-6 w-6 overflow-hidden rounded-full">
                            <Image
                              src={recipe.author.avatar}
                              alt={recipe.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Link href={`/profile/${recipe.author.id}`}>
                            <span className="text-sm text-gray-700 hover:text-blue-600">
                              {recipe.author.name}
                            </span>
                          </Link>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {recipe.tags.map(tag => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full rounded-lg bg-white p-8 text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900">No recipes found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Communities Results */}
            {activeTab === 'communities' && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.communities.length > 0 ? (
                  results.communities.map((community) => (
                    <motion.div
                      key={community.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <Link href={`/community/${community.id}`}>
                        <div className="relative h-40 w-full">
                          <Image
                            src={community.image}
                            alt={community.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      
                      <div className="p-4">
                        <Link href={`/community/${community.id}`}>
                          <h3 className="mb-1 text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {community.name}
                          </h3>
                        </Link>
                        
                        <p className="mb-3 text-sm text-gray-500 line-clamp-2">
                          {community.description}
                        </p>
                        
                        <div className="mb-4 flex flex-wrap gap-1">
                          {community.tags.map(tag => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{community.memberCount.toLocaleString()} members</span>
                          <span>{community.postCount.toLocaleString()} posts</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full rounded-lg bg-white p-8 text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900">No communities found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Users Results */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {results.users.length > 0 ? (
                  results.users.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow-sm"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-full">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <Link href={`/profile/${user.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {user.name}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-gray-500">{user.bio}</p>
                        
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{user.followers.toLocaleString()} followers</span>
                          <span>{user.recipes} recipes</span>
                        </div>
                      </div>
                      
                      <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Follow
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 