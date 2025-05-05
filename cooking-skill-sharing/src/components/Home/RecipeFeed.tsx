import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

// Mock data - replace with API call
const mockRecipes = [
  {
    id: '1',
    title: 'Homemade Pizza',
    description: 'A delicious homemade pizza with fresh ingredients and a crispy crust.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    author: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    },
    likes: 128,
    comments: 24,
    tags: ['Italian', 'Pizza', 'Main Course'],
  },
  {
    id: '2',
    title: 'Chocolate Chip Cookies',
    description: 'Classic chocolate chip cookies that are crispy on the outside and chewy on the inside.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    author: {
      id: '2',
      name: 'Sarah Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    likes: 95,
    comments: 18,
    tags: ['Dessert', 'Baking', 'Quick Meals'],
  },
  {
    id: '3',
    title: 'Vegetable Stir Fry',
    description: 'A healthy and colorful stir fry with a variety of vegetables and a savory sauce.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    author: {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
    likes: 76,
    comments: 12,
    tags: ['Asian', 'Vegetarian', 'Healthy'],
  },
  {
    id: '4',
    title: 'Beef Tacos',
    description: 'Spicy beef tacos with fresh toppings and homemade salsa.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4e1479b',
    author: {
      id: '4',
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    },
    likes: 112,
    comments: 31,
    tags: ['Mexican', 'Main Course', 'Quick Meals'],
  },
  {
    id: '5',
    title: 'Caesar Salad',
    description: 'Classic Caesar salad with homemade dressing and crispy croutons.',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    author: {
      id: '5',
      name: 'David Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    likes: 64,
    comments: 9,
    tags: ['Salad', 'Healthy', 'Appetizer'],
  },
  {
    id: '6',
    title: 'Chicken Curry',
    description: 'Aromatic chicken curry with coconut milk and Indian spices.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    author: {
      id: '6',
      name: 'Lisa Brown',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
    likes: 143,
    comments: 27,
    tags: ['Indian', 'Main Course', 'Spicy'],
  },
]

type FilterType = 'trending' | 'latest' | 'following'

export default function RecipeFeed() {
  const [recipes, setRecipes] = useState(mockRecipes)
  const [filter, setFilter] = useState<FilterType>('trending')
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  
  // Mock liked recipes - replace with actual user data
  const [likedRecipes, setLikedRecipes] = useState<string[]>(['1', '4'])
  
  const handleLike = (recipeId: string) => {
    setLikedRecipes((prev) => {
      if (prev.includes(recipeId)) {
        return prev.filter((id) => id !== recipeId)
      } else {
        return [...prev, recipeId]
      }
    })
    
    // Update like count in recipes
    setRecipes((prev) =>
      prev.map((recipe) => {
        if (recipe.id === recipeId) {
          return {
            ...recipe,
            likes: likedRecipes.includes(recipeId)
              ? recipe.likes - 1
              : recipe.likes + 1,
          }
        }
        return recipe
      })
    )
  }
  
  const loadMoreRecipes = () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to fetch more recipes
      // For now, we'll just duplicate the existing recipes
      setRecipes((prev) => [...prev, ...mockRecipes])
      setLoading(false)
      
      // For demo purposes, we'll set hasMore to false after loading more recipes twice
      if (recipes.length > mockRecipes.length * 2) {
        setHasMore(false)
      }
    }, 1000)
  }
  
  // Filter recipes based on selected filter
  const filteredRecipes = recipes.filter((recipe) => {
    if (filter === 'trending') {
      return recipe.likes > 100
    } else if (filter === 'latest') {
      // In a real app, this would be based on creation date
      return true
    } else if (filter === 'following') {
      // In a real app, this would be based on followed users
      return ['1', '3', '5'].includes(recipe.author.id)
    }
    return true
  })
  
  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        {(['trending', 'latest', 'following'] as FilterType[]).map((option) => (
          <button
            key={option}
            className={`border-b-2 px-1 py-2 text-sm font-medium capitalize ${
              filter === option
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>
      
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <Link href={`/recipe/${recipe.id}`}>
              <div className="relative h-48 w-full">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="p-4">
              <div className="mb-2 flex items-center">
                <Image
                  src={recipe.author.avatar}
                  alt={recipe.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <Link
                  href={`/profile/${recipe.author.id}`}
                  className="ml-2 text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  {recipe.author.name}
                </Link>
              </div>
              <Link href={`/recipe/${recipe.id}`}>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {recipe.title}
                </h3>
              </Link>
              <p className="mb-3 text-sm text-gray-500 line-clamp-2">
                {recipe.description}
              </p>
              <div className="mb-3 flex flex-wrap gap-1">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleLike(recipe.id)}
                    className="flex items-center text-gray-500 hover:text-red-500"
                  >
                    {likedRecipes.includes(recipe.id) ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                    <span className="ml-1 text-sm">{recipe.likes}</span>
                  </button>
                  <Link
                    href={`/recipe/${recipe.id}#comments`}
                    className="flex items-center text-gray-500 hover:text-blue-500"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span className="ml-1 text-sm">{recipe.comments}</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMoreRecipes}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
} 