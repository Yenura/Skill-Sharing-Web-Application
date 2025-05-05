import { useState } from 'react'
import RecipeCard from '@/components/Recipe/RecipeCard'

// This would typically come from an API based on filters
const mockRecipes = [
  {
    id: 1,
    title: 'Homemade Pizza',
    description: 'A delicious crispy crust pizza with fresh toppings',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    author: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    },
    likes: 120,
    comments: 15,
    tags: ['Italian', 'Baking'],
  },
  {
    id: 2,
    title: 'Thai Green Curry',
    description: 'Authentic Thai green curry with coconut milk and vegetables',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
    author: {
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    likes: 89,
    comments: 12,
    tags: ['Thai', 'Curry'],
  },
  {
    id: 3,
    title: 'Vegetarian Buddha Bowl',
    description: 'Healthy and colorful bowl packed with nutrients',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    author: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
    likes: 156,
    comments: 23,
    tags: ['Vegetarian', 'Healthy'],
  },
]

interface SearchResultsProps {
  filters: {
    cookingMethod: string
    difficulty: string
    cuisineType: string
    prepTime: string
    dietaryRestrictions: string[]
  }
}

export default function SearchResults({ filters }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')

  // This would typically filter the results based on the filters prop
  const filteredRecipes = mockRecipes

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {filteredRecipes.length} Recipes Found
        </h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recipes found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters to find more recipes
          </p>
        </div>
      )}
    </div>
  )
} 