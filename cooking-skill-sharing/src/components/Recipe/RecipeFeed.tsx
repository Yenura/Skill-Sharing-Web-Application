'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { RecipeCard } from './RecipeCard'

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

export function RecipeFeed() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const { data, error } = await api.get<Recipe[]>(`/recipes?page=${page}&limit=10`)

      if (error) {
        throw new Error(error)
      }

      if (data) {
        if (data.length < 10) {
          setHasMore(false)
        }
        setRecipes(prev => (page === 1 ? data : [...prev, ...data]))
      }
    } catch (err) {
      setError('Failed to load recipes')
      console.error('Error fetching recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [page])

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => {
            setError(null)
            setPage(1)
            fetchRecipes()
          }}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center py-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Load More
          </button>
        </div>
      )}

      {!loading && !hasMore && recipes.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No more recipes to load
        </div>
      )}

      {!loading && recipes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No recipes found</p>
        </div>
      )}
    </div>
  )
}
