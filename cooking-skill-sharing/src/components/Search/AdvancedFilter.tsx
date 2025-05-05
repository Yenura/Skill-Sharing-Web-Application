import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  FunnelIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon,
  FireIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

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

// Common ingredients for filtering
const commonIngredients = [
  'Chicken', 'Beef', 'Pork', 'Fish', 'Shrimp', 'Eggs', 'Milk', 'Butter',
  'Olive Oil', 'Garlic', 'Onion', 'Tomato', 'Potato', 'Rice', 'Pasta',
  'Flour', 'Sugar', 'Salt', 'Pepper', 'Basil', 'Oregano', 'Thyme',
  'Cumin', 'Paprika', 'Chili', 'Lemon', 'Lime', 'Avocado', 'Spinach',
  'Kale', 'Broccoli', 'Carrot', 'Bell Pepper', 'Mushroom', 'Cheese',
  'Yogurt', 'Sour Cream', 'Mayonnaise', 'Soy Sauce', 'Vinegar', 'Wine',
  'Beer', 'Coconut Milk', 'Almond Milk', 'Tofu', 'Tempeh', 'Seitan',
  'Quinoa', 'Lentils', 'Chickpeas', 'Black Beans', 'Corn', 'Peas'
]

// Dietary restrictions
const dietaryRestrictions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free',
  'Low-Carb', 'Keto', 'Paleo', 'Whole30', 'Low-Fat', 'Low-Sodium',
  'Low-Sugar', 'Low-Calorie', 'High-Protein', 'High-Fiber'
]

// Cooking methods
const cookingMethods = [
  'Baking', 'Grilling', 'Roasting', 'Frying', 'Sautéing', 'Boiling',
  'Steaming', 'Slow Cooking', 'Pressure Cooking', 'Smoking', 'Air Frying',
  'Deep Frying', 'Stir-Frying', 'Braising', 'Poaching', 'Blanching',
  'Marinating', 'Fermenting', 'Pickling', 'Curing', 'Smoking'
]

// Cuisine types
const cuisineTypes = [
  'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai',
  'Mediterranean', 'Middle Eastern', 'French', 'American', 'Spanish',
  'Greek', 'Vietnamese', 'Korean', 'Brazilian', 'Caribbean', 'African',
  'Russian', 'German', 'British', 'Scandinavian', 'Fusion'
]

export interface FilterOptions {
  tags: string[]
  ingredients: string[]
  dietaryRestrictions: string[]
  cookingMethods: string[]
  cuisineTypes: string[]
  cookingTime: {
    min: number
    max: number
  }
  difficulty: 'easy' | 'medium' | 'hard' | 'all'
  servings: {
    min: number
    max: number
  }
  rating: number
  calories: {
    min: number
    max: number
  }
}

interface AdvancedFilterProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
  initialFilters?: FilterOptions
}

