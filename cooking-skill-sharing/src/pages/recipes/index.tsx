import { useState, useEffect } from 'react';
import { RecipeSearch } from '@/components/Recipe/RecipeSearch';
import { RecipeGrid } from '@/components/Recipe/RecipeGrid';
import { useAuth } from '@/components/Auth/AuthContext';
import { api } from '@/lib/api';

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

export default function RecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
    if (user) {
      fetchLikedRecipes();
    }
  }, [user]);

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/recipes');
      setRecipes(response.data);
    } catch (err) {
      setError('Failed to load recipes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLikedRecipes = async () => {
    try {
      const response = await api.get('/users/me/liked-recipes');
      setLikedRecipes(new Set(response.data.map((recipe: Recipe) => recipe.id)));
    } catch (err) {
      console.error('Failed to fetch liked recipes:', err);
    }
  };

  const handleSearch = async (filters: {
    query: string;
    difficulty: string;
    cookingTime: string;
    tags: string[];
  }) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('q', filters.query);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.cookingTime) params.append('cookingTime', filters.cookingTime);
      if (filters.tags.length > 0) {
        filters.tags.forEach((tag) => params.append('tags', tag));
      }

      const response = await api.get(`/recipes/search?${params.toString()}`);
      setRecipes(response.data);
    } catch (err) {
      setError('Failed to search recipes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (recipeId: string) => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    try {
      if (likedRecipes.has(recipeId)) {
        await api.delete(`/recipes/${recipeId}/like`);
        setLikedRecipes((prev) => {
          const next = new Set(prev);
          next.delete(recipeId);
          return next;
        });
        setRecipes((prev) =>
          prev.map((recipe) =>
            recipe.id === recipeId
              ? { ...recipe, likes: recipe.likes - 1 }
              : recipe
          )
        );
      } else {
        await api.post(`/recipes/${recipeId}/like`);
        setLikedRecipes((prev) => new Set([...prev, recipeId]));
        setRecipes((prev) =>
          prev.map((recipe) =>
            recipe.id === recipeId
              ? { ...recipe, likes: recipe.likes + 1 }
              : recipe
          )
        );
      }
    } catch (err) {
      console.error('Failed to like/unlike recipe:', err);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-600">{error}</h3>
        <button
          onClick={fetchRecipes}
          className="mt-4 text-sm text-orange-600 hover:text-orange-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Recipes</h1>
      
      <RecipeSearch onSearch={handleSearch} />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipes...</p>
        </div>
      ) : (
        <RecipeGrid
          recipes={recipes}
          onLike={handleLike}
          likedRecipes={likedRecipes}
        />
      )}
    </div>
  );
} 