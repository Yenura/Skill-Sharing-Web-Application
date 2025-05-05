import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, Filter, Plus, Users, Calendar, Tag, ChevronDown } from 'lucide-react'
import { useAuth } from '../Auth/AuthContext'
import { useToast } from '@/components/ui/use-toast'

interface Group {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  imageUrl?: string
  isPrivate: boolean
  createdAt: string
  isMember: boolean
  isAdmin: boolean
}

interface GroupFilters {
  category: string
  membershipStatus: 'all' | 'member' | 'admin' | 'not-member'
  privacy: 'all' | 'public' | 'private'
  sortBy: 'newest' | 'popular' | 'alphabetical'
  search: string
}

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'baking', name: 'Baking' },
  { id: 'vegan', name: 'Vegan Cooking' },
  { id: 'asian', name: 'Asian Cuisine' },
  { id: 'mediterranean', name: 'Mediterranean' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'quick-meals', name: 'Quick Meals' },
  { id: 'bbq-grilling', name: 'BBQ & Grilling' },
  { id: 'healthy', name: 'Healthy Cooking' },
  { id: 'budget', name: 'Budget Cooking' },
]

export default function GroupDirectory() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<GroupFilters>({
    category: 'all',
    membershipStatus: 'all',
    privacy: 'all',
    sortBy: 'newest',
    search: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  
  useEffect(() => {
    fetchGroups()
  }, [page, filters])
  
  const fetchGroups = async () => {
    setLoading(true)
    try {
      // In a real implementation, fetch from API with pagination and filters
      // const queryParams = new URLSearchParams({
      //   page: page.toString(),
      //   limit: '12',
      //   category: filters.category !== 'all' ? filters.category : '',
      //   membershipStatus: filters.membershipStatus !== 'all' ? filters.membershipStatus : '',
      //   privacy: filters.privacy !== 'all' ? filters.privacy : '',
      //   sortBy: filters.sortBy,
      //   search: filters.search
      // })
      // const response = await fetch(`/api/groups?${queryParams}`)
      // const data = await response.json()
      // if (page === 1) {
      //   setGroups(data.groups)
      // } else {
      //   setGroups(prev => [...prev, ...data.groups])
      // }
      // setHasMore(data.hasMore)
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay
      
      const mockGroups: Group[] = [
        {
          id: '1',
          name: 'Sourdough Enthusiasts',
          description: 'A community for sourdough bread bakers to share tips, recipes, and troubleshooting advice.',
          category: 'baking',
          memberCount: 1250,
          imageUrl: 'https://images.unsplash.com/photo-1585478259715-4ddc6572944d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          isPrivate: false,
          createdAt: '2023-01-15T10:30:00',
          isMember: true,
          isAdmin: false
        },
        {
          id: '2',
          name: 'Plant-Based Cooking',
          description: 'Explore the world of plant-based cooking with creative recipes and ingredient substitutions.',
          category: 'vegan',
          memberCount: 3420,
          imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          isPrivate: false,
          createdAt: '2023-02-20T14:45:00',
          isMember: false,
          isAdmin: false
        },
        {
          id: '3',
          name: 'Thai Cooking Masterclass',
          description: 'Learn authentic Thai cooking techniques and recipes from experienced home cooks.',
          category: 'asian',
          memberCount: 890,
          imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          isPrivate: false,
          createdAt: '2023-03-10T09:15:00',
          isMember: true,
          isAdmin: true
        },
        {
          id: '4',
          name: 'Mediterranean Diet',
          description: 'Share recipes and cooking tips focused on the healthy Mediterranean diet.',
          category: 'mediterranean',
          memberCount: 1560,
          imageUrl: 'https://images.unsplash.com/photo-1556269923-e4ef51d69638?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          isPrivate: false,
          createdAt: '2023-04-05T16:20:00',
          isMember: false,
          isAdmin: false
        },
        {
          id: '5',
          name: 'Pastry Perfection',
          description: 'For pastry chefs and enthusiasts to share techniques, recipes, and troubleshooting.',
          category: 'desserts',
          memberCount: 720,
          imageUrl: 'https://images.unsplash.com/photo-1551404973-761c73954d05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          isPrivate: true,
          createdAt: '2023-05-12T11:10:00',
          isMember: true,
          isAdmin: false
        },
        {
          id: '6',
          name: '30-Minute Meals',
          description: 'Quick and easy recipes for busy people who still want to eat well.',
          category: 'quick-meals',
          memberCount: 2840,
          imageUrl: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          isPrivate: false,
          createdAt: '2023-06-18T13:25:00',
          isMember: false,
          isAdmin: false
        },
        {
          id: '7',
          name: 'BBQ Masters',
          description: 'Everything about grilling, smoking, and barbecuing meats and vegetables.',
          category: 'bbq-grilling',
          memberCount: 1340,
          imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          isPrivate: false,
          createdAt: '2023-07-22T15:40:00',
          isMember: false,
          isAdmin: false
        },
        {
          id: '8',
          name: 'Nutrition-Focused Cooking',
          description: 'Cooking with nutrition in mind - balanced, healthy recipes and meal planning.',
          category: 'healthy',
          memberCount: 1980,
          imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          isPrivate: false,
          createdAt: '2023-08-30T10:05:00',
          isMember: true,
          isAdmin: false
        },
        {
          id: '9',
          name: 'Budget Gourmet',
          description: 'Gourmet cooking on a budget - affordable ingredients with maximum flavor.',
          category: 'budget',
          memberCount: 1450,
          imageUrl: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          isPrivate: false,
          createdAt: '2023-09-14T12:50:00',
          isMember: false,
          isAdmin: false
        },
        {
          id: '10',
          name: 'Italian Cuisine Lovers',
          description: 'Authentic Italian recipes, techniques, and regional specialties.',
          category: 'mediterranean',
          memberCount: 2120,
          imageUrl: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          isPrivate: false,
          createdAt: '2023-10-25T09:30:00',
          isMember: false,
          isAdmin: false
        }
      ]
      
      // Filter groups based on current filters
      let filteredGroups = [...mockGroups]
      
      if (filters.category !== 'all') {
        filteredGroups = filteredGroups.filter(group => group.category === filters.category)
      }
      
      if (filters.membershipStatus !== 'all') {
        if (filters.membershipStatus === 'member') {
          filteredGroups = filteredGroups.filter(group => group.isMember)
        } else if (filters.membershipStatus === 'admin') {
          filteredGroups = filteredGroups.filter(group => group.isAdmin)
        } else if (filters.membershipStatus === 'not-member') {
          filteredGroups = filteredGroups.filter(group => !group.isMember)
        }
      }
      
      if (filters.privacy !== 'all') {
        filteredGroups = filteredGroups.filter(group => 
          filters.privacy === 'public' ? !group.isPrivate : group.isPrivate
        )
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredGroups = filteredGroups.filter(group => 
          group.name.toLowerCase().includes(searchLower) || 
          group.description.toLowerCase().includes(searchLower)
        )
      }
      
      // Sort groups
      switch (filters.sortBy) {
        case 'newest':
          filteredGroups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case 'popular':
          filteredGroups.sort((a, b) => b.memberCount - a.memberCount)
          break
        case 'alphabetical':
          filteredGroups.sort((a, b) => a.name.localeCompare(b.name))
          break
      }
      
      setGroups(filteredGroups)
      setHasMore(false) // Mock implementation doesn't have pagination
      setError('')
    } catch (err) {
      console.error('Error fetching groups:', err)
      setError('Failed to load groups')
    } finally {
      setLoading(false)
    }
  }
  
  const handleJoinGroup = async (groupId: string) => {
    try {
      // In a real implementation, call API
      // await fetch(`/api/groups/${groupId}/join`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // })
      
      // Mock implementation
      setGroups(groups.map(group => 
        group.id === groupId ? { ...group, isMember: true } : group
      ))
      
      toast({
        title: "Group joined",
        description: "You have successfully joined the group.",
        variant: "default",
      })
    } catch (err) {
      console.error('Error joining group:', err)
      toast({
        title: "Error",
        description: "Failed to join group. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleLeaveGroup = async (groupId: string) => {
    try {
      // In a real implementation, call API
      // await fetch(`/api/groups/${groupId}/leave`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // })
      
      // Mock implementation
      setGroups(groups.map(group => 
        group.id === groupId ? { ...group, isMember: false, isAdmin: false } : group
      ))
      
      toast({
        title: "Group left",
        description: "You have successfully left the group.",
        variant: "default",
      })
    } catch (err) {
      console.error('Error leaving group:', err)
      toast({
        title: "Error",
        description: "Failed to leave group. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleFilterChange = (key: keyof GroupFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page when filters change
  }
  
  const handleCreateGroup = () => {
    router.push('/groups/create')
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900">Cooking Communities</h1>
        
        <button
          onClick={handleCreateGroup}
          className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Group
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search communities..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Filter className="mr-2 h-5 w-5 text-gray-500" />
              Filters
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 md:grid-cols-3">
            <div>
              <label htmlFor="membershipStatus" className="block text-sm font-medium text-gray-700">
                Membership
              </label>
              <select
                id="membershipStatus"
                value={filters.membershipStatus}
                onChange={(e) => handleFilterChange('membershipStatus', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="all">All Groups</option>
                <option value="member">My Groups</option>
                <option value="admin">Groups I Manage</option>
                <option value="not-member">Not Joined</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="privacy" className="block text-sm font-medium text-gray-700">
                Privacy
              </label>
              <select
                id="privacy"
                value={filters.privacy}
                onChange={(e) => handleFilterChange('privacy', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="all">All Groups</option>
                <option value="public">Public Groups</option>
                <option value="private">Private Groups</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Group Cards */}
      {loading && groups.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <span className="ml-2 text-lg text-gray-600">Loading communities...</span>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchGroups}
            className="mt-2 rounded bg-red-100 px-3 py-1 text-sm hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      ) : groups.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center">
          <Users className="mb-2 h-12 w-12 text-gray-400" />
          <h3 className="mb-1 text-lg font-medium text-gray-900">No communities found</h3>
          <p className="text-gray-500">
            {filters.search 
              ? "No communities match your search criteria." 
              : "There are no cooking communities available."}
          </p>
          <button
            onClick={handleCreateGroup}
            className="mt-4 inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Group
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <div 
                key={group.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {group.imageUrl ? (
                    <Image
                      src={group.imageUrl}
                      alt={group.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <Users className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {group.isPrivate && (
                    <div className="absolute right-2 top-2 rounded-full bg-gray-900 bg-opacity-70 px-2 py-1 text-xs font-medium text-white">
                      Private
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 
                      className="text-lg font-medium text-gray-900 hover:text-orange-600"
                      onClick={() => router.push(`/groups/${group.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {group.name}
                    </h3>
                    
                    {group.isMember ? (
                      <button
                        onClick={() => handleLeaveGroup(group.id)}
                        className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                      >
                        {group.isAdmin ? 'Admin' : 'Member'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinGroup(group.id)}
                        className="rounded-md bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 hover:bg-orange-200"
                      >
                        Join
                      </button>
                    )}
                  </div>
                  
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                    {group.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{group.memberCount} members</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>Created {formatDate(group.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Tag className="mr-1 h-4 w-4" />
                      <span className="capitalize">{group.category.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More */}
          {hasMore && !loading && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setPage(prevPage => prevPage + 1)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Load More
              </button>
            </div>
          )}
          
          {/* Loading More Indicator */}
          {loading && page > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-orange-500"></div>
              <span className="ml-2 text-gray-600">Loading more...</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
