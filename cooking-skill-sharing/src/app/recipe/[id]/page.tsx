import { notFound } from 'next/navigation'
import Image from 'next/image'
import { HeartIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid'
import RecipeRating from '@/components/Recipe/RecipeRating'

// Mock data - replace with API call
const recipe = {
  id: '1',
  title: 'Homemade Pizza',
  description: 'A delicious homemade pizza with fresh ingredients and a crispy crust.',
  author: {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  },
  images: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
  ],
  ingredients: [
    { id: '1', name: 'Pizza dough', amount: '1', unit: 'ball' },
    { id: '2', name: 'Tomato sauce', amount: '1', unit: 'cup' },
    { id: '3', name: 'Mozzarella cheese', amount: '2', unit: 'cups' },
    { id: '4', name: 'Fresh basil', amount: '1/4', unit: 'cup' },
  ],
  instructions: [
    {
      id: '1',
      step: 1,
      description: 'Preheat the oven to 450°F (230°C)',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    },
    {
      id: '2',
      step: 2,
      description: 'Roll out the pizza dough on a floured surface',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    },
    {
      id: '3',
      step: 3,
      description: 'Spread tomato sauce and add toppings',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    },
    {
      id: '4',
      step: 4,
      description: 'Bake for 15-20 minutes until crust is golden',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    },
  ],
  cookingTime: 30,
  difficulty: 'Medium',
  servings: 4,
  tags: ['Italian', 'Pizza', 'Main Course'],
  likes: 128,
  comments: 24,
  averageRating: 4.5,
  totalRatings: 56,
}

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  // In a real app, fetch recipe data using params.id
  if (!recipe) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-lg">
        <Image
          src={recipe.images[0]}
          alt={recipe.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="mb-2 text-4xl font-bold">{recipe.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={recipe.author.avatar}
                alt={recipe.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>{recipe.author.name}</span>
            </div>
            <span>•</span>
            <span>{recipe.cookingTime} mins</span>
            <span>•</span>
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Description</h2>
            <p className="text-gray-600">{recipe.description}</p>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Ingredients</h2>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-4 flex items-center gap-4">
                <label htmlFor="servings" className="font-medium">
                  Servings:
                </label>
                <select
                  id="servings"
                  className="rounded-lg border border-gray-300 px-3 py-1"
                  defaultValue={recipe.servings}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-center gap-2">
                    <span className="font-medium">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Instructions</h2>
            <div className="space-y-6">
              {recipe.instructions.map((instruction) => (
                <div key={instruction.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                      {instruction.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="mb-2">{instruction.description}</p>
                    {instruction.image && (
                      <div className="relative h-48 w-full overflow-hidden rounded-lg">
                        <Image
                          src={instruction.image}
                          alt={`Step ${instruction.step}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200">
              <HeartIconSolid className="h-5 w-5" />
              <span>{recipe.likes}</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200">
              <BookmarkIconSolid className="h-5 w-5" />
              <span>Save</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200">
              <ShareIcon className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Ratings and Reviews */}
          <RecipeRating
            recipeId={recipe.id}
            averageRating={recipe.averageRating}
            totalRatings={recipe.totalRatings}
          />
        </div>
      </div>
    </div>
  )
} 