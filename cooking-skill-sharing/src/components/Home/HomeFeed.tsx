import { useState, useEffect } from 'react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { RecipeCard } from '../Recipe/RecipeCard';
import { FeaturedSection } from './FeaturedSection';
import { FilterBar } from './FilterBar';

interface Recipe {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: {
    id: string;
    username: string;
    profilePicture: string;
  };
  likesCount: number;
  commentsCount: number;
  tags: string[];
  createdAt: string;
}

export const HomeFeed = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filter, setFilter] = useState('latest'); // 'latest', 'trending', 'following'
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecipes = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recipes?page=${page}&filter=${filter}`);
      const data = await response.json();
      
      if (page === 1) {
        setRecipes(data.recipes);
      } else {
        setRecipes(prev => [...prev, ...data.recipes]);
      }
      
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => fetchRecipes(Math.ceil(recipes.length / 10) + 1),
  });

  useEffect(() => {
    fetchRecipes(1);
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FeaturedSection />
      
      <FilterBar
        currentFilter={filter}
        onFilterChange={setFilter}
      />
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            ref={index === recipes.length - 1 ? lastElementRef : null}
          >
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {!loading && !hasMore && recipes.length > 0 && (
        <div className="text-center mt-8 text-gray-500">
          No more recipes to load
        </div>
      )}
      
      {!loading && recipes.length === 0 && (
        <div className="text-center mt-8 text-gray-500">
          No recipes found
        </div>
      )}
    </div>
  );
}; 