'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Clock } from 'lucide-react'

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

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/recipe/${recipe.id}`}>
        <div className="relative h-48">
          <Image
            src={recipe.thumbnail}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Link
            href={`/profile/${recipe.author.id}`}
            className="flex items-center space-x-2"
          >
            <div className="relative h-6 w-6">
              <Image
                src={recipe.author.profilePicture}
                alt={recipe.author.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-600">{recipe.author.name}</span>
          </Link>
        </div>

        <Link href={`/recipe/${recipe.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-orange-600">
            {recipe.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              <span>{recipe.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{recipe.comments}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{recipe.cookingTime}m</span>
            </div>
          </div>
          <span className="capitalize">{recipe.difficulty}</span>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.tags.slice(0, 3).map(tag => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
