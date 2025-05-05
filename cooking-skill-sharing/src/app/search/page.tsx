'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/Navigation/Navbar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RecipeCard } from '@/components/Recipe/RecipeCard'
import { api } from '@/lib/api'
import { Search, Filter, X } from 'lucide-react'

interface Recipe {
  id: string
  title: string
  description: string
  thumbnail: string
  author: {
    id: string
    name: string
    profilePicture: string
  }
  likes: number
  comments: number
  cookingTime: number
  servings: number
  difficulty: string
  tags: string[]
  createdAt: string
}

interface SearchFilters {
  difficulty?: string
  cookingTime?: string
  tags?: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})

  const difficulties = ['easy', 'medium', 'hard']
  const cookingTimes = ['under15', 'under30', 'under60', 'over60']
  const popularTags = ['vegetarian', 'vegan', 'gluten-free', 'dessert', 'breakfast', 'dinner']

  const formatCookingTime = (time: string) => {
    switch (time) {
      case 'under15':
        return 'Under 15 minutes'
      case 'under30':
        return 'Under 30 minutes'
      case 'under60':
        return 'Under 1 hour'
      case 'over60':
        return 'Over 1 hour'
      default:
        return time
    }
  }

  // Perform search with current query and filters
  const performSearch = async () => {
    if (!searchQuery.trim() && Object.keys(filters).length === 0) {
      setRecipes([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      if (searchQuery.trim()) {
        queryParams.append('q', searchQuery.trim())
      }
      if (filters.difficulty) {
        queryParams.append('difficulty', filters.difficulty)
      }
      if (filters.cookingTime) {
        queryParams.append('cookingTime', filters.cookingTime)
      }
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => queryParams.append('tags', tag))
      }

      const { data, error } = await api.get<Recipe[]>(`/search?${queryParams.toString()}`)

      if (error) {
        throw new Error(`Search failed: ${error}`)
      }

      setRecipes(data || [])
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to perform search. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      performSearch()
    }
  }, []) // Only run on initial load

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => {
      // Handle tags separately as they're an array
      if (filterType === 'tags') {
        const currentTags = prev.tags || []
        const updatedTags = currentTags.includes(value)
          ? currentTags.filter(tag => tag !== value) // Remove if already selected
          : [...currentTags, value] // Add if not selected

        return { ...prev, tags: updatedTags }
      }
      
      // For other filters, simply toggle the value
      const newValue = prev[filterType] === value ? undefined : value
      return { ...prev, [filterType]: newValue }
    })
  }

  const clearFilters = () => {
    setFilters({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Recipes</h1>
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for recipes, ingredients, or cuisines..."
                className="pr-10 pl-12 py-3 w-full"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Button type="submit" className="ml-4">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="ml-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-1" />
              Filters
            </Button>
          </form>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Filters</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Difficulty filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(difficulty => (
                    <button
                      key={difficulty}
                      type="button"
                      onClick={() => handleFilterChange('difficulty', difficulty)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.difficulty === difficulty
                          ? 'bg-orange-100 border-orange-300 text-orange-800'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cooking time filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Cooking Time</h3>
                <div className="flex flex-wrap gap-2">
                  {cookingTimes.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleFilterChange('cookingTime', time)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.cookingTime === time
                          ? 'bg-orange-100 border-orange-300 text-orange-800'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formatCookingTime(time)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleFilterChange('tags', tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.tags?.includes(tag)
                          ? 'bg-orange-100 border-orange-300 text-orange-800'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={performSearch}>Apply Filters</Button>
            </div>
          </div>
        )}

        {/* Search results */}
        <div>
          {error && (
            <div className="p-4 mb-6 bg-red-50 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
          ) : recipes.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {recipes.length} Results for "{searchQuery}"
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
