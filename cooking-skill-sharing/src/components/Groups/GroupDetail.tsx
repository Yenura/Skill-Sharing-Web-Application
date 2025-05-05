import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Users, 
  Calendar, 
  Tag, 
  Settings, 
  UserPlus, 
  LogOut, 
  Book, 
  MessageSquare,
  ChefHat,
  Share2
} from 'lucide-react'
import { useAuth } from '../Auth/AuthContext'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import GroupMembers from '@/components/Groups/GroupMembers'
import GroupRecipes from './GroupRecipes'
import GroupDiscussions from './GroupDiscussions'
import GroupGuidelines from './GroupGuidelines'

interface GroupMember {
  id: string
  username: string
  profilePicture?: string
  joinedAt: string
  isAdmin: boolean
}

interface Group {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  imageUrl?: string
  isPrivate: boolean
  createdAt: string
  createdBy: GroupMember
  guidelines?: string
  isMember: boolean
  isAdmin: boolean
  members: GroupMember[]
}

type GroupTab = 'recipes' | 'discussions' | 'members' | 'guidelines'

export default function GroupDetail({ groupId }: { groupId: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<GroupTab>('recipes')
  const [showShareOptions, setShowShareOptions] = useState(false)
  
  useEffect(() => {
    fetchGroupDetails()
  }, [groupId])
  
  const fetchGroupDetails = async () => {
    setLoading(true)
    try {
      const { data, error } = await api.get<Group>(`/groups/${groupId}`)
      
      if (error) {
        setError('Failed to fetch group details')
        return
      }
      
      setGroup(data)
      setError('')
    } catch (err) {
      console.error('Error fetching group details:', err)
      setError('Failed to load group details')
    } finally {
      setLoading(false)
    }
  }
  
  const handleJoinGroup = async () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(`/groups/${groupId}`))
      return
    }
    
    try {
      const { error } = await api.post(`/groups/${groupId}/join`, { userId: user.id })
      
      if (error) {
        throw new Error(error)
      }
      
      // Update local state
      if (group) {
        setGroup({
          ...group,
          isMember: true,
          memberCount: group.memberCount + 1
        })
      }
      
      toast({
        title: 'Joined group',
        description: `You are now a member of ${group?.name}`,
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join group. Please try again later.',
        variant: 'destructive',
      })
    }
  }
  
  const handleLeaveGroup = async () => {
    if (!user || !group) return
    
    try {
      const { error } = await api.delete(`/groups/${groupId}/members/${user.id}`)
      
      if (error) {
        throw new Error(error)
      }
      
      // Update local state
      setGroup({
        ...group,
        isMember: false,
        memberCount: Math.max(0, group.memberCount - 1)
      })
      
      toast({
        title: 'Left group',
        description: `You are no longer a member of ${group.name}`,
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to leave group. Please try again later.',
        variant: 'destructive',
      })
    }
  }
  
  const handleShareGroup = () => {
    setShowShareOptions(!showShareOptions)
  }
  
  const copyLinkToClipboard = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    
    toast({
      title: "Link copied",
      description: "Group link copied to clipboard",
      variant: "default",
    })
    
    setShowShareOptions(false)
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }
  
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
        <span className="ml-2 text-lg text-gray-600">Loading group details...</span>
      </div>
    )
  }
  
  if (error || !group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="font-medium">Error</p>
          <p>{error || 'Group not found'}</p>
          <button 
            onClick={() => router.push('/groups')}
            className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
          >
            Back to Groups
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Group Header */}
      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="relative h-64 w-full">
          {group.imageUrl ? (
            <Image
              src={group.imageUrl}
              alt={group.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <ChefHat className="h-24 w-24 text-gray-400" />
            </div>
          )}
          
          {group.isPrivate && (
            <div className="absolute right-4 top-4 rounded-full bg-gray-900 bg-opacity-70 px-3 py-1 text-sm font-medium text-white">
              Private Group
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-start md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
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
              
              <p className="mt-4 text-gray-700">{group.description}</p>
            </div>
            
            <div className="flex space-x-2">
              {group.isMember ? (
                <>
                  {group.isAdmin && (
                    <button
                      onClick={() => router.push(`/groups/${group.id}/settings`)}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      Manage
                    </button>
                  )}
                  
                  <button
                    onClick={handleLeaveGroup}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Leave
                  </button>
                </>
              ) : (
                <button
                  onClick={handleJoinGroup}
                  className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Join Group
                </button>
              )}
              
              <div className="relative">
                <button
                  onClick={handleShareGroup}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </button>
                
                {showShareOptions && (
                  <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={copyLinkToClipboard}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Copy link to clipboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'recipes'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <ChefHat className="mr-2 inline-block h-5 w-5" />
            Recipes
          </button>
          
          <button
            onClick={() => setActiveTab('discussions')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'discussions'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="mr-2 inline-block h-5 w-5" />
            Discussions
          </button>
          
          <button
            onClick={() => setActiveTab('members')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'members'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <Users className="mr-2 inline-block h-5 w-5" />
            Members
          </button>
          
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'guidelines'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <Book className="mr-2 inline-block h-5 w-5" />
            Guidelines
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'recipes' && <GroupRecipes groupId={group.id} isMember={group.isMember} />}
        {activeTab === 'discussions' && <GroupDiscussions groupId={group.id} isMember={group.isMember} />}
        {activeTab === 'members' && <GroupMembers members={group.members} isAdmin={group.isAdmin} />}
        {activeTab === 'guidelines' && <GroupGuidelines guidelines={group.guidelines || ''} />}
      </div>
    </div>
  )
}
