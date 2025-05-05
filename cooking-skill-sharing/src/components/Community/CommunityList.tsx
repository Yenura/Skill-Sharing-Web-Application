import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../Auth/AuthContext'

interface Community {
  id: number
  name: string
  description: string
  category: string
  coverImage: string
  memberCount: number
  isPrivate: boolean
  createdAt: string
}

const CATEGORIES = [
  'All',
  'Regional Cuisines',
  'Dietary Preferences',
  'Cooking Techniques',
  'Skill Levels',
  'Special Occasions',
  'Equipment',
  'Ingredients',
]

export const CommunityList = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [communities, setCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'joined'>('all')
  const [sortBy, setSortBy] = useState('newest')

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'REGIONAL_CUISINE', label: 'Regional Cuisine' },
    { value: 'DIETARY_PREFERENCE', label: 'Dietary Preference' },
    { value: 'COOKING_TECHNIQUE', label: 'Cooking Technique' },
    { value: 'INGREDIENT_FOCUS', label: 'Ingredient Focus' },
    { value: 'MEAL_TYPE', label: 'Meal Type' },
    { value: 'SKILL_LEVEL', label: 'Skill Level' },
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'members', label: 'Most Members' },
  ]

  useEffect(() => {
    fetchCommunities()
  }, [selectedCategory, sortBy])
  
  const fetchCommunities = async () => {
    try {
      const response = await fetch(`/api/communities?category=${selectedCategory}&sort=${sortBy}`)
      if (!response.ok) {
        throw new Error('Failed to fetch communities')
      }
      const data = await response.json()
      setCommunities(data)
      // const response = await api.get('/communities', {
      //   params: {
      //     category: selectedCategory,
      //     sort: sortBy,
      //   },
      // })
      // setCommunities(response.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load communities. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleJoin = async (communityId: string) => {
    if (!user) {
      router.push('/login')
      return
    }
    
    try {
      const community = communities.find(c => c.id === communityId)
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: community?.isJoined ? 'DELETE' : 'POST',
      })
      
      if (response.ok) {
        setCommunities(prev => prev.map(c => 
          c.id === communityId
            ? { ...c, isJoined: !c.isJoined, memberCount: c.isJoined ? c.memberCount - 1 : c.memberCount + 1 }
            : c
        ))
      }
    } catch (error) {
      console.error('Error joining/leaving community:', error)
    }
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCommunities()
  }
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  const filteredCommunities = communities.filter((community) => {
    const matchesSearch = community.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory
      ? community.category === selectedCategory
      : true
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cooking Communities</h1>
        <Link to="/communities/create">
          <Button>Create Community</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories}
            className="w-48"
          />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
            className="w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <Link
            key={community.id}
            to={`/communities/${community.id}`}
            className="block"
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={community.coverImage}
                  alt={community.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                {community.isPrivate && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    Private
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{community.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {community.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{community.memberCount.toLocaleString()} members</span>
                  <span>{new Date(community.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No communities found</h3>
          <p className="text-gray-600">
            Try adjusting your search or create a new community.
          </p>
        </div>
      )}
    </div>
  )
} 