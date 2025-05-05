import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChefHat, Clock, ThumbsUp, Filter, Search } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Recipe {
  id: string
  title: string
  description: string
  imageUrl: string
  authorName: string
  authorId: string
  difficulty: string
  prepTime: number
  cookTime: number
  likes: number
  createdAt: string
}

interface GroupRecipesProps {
  groupId: string
  isMember: boolean
}

export default function GroupRecipes({ groupId, isMember }: GroupRecipesProps) {
  const { toast } = useToast()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null)
  
  useEffect(() => {
    fetchGroupRecipes()
  }, [groupId])
  
  const fetchGroupRecipes = async () => {
    setLoading(true)
    try {
      // In a real implementation, fetch from API
      // const response = await fetch(`/api/groups/${groupId}/recipes`)
      // const data = await response.json()
      // setRecipes(data)
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay
      
      // Mock recipe data
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          title: 'Classic Sourdough Bread',
          description: 'A traditional sourdough recipe with a crispy crust and chewy interior.',
          imageUrl: 'https://images.unsplash.com/photo-1585478259715-4ddc6572944d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          authorName: 'johndoe',
          authorId: '1',
          difficulty: 'intermediate',
          prepTime: 120,
          cookTime: 45,
          likes: 128,
          createdAt: '2023-04-15T10:30:00'
        },
        {
          id: '2',
          title: 'Rustic Country Loaf',
          description: 'A hearty country-style bread with a blend of whole wheat and white flour.',
          imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          authorName: 'janedoe',
          authorId: '2',
          difficulty: 'beginner',
          prepTime: 90,
          cookTime: 40,
          likes: 95,
          createdAt: '2023-04-18T14:45:00'
        },
        {
          id: '3',
          title: 'Artisan Sourdough Focaccia',
          description: 'Fluffy, olive oil-rich focaccia with rosemary and sea salt.',
          imageUrl: 'https://images.unsplash.com/photo-1586444248879-bc604bc77f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          authorName: 'bobsmith',
          authorId: '3',
          difficulty: 'advanced',
          prepTime: 150,
          cookTime: 30,
          likes: 210,
          createdAt: '2023-04-20T09:15:00'
        }
      ]
      
      setRecipes(mockRecipes)
    } catch (err) {
      console.error('Error fetching group recipes:', err)
      toast({
        title: "Error",
        description: "Failed to load recipes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleLikeRecipe = async (recipeId: string) => {
    try {
      // In a real implementation, call API
      // await fetch(`/api/recipes/${recipeId}/like`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // })
      
      // Mock implementation
      setRecipes(recipes.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, likes: recipe.likes + 1 } 
          : recipe
      ))
    } catch (err) {
      console.error('Error liking recipe:', err)
      toast({
        title: "Error",
        description: "Failed to like recipe. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const filteredRecipes = recipes
    .filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(recipe => 
      filterDifficulty ? recipe.difficulty === filterDifficulty : true
    )
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`
  }
  
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
        <span className="ml-2 text-lg text-gray-600">Loading recipes...</span>
      </div>
    )
  }
  
  return (
    <div>
      {isMember ? (
        <div className="mb-6 flex justify-between">
          <Link
            href={`/recipes/create?groupId=${groupId}`}
            className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <ChefHat className="mr-2 h-5 w-5" />
            Share a Recipe
          </Link>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            
            <div className="relative">
              <select
                value={filterDifficulty || ''}
                onChange={(e) => setFilterDifficulty(e.target.value || null)}
                className="rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-lg bg-orange-50 p-4">
          <p className="text-orange-800">
            Join this group to share your own recipes and interact with other members!
          </p>
        </div>
      )}
      
      {filteredRecipes.length === 0 ? (
        <div className="mt-8 text-center">
          <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No recipes found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery || filterDifficulty
              ? 'Try adjusting your search or filters'
              : 'Be the first to share a recipe with this group!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <Link href={`/recipes/${recipe.id}`}>
                <div className="relative h-48 w-full">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              
              <div className="p-4">
                <Link href={`/recipes/${recipe.id}`}>
                  <h3 className="text-lg font-medium text-gray-900 hover:text-orange-600">{recipe.title}</h3>
                </Link>
                
                <p className="mt-1 text-sm text-gray-500">
                  By <Link href={`/profile/${recipe.authorId}`} className="text-orange-600 hover:underline">{recipe.authorName}</Link>
                </p>
                
                <p className="mt-2 line-clamp-2 text-sm text-gray-700">{recipe.description}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{formatTime(recipe.prepTime + recipe.cookTime)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <ChefHat className="mr-1 h-4 w-4" />
                      <span className="capitalize">{recipe.difficulty}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleLikeRecipe(recipe.id)
                    }}
                    className="flex items-center text-xs text-gray-500 hover:text-orange-600"
                  >
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    <span>{recipe.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
