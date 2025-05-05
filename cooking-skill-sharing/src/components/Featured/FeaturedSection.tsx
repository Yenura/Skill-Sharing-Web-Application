import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star, Clock, Users } from 'lucide-react'

interface FeaturedRecipe {
  id: string
  title: string
  description: string
  thumbnail: string
  author: {
    id: string
    name: string
    profilePicture: string
  }
  rating: number
  cookingTime: number
  servings: number
}

interface Category {
  id: string
  name: string
  icon: string
  recipeCount: number
}

export const FeaturedSection = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState<FeaturedRecipe[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        const [recipesResponse, categoriesResponse] = await Promise.all([
          fetch('/api/recipes/featured'),
          fetch('/api/categories')
        ])
        
        const recipesData = await recipesResponse.json()
        const categoriesData = await categoriesResponse.json()
        
        setFeaturedRecipes(recipesData.recipes)
        setCategories(categoriesData.categories)
      } catch (error) {
        console.error('Failed to fetch featured content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedContent()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === featuredRecipes.length - 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredRecipes.length - 1 : prev - 1
    )
  }

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Recipes Carousel */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Recipes
          </h2>
          
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative h-[400px] rounded-xl overflow-hidden"
              >
                <Image
                  src={featuredRecipes[currentSlide].thumbnail}
                  alt={featuredRecipes[currentSlide].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {featuredRecipes[currentSlide].title}
                  </h3>
                  <p className="text-gray-200 mb-4">
                    {featuredRecipes[currentSlide].description}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" />
                      <span>{featuredRecipes[currentSlide].rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-1" />
                      <span>{featuredRecipes[currentSlide].cookingTime} min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-1" />
                      <span>{featuredRecipes[currentSlide].servings} servings</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Browse Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={32}
                      height={32}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    {category.recipeCount} recipes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 