export default function AdvancedFilter({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  initialFilters 
}: AdvancedFilterProps) {
  const [activeTab, setActiveTab] = useState<'tags' | 'ingredients' | 'dietary' | 'methods' | 'cuisine' | 'time' | 'other'>('tags')
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {
    tags: [],
    ingredients: [],
    dietaryRestrictions: [],
    cookingMethods: [],
    cuisineTypes: [],
    cookingTime: {
      min: 0,
      max: 180
    },
    difficulty: 'all',
    servings: {
      min: 1,
      max: 12
    },
    rating: 0,
    calories: {
      min: 0,
      max: 2000
    }
  })
  
  // Reset filters when modal is opened with new initial filters
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
    }
  }, [initialFilters])
  
  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }
  
  const toggleIngredient = (ingredient: string) => {
    setFilters(prev => ({
      ...prev,
      ingredients: prev.ingredients.includes(ingredient)
        ? prev.ingredients.filter(i => i !== ingredient)
        : [...prev.ingredients, ingredient]
    }))
  }
  
  const toggleDietaryRestriction = (restriction: string) => {
    setFilters(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }))
  }
  
  const toggleCookingMethod = (method: string) => {
    setFilters(prev => ({
      ...prev,
      cookingMethods: prev.cookingMethods.includes(method)
        ? prev.cookingMethods.filter(m => m !== method)
        : [...prev.cookingMethods, method]
    }))
  }
  
  const toggleCuisineType = (cuisine: string) => {
    setFilters(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine]
    }))
  }
  
  const updateCookingTime = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      cookingTime: {
        ...prev.cookingTime,
        [type]: value
      }
    }))
  }
  
  const updateDifficulty = (difficulty: 'easy' | 'medium' | 'hard' | 'all') => {
    setFilters(prev => ({
      ...prev,
      difficulty
    }))
  }
  
  const updateServings = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      servings: {
        ...prev.servings,
        [type]: value
      }
    }))
  }
  
  const updateRating = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating
    }))
  }
  
  const updateCalories = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        [type]: value
      }
    }))
  }
  
  const resetFilters = () => {
    setFilters({
      tags: [],
      ingredients: [],
      dietaryRestrictions: [],
      cookingMethods: [],
      cuisineTypes: [],
      cookingTime: {
        min: 0,
        max: 180
      },
      difficulty: 'all',
      servings: {
        min: 1,
        max: 12
      },
      rating: 0,
      calories: {
        min: 0,
        max: 2000
      }
    })
  }
  
  const handleApplyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }
  
  const getActiveFiltersCount = () => {
    let count = 0
    
    if (filters.tags.length > 0) count += filters.tags.length
    if (filters.ingredients.length > 0) count += filters.ingredients.length
    if (filters.dietaryRestrictions.length > 0) count += filters.dietaryRestrictions.length
    if (filters.cookingMethods.length > 0) count += filters.cookingMethods.length
    if (filters.cuisineTypes.length > 0) count += filters.cuisineTypes.length
    if (filters.difficulty !== 'all') count += 1
    if (filters.rating > 0) count += 1
    if (filters.cookingTime.min > 0 || filters.cookingTime.max < 180) count += 1
    if (filters.servings.min > 1 || filters.servings.max < 12) count += 1
    if (filters.calories.min > 0 || filters.calories.max < 2000) count += 1
    
    return count
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center">
                <FunnelIcon className="mr-2 h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-medium">Advanced Filters</h2>
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {getActiveFiltersCount()} active
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('tags')}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === 'tags'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Tags
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === 'ingredients'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Ingredients
                </button>
                <button
                  onClick={() => setActiveTab('dietary')}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === 'dietary'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dietary
                </button>
                <button
                  onClick={() => setActiveTab('methods')}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === 'methods'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Methods
                </button>
                <button
                  onClick={() => setActiveTab('cuisine')}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === 'cuisine'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Cuisine
                </button>
                <button
                  onClick={() => setActiveTab('time')}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === 'time'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Time & Difficulty
                </button>
                <button
                  onClick={() => setActiveTab('other')}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
                    activeTab === 'other'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Other
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {/* Tags Tab */}
              {activeTab === 'tags' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Select tags to filter recipes by category, cuisine, or cooking style.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          filters.tags.includes(tag)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                        {filters.tags.includes(tag) && (
                          <CheckIcon className="ml-1 h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Ingredients Tab */}
              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Select ingredients to find recipes that include or exclude specific ingredients.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {commonIngredients.map(ingredient => (
                      <button
                        key={ingredient}
                        onClick={() => toggleIngredient(ingredient)}
                        className={`flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          filters.ingredients.includes(ingredient)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {ingredient}
                        {filters.ingredients.includes(ingredient) && (
                          <CheckIcon className="ml-1 h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Dietary Tab */}
              {activeTab === 'dietary' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Select dietary restrictions to find recipes that meet specific dietary needs.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dietaryRestrictions.map(restriction => (
                      <button
                        key={restriction}
                        onClick={() => toggleDietaryRestriction(restriction)}
                        className={`flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          filters.dietaryRestrictions.includes(restriction)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {restriction}
                        {filters.dietaryRestrictions.includes(restriction) && (
                          <CheckIcon className="ml-1 h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Methods Tab */}
              {activeTab === 'methods' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Select cooking methods to find recipes that use specific techniques.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cookingMethods.map(method => (
                      <button
                        key={method}
                        onClick={() => toggleCookingMethod(method)}
                        className={`flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          filters.cookingMethods.includes(method)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {method}
                        {filters.cookingMethods.includes(method) && (
                          <CheckIcon className="ml-1 h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Cuisine Tab */}
              {activeTab === 'cuisine' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Select cuisine types to find recipes from specific culinary traditions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cuisineTypes.map(cuisine => (
                      <button
                        key={cuisine}
                        onClick={() => toggleCuisineType(cuisine)}
                        className={`flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          filters.cuisineTypes.includes(cuisine)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {cuisine}
                        {filters.cuisineTypes.includes(cuisine) && (
                          <CheckIcon className="ml-1 h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Time & Difficulty Tab */}
              {activeTab === 'time' && (
                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Cooking Time (minutes)
                      </label>
                      <span className="text-sm text-gray-500">
                        {filters.cookingTime.min} - {filters.cookingTime.max} min
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="180"
                        value={filters.cookingTime.min}
                        onChange={(e) => updateCookingTime('min', parseInt(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                      />
                      <input
                        type="range"
                        min="0"
                        max="180"
                        value={filters.cookingTime.max}
                        onChange={(e) => updateCookingTime('max', parseInt(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Difficulty Level
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateDifficulty('all')}
                        className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
                          filters.difficulty === 'all'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => updateDifficulty('easy')}
                        className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
                          filters.difficulty === 'easy'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        Easy
                      </button>
                      <button
                        onClick={() => updateDifficulty('medium')}
                        className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
                          filters.difficulty === 'medium'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => updateDifficulty('hard')}
                        className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
                          filters.difficulty === 'hard'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        Hard
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Servings
                      </label>
                      <span className="text-sm text-gray-500">
                        {filters.servings.min} - {filters.servings.max} people
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={filters.servings.min}
                        onChange={(e) => updateServings('min', parseInt(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                      />
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={filters.servings.max}
                        onChange={(e) => updateServings('max', parseInt(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Other Tab */}
              {activeTab === 'other' && (
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Minimum Rating
                    </label>
                    <div className="flex items-center space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => updateRating(rating)}
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            filters.rating === rating
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {rating === 0 ? 'Any' : rating}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Calories per Serving
                      </label>
                      <span className="text-sm text-gray-500">
                        {filters.calories.min} - {filters.calories.max} kcal
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        value={filters.calories.min}
                        onChange={(e) => updateCalories('min', parseInt(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                      />
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        value={filters.calories.max}
                        onChange={(e) => updateCalories('max', parseInt(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 p-4">
              <button
                onClick={resetFilters}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reset All Filters
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 