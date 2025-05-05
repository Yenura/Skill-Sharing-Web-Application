import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  PencilIcon, 
  BookmarkIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../Auth/AuthContext'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { RecipeCard } from '@/components/Recipe/RecipeCard'
import { api } from '@/lib/api'
import { 
  User, 
  Bookmark, 
  Users, 
  Settings, 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  Clock, 
  ChefHat 
} from 'lucide-react'

interface ProfileData {
  id: string;
  username: string;
  bio: string;
  profilePicture: string;
  cookingInterests: string[];
  followers: number;
  following: number;
  recipes: Recipe[];
  achievements: Achievement[];
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: {
    id: string;
    name: string;
    profilePicture: string;
  };
  likes: number;
  comments: number;
  cookingTime: number;
  servings: number;
  difficulty: string;
  tags: string[];
  createdAt: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
}

interface ProfileUser {
  id: string;
  username: string;
  name: string;
  bio: string;
  profilePicture: string;
  coverImage: string;
  followersCount: number;
  followingCount: number;
  recipesCount: number;
  savedRecipesCount: number;
  communitiesCount: number;
  cookingInterests: string[];
  isFollowing: boolean;
}

interface Community {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  isJoined: boolean;
}

export const ProfileView = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('recipes');
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  useEffect(() => {
    if (profileUser) {
      fetchTabData();
    }
  }, [activeTab, profileUser]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await api.get<ProfileUser>(`/users/${userId}`);
      
      if (error) {
        throw new Error(`Failed to fetch profile: ${error}`);
      }
      
      if (data) {
        setProfileUser(data);
        setIsFollowing(data.isFollowing);
      } else {
        throw new Error('No profile data returned');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTabData = async () => {
    if (!profileUser) return;

    try {
      switch (activeTab) {
        case 'recipes':
          const { data: recipesData, error: recipesError } = await api.get<Recipe[]>(`/users/${userId}/recipes`);
          if (recipesError) {
            console.error('Error fetching recipes:', recipesError);
          } else {
            setRecipes(recipesData || []);
          }
          break;
        case 'saved':
          const { data: savedData, error: savedError } = await api.get<Recipe[]>(`/users/${userId}/saved-recipes`);
          if (savedError) {
            console.error('Error fetching saved recipes:', savedError);
          } else {
            setSavedRecipes(savedData || []);
          }
          break;
        case 'communities':
          const { data: communitiesData, error: communitiesError } = await api.get<Community[]>(`/users/${userId}/communities`);
          if (communitiesError) {
            console.error('Error fetching communities:', communitiesError);
          } else {
            setCommunities(communitiesData || []);
          }
          break;
      }
    } catch (err) {
      console.error(`Failed to load ${activeTab}:`, err);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(router.asPath));
      return;
    }

    try {
      if (isFollowing) {
        const { error } = await api.delete(`/users/${userId}/follow`);
        if (error) {
          throw new Error(`Failed to unfollow: ${error}`);
        }
        setIsFollowing(false);
        setProfileUser(prev => 
          prev ? { ...prev, followersCount: prev.followersCount - 1 } : null
        );
      } else {
        const { error } = await api.post(`/users/${userId}/follow`);
        if (error) {
          throw new Error(`Failed to follow: ${error}`);
        }
        setIsFollowing(true);
        setProfileUser(prev => 
          prev ? { ...prev, followersCount: prev.followersCount + 1 } : null
        );
      }
    } catch (err) {
      console.error('Failed to update follow status:', err);
    }
  };

  const handleLike = async (recipeId: string) => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(router.asPath));
      return;
    }

    try {
      if (activeTab === 'recipes') {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        const isLiked = recipe.likes > 0; // This is a simplification, ideally we'd track liked status in the recipe object

        if (isLiked) {
          const { error } = await api.delete(`/recipes/${recipeId}/like`);
          if (error) {
            throw new Error(`Failed to unlike recipe: ${error}`);
          }
          
          setRecipes(prev =>
            prev.map(recipe =>
              recipe.id === recipeId
                ? { ...recipe, likes: recipe.likes - 1 }
                : recipe
            )
          );
        } else {
          const { error } = await api.post(`/recipes/${recipeId}/like`);
          if (error) {
            throw new Error(`Failed to like recipe: ${error}`);
          }
          
          setRecipes(prev =>
            prev.map(recipe =>
              recipe.id === recipeId
                ? { ...recipe, likes: recipe.likes + 1 }
                : recipe
            )
          );
        }
      } else if (activeTab === 'saved') {
        // Similar logic for saved recipes
        const recipe = savedRecipes.find(r => r.id === recipeId);
        if (!recipe) return;

        const isLiked = recipe.likes > 0;

        if (isLiked) {
          const { error } = await api.delete(`/recipes/${recipeId}/like`);
          if (error) {
            throw new Error(`Failed to unlike recipe: ${error}`);
          }
          
          setSavedRecipes(prev =>
            prev.map(recipe =>
              recipe.id === recipeId
                ? { ...recipe, likes: recipe.likes - 1 }
                : recipe
            )
          );
        } else {
          const { error } = await api.post(`/recipes/${recipeId}/like`);
          if (error) {
            throw new Error(`Failed to like recipe: ${error}`);
          }
          
          setSavedRecipes(prev =>
            prev.map(recipe =>
              recipe.id === recipeId
                ? { ...recipe, likes: recipe.likes + 1 }
                : recipe
            )
          );
        }
      }
    } catch (err) {
      console.error('Failed to like/unlike recipe:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h3 className="text-lg font-medium text-red-600">{error}</h3>
          <button
            onClick={fetchProfileData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={profileUser?.coverImage || '/default-cover.jpg'}
                alt="Cover"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="relative px-6 py-4 -mt-16">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end">
                  <div className="relative h-24 w-24 rounded-full border-4 border-white overflow-hidden">
                    <Image
                      src={profileUser?.profilePicture || '/default-avatar.png'}
                      alt={profileUser?.name || 'User profile'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">{profileUser?.name}</h1>
                    <p className="text-gray-500">@{profileUser?.username}</p>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0 flex space-x-2">
                  {profileUser && profileUser.id === user?.id ? (
                    <Button
                      onClick={() => router.push(`/profile/edit`)}
                      className="flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleFollow}
                        variant={isFollowing ? "outline" : "default"}
                        className="flex items-center"
                      >
                        {isFollowing ? (
                          <>
                            <User className="h-4 w-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-700">{profileUser?.bio}</p>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {profileUser?.cookingInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
              
              <div className="mt-6 flex space-x-6">
                <Link href={`/profile/${userId}/followers`} className="flex items-center">
                  <span className="font-semibold">{profileUser?.followersCount}</span>
                  <span className="ml-1 text-gray-500">Followers</span>
                </Link>
                <Link href={`/profile/${userId}/following`} className="flex items-center">
                  <span className="font-semibold">{profileUser?.followingCount}</span>
                  <span className="ml-1 text-gray-500">Following</span>
                </Link>
                <div className="flex items-center">
                  <span className="font-semibold">{profileUser?.recipesCount}</span>
                  <span className="ml-1 text-gray-500">Recipes</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-8 bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('recipes')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'recipes'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recipes
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'saved'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Saved
                </button>
                <button
                  onClick={() => setActiveTab('communities')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'communities'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Communities
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'recipes' && (
                <div>
                  {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          onLike={handleLike}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                      <h3 className="text-lg font-medium text-gray-900">No recipes</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {profileUser && profileUser.id === user?.id
                          ? "You haven't shared any recipes yet."
                          : `${profileUser?.name} hasn't shared any recipes yet.`}
                      </p>
                      {profileUser && profileUser.id === user?.id && (
                        <Button
                          onClick={() => router.push('/recipes/new')}
                          className="mt-4"
                        >
                          Create Recipe
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'saved' && (
                <div>
                  {savedRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedRecipes.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          onLike={handleLike}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                      <h3 className="text-lg font-medium text-gray-900">No saved recipes</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {profileUser && profileUser.id === user?.id
                          ? "You haven't saved any recipes yet."
                          : `${profileUser?.name} hasn't saved any recipes yet.`}
                      </p>
                      {profileUser && profileUser.id === user?.id && (
                        <Button
                          onClick={() => router.push('/explore')}
                          className="mt-4"
                        >
                          Explore Recipes
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'communities' && (
                <div>
                  {communities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {communities.map((community) => (
                        <Link
                          key={community.id}
                          href={`/communities/${community.id}`}
                          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="relative h-32 w-full">
                            <Image
                              src={community.coverImage || '/default-community-cover.jpg'}
                              alt={community.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {community.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                              {community.description}
                            </p>
                            <div className="mt-4 flex items-center text-sm text-gray-500">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{community.memberCount} members</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                      <h3 className="text-lg font-medium text-gray-900">No communities</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {profileUser && profileUser.id === user?.id
                          ? "You haven't joined any communities yet."
                          : `${profileUser?.name} hasn't joined any communities yet.`}
                      </p>
                      {profileUser && profileUser.id === user?.id && (
                        <Button
                          onClick={() => router.push('/communities')}
                          className="mt-4"
                        >
                          Browse Communities
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};