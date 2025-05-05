import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Clock, Users, Bookmark, Printer, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import { useAuth } from '../Auth/AuthContext'
import { useToast } from '../ui/use-toast'
import { api } from '@/lib/api'

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
  ingredients: {
    id: string
    name: string
    amount: string
    unit: string
  }[]
  instructions: {
    id: string
    step: number
    description: string
    image?: string
  }[]
  tags: string[]
  createdAt: string
}

interface RecipeDetailProps {
  recipeId: string
}

// Format date to a readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

export const RecipeDetail = ({ recipeId }: RecipeDetailProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [servings, setServings] = useState(0)
  const [isIngredientsExpanded, setIsIngredientsExpanded] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const { data, error } = await api.get<Recipe>(`/recipes/${recipeId}`)
        
        if (error) {
          throw new Error(`Failed to fetch recipe: ${error}`)
        }
        
        setRecipe(data)
        setServings(data.servings)

        // Check if user has liked/bookmarked if logged in
        if (user) {
          const [likeResponse, bookmarkResponse] = await Promise.all([
            api.get<{ liked: boolean }>(`/recipes/${recipeId}/like/status?userId=${user.id}`),
            api.get<{ bookmarked: boolean }>(`/recipes/${recipeId}/bookmark/status?userId=${user.id}`)
          ])
          
          setIsLiked(likeResponse.data?.liked || false)
          setIsBookmarked(bookmarkResponse.data?.bookmarked || false)
        }
      } catch (error) {
        console.error('Failed to fetch recipe:', error)
        setError('Failed to load recipe. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipe()
  }, [recipeId, user])

  const handleAuthAction = (action: () => Promise<void>, errorMessage: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to perform this action.',
        variant: 'destructive',
      })
      return
    }

    return action().catch((error) => {
      console.error(error)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    })
  }

  const handleLike = () => {
    return handleAuthAction(async () => {
      const { error } = await api[isLiked ? 'delete' : 'post'](`/recipes/${recipeId}/like`, { 
        userId: user?.id 
      })
      
      if (error) {
        throw new Error('Failed to update like status')
      }
      
      setIsLiked(!isLiked)
      if (recipe) {
        setRecipe({
          ...recipe,
          likes: isLiked ? recipe.likes - 1 : recipe.likes + 1,
        })
      }
    }, 'Failed to update like status')
  }

  const handleBookmark = () => {
    return handleAuthAction(async () => {
      const { error } = await api[isBookmarked ? 'delete' : 'post'](`/recipes/${recipeId}/bookmark`, {
        userId: user?.id
      })
      
      if (error) {
        throw new Error('Failed to update bookmark status')
      }
      
      setIsBookmarked(!isBookmarked)
      toast({
        title: isBookmarked ? 'Recipe removed from bookmarks' : 'Recipe bookmarked',
        variant: 'default',
      })
    }, 'Failed to update bookmark status')
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: recipe?.title,
        text: recipe?.description,
        url: window.location.href,
      })
    } catch (error) {
      console.error('Failed to share recipe:', error)
    }
  }

  const handlePrint = async () => {
    try {
      await api.post('/recipes/print', {
        recipeId,
      })
    } catch (error) {
      console.error('Failed to print recipe:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-600" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{error}</h1>
          <button 
            onClick={() => window.location.reload()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return null
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Recipe Header */}
      <div className="relative h-64 overflow-hidden rounded-xl mb-8">
        <Image
          src={recipe.thumbnail}
          alt={recipe.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-200 mb-4">{recipe.description}</p>
          
          <div className="flex items-center space-x-4">
            <Link
              href={`/profile/${recipe.author.id}`}
              className="flex items-center space-x-2"
            >
              <div className="relative h-8 w-8">
                <Image
                  src={recipe.author.profilePicture}
                  alt={recipe.author.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="font-medium">{recipe.author.name}</span>
            </Link>
            <span className="text-gray-300">•</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(recipe.createdAt)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{recipe.cookingTime} minutes</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>{recipe.servings} servings</span>
              </div>
              <span className="text-gray-600 capitalize">{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{recipe.likes}</span>
          </button>
          <Link
            href={`#comments`}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{recipe.comments}</span>
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleBookmark}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>Save</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Printer className="h-5 w-5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Ingredients</h2>
              <button
                onClick={() => setIsIngredientsExpanded(!isIngredientsExpanded)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isIngredientsExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>

            {isIngredientsExpanded && (
              <>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                    disabled={servings <= 1}
                  >
                    -
                  </button>
                  <span className="font-medium">{servings} servings</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-2"
                      />
                      <span>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Instructions</h2>
            
            <ol className="space-y-6">
              {recipe.instructions.map((instruction) => (
                <li key={instruction.id} className="flex">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold mr-4">
                    {instruction.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{instruction.description}</p>
                    {instruction.image && (
                      <div className="mt-4 relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={instruction.image}
                          alt={`Step ${instruction.step}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-8">
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
