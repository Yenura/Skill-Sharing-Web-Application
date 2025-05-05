import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  likes: number;
  author: {
    id: string;
    name: string;
    imageUrl: string;
  };
  createdAt: string;
}

interface RecipeListProps {
  recipes: Recipe[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

export const RecipeList = ({
  recipes,
  onLoadMore,
  hasMore = false,
  isLoading = false,
}: RecipeListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Link
          key={recipe.id}
          href={`/recipes/${recipe.id}`}
          className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48 w-full">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {recipe.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {recipe.description}
              </p>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{recipe.cookingTime} min</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                <span>{recipe.likes}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative h-6 w-6">
                  <Image
                    src={recipe.author.imageUrl}
                    alt={recipe.author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {recipe.author.name}
                </span>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  difficultyColors[recipe.difficulty]
                }`}
              >
                {recipe.difficulty.charAt(0).toUpperCase() +
                  recipe.difficulty.slice(1)}
              </div>
            </div>
          </div>
        </Link>
      ))}

      {hasMore && (
        <div className="col-span-full flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}; 