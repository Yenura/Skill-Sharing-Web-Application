import { RecipeCard } from './RecipeCard';

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
    avatarUrl: string;
  };
}

interface RecipeGridProps {
  recipes: Recipe[];
  onLike?: (recipeId: string) => void;
  likedRecipes?: Set<string>;
}

export const RecipeGrid = ({
  recipes,
  onLike,
  likedRecipes = new Set(),
}: RecipeGridProps) => {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No recipes found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onLike={onLike}
          isLiked={likedRecipes.has(recipe.id)}
        />
      ))}
    </div>
  );
}; 