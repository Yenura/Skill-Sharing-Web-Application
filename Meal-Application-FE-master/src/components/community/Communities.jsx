import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { useAuth } from '../../config/AuthContext.jsx';
import DefaultAvatar from '../../assets/avatar.png';
import { useToast } from '../common/Toast';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // Handle the case when useAuth might return undefined
  const auth = useAuth() || {};
  const currentUser = auth.currentUser;

  const categories = [
    'all',
    'baking',
    'vegan cooking',
    'international cuisine',
    'weeknight dinners',
    'desserts',
    'healthy eating',
    'meal prep',
    'grilling'
  ];

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/communities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.warn('Using mock community data due to 403 Forbidden error');
          // Mock data for development
          const mockCommunities = [
            {
              id: '1',
              name: 'Healthy Meal Prep',
              description: 'A community for sharing healthy meal prep ideas and tips.',
              category: 'meal prep',
              coverImage: 'https://source.unsplash.com/random/800x200/?food,healthy',
              creatorName: 'John Doe',
              memberCount: 120,
              postCount: 45
            },
            {
              id: '2',
              name: 'Baking Enthusiasts',
              description: 'For those who love baking bread, cakes, and pastries.',
              category: 'baking',
              coverImage: 'https://source.unsplash.com/random/800x200/?baking',
              creatorName: 'Jane Smith',
              memberCount: 85,
              postCount: 32
            },
            {
              id: '3',
              name: 'Vegan Cooking',
              description: 'Share your favorite vegan recipes and cooking techniques.',
              category: 'vegan cooking',
              coverImage: 'https://source.unsplash.com/random/800x200/?vegan',
              creatorName: 'Alex Green',
              memberCount: 95,
              postCount: 38
            }
          ];
          setCommunities(mockCommunities);
          addToast('Using mock community data for testing', 'warning');
        } else {
          throw new Error(`Failed to fetch communities: ${response.status}`);
        }
      } else {
        const data = await response.json();
        setCommunities(data);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      addToast('Failed to load communities. Using mock data.', 'warning');
      
      // Mock data as fallback
      const mockCommunities = [
        {
          id: '1',
          name: 'Healthy Meal Prep',
          description: 'A community for sharing healthy meal prep ideas and tips.',
          category: 'meal prep',
          coverImage: 'https://source.unsplash.com/random/800x200/?food,healthy',
          creatorName: 'John Doe',
          memberCount: 120,
          postCount: 45
        },
        {
          id: '2',
          name: 'Baking Enthusiasts',
          description: 'For those who love baking bread, cakes, and pastries.',
          category: 'baking',
          coverImage: 'https://source.unsplash.com/random/800x200/?baking',
          creatorName: 'Jane Smith',
          memberCount: 85,
          postCount: 32
        },
        {
          id: '3',
          name: 'Vegan Cooking',
          description: 'Share your favorite vegan recipes and cooking techniques.',
          category: 'vegan cooking',
          coverImage: 'https://source.unsplash.com/random/800x200/?vegan',
          creatorName: 'Alex Green',
          memberCount: 95,
          postCount: 38
        }
      ];
      setCommunities(mockCommunities);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchCommunities();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/communities/search?query=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      setCommunities(data);
    } catch (error) {
      console.error('Error searching communities:', error);
      addToast('Search failed. Please try again.', 'error');
      
      // Filter mock data as fallback
      const filteredMockCommunities = communities.filter(community =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCommunities(filteredMockCommunities);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      fetchCommunities();
    } else {
      // Filter the existing communities by category
      const filtered = communities.filter(community => 
        community.category === category
      );
      setCommunities(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ExtraDarkColor mb-3">Cooking Communities</h1>
          <p className="text-gray-600 mb-4">
            Join or create cooking groups based on your interests. Share recipes, discuss cooking tips, 
            and participate in cooking challenges!
          </p>
          <Link to="/communities/create">
            <button className="bg-DarkColor hover:bg-ExtraDarkColor text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
              Create New Community
            </button>
          </Link>
        </div>

        <div className="mb-6">
          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="flex">
              <input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-DarkColor focus:border-DarkColor"
              />
              <button 
                type="submit" 
                className="bg-DarkColor hover:bg-ExtraDarkColor text-white px-4 py-2 rounded-r-md transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCategory === category 
                    ? 'bg-DarkColor text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors duration-200`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-DarkColor"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.length > 0 ? (
              communities.map((community) => (
                <div key={community.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {community.coverImage ? (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={community.coverImage} 
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      <i className='bx bx-group text-4xl text-gray-400'></i>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{community.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                      {community.category}
                    </span>
                    <p className="text-sm text-gray-500 mb-1">
                      Created by {community.creatorName || 'Unknown'}
                    </p>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {community.description}
                    </p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {community.memberCount} members • {community.postCount} posts
                      </span>
                      <Link to={`/communities/${community.id}`}>
                        <button className="text-DarkColor border border-DarkColor hover:bg-DarkColor hover:text-white px-3 py-1 rounded-md text-sm transition-colors duration-200">
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-8 rounded-lg shadow-md text-center">
                <i className='bx bx-group text-5xl text-gray-300 mb-3'></i>
                <p className="text-gray-600 mb-4">No communities found. Be the first to create one!</p>
                <Link to="/communities/create">
                  <button className="bg-DarkColor hover:bg-ExtraDarkColor text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
                    Create Community
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Communities;
