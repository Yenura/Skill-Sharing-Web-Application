import { useState, useEffect } from 'react'
import { Bell, Plus, Edit, Trash2, Calendar, Globe, X, Check, AlertTriangle, Users, Shield, Star, BarChart } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { Link } from 'react-router-dom'
import { adminNavItems } from './AdminLayout'

type Announcement = {
  id: string
  title: string
  content: string
  startDate: string
  endDate: string
  isActive: boolean
  priority: 'low' | 'medium' | 'high'
  targetAudience: 'all' | 'users' | 'moderators' | 'admins'
  createdAt: string
  createdBy: string
}

export default function SystemAnnouncements() {
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    isActive: true,
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetAudience: 'all' as 'all' | 'users' | 'moderators' | 'admins'
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      // In a real implementation, fetch from API
      // const response = await fetch('/api/admin/announcements')
      // const data = await response.json()
      // setAnnouncements(data)
      
      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
      
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Site Maintenance',
          content: 'The site will be undergoing scheduled maintenance on Saturday, June 10th from 2:00 AM to 4:00 AM UTC. During this time, the site may be temporarily unavailable.',
          startDate: '2023-06-08T00:00:00',
          endDate: '2023-06-11T00:00:00',
          isActive: true,
          priority: 'high',
          targetAudience: 'all',
          createdAt: '2023-06-05T14:30:00',
          createdBy: 'admin'
        },
        {
          id: '2',
          title: 'New Recipe Contest',
          content: 'Join our Summer Recipe Contest! Submit your best summer recipes for a chance to win premium cooking equipment and be featured on our homepage.',
          startDate: '2023-06-15T00:00:00',
          endDate: '2023-07-15T00:00:00',
          isActive: true,
          priority: 'medium',
          targetAudience: 'users',
          createdAt: '2023-06-10T09:45:00',
          createdBy: 'admin'
        },
        {
          id: '3',
          title: 'Updated Content Guidelines',
          content: 'We have updated our content guidelines. Please review the new guidelines to ensure your content complies with our community standards.',
          startDate: '2023-05-20T00:00:00',
          endDate: '2023-06-20T00:00:00',
          isActive: false,
          priority: 'medium',
          targetAudience: 'all',
          createdAt: '2023-05-18T11:20:00',
          createdBy: 'admin'
        }
      ]
      
      setAnnouncements(mockAnnouncements)
      setError('')
    } catch (err) {
      console.error('Error fetching announcements:', err)
      setError('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (announcement?: Announcement) => {
    if (announcement) {
      setSelectedAnnouncement(announcement)
      setFormData({
        title: announcement.title,
        content: announcement.content,
        startDate: new Date(announcement.startDate).toISOString().split('T')[0],
        endDate: new Date(announcement.endDate).toISOString().split('T')[0],
        isActive: announcement.isActive,
        priority: announcement.priority,
        targetAudience: announcement.targetAudience
      })
    } else {
      setSelectedAnnouncement(null)
      const today = new Date().toISOString().split('T')[0]
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      
      setFormData({
        title: '',
        content: '',
        startDate: today,
        endDate: nextMonth.toISOString().split('T')[0],
        isActive: true,
        priority: 'medium' as 'low' | 'medium' | 'high',
        targetAudience: 'all' as 'all' | 'users' | 'moderators' | 'admins'
      })
    }
    
    setIsModalOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate form
      if (!formData.title.trim() || !formData.content.trim() || !formData.startDate || !formData.endDate) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
      
      // Check if end date is after start date
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        toast({
          title: "Error",
          description: "End date must be after start date.",
          variant: "destructive",
        })
        return
      }
      
      if (selectedAnnouncement) {
        // Update existing announcement
        // In a real implementation, call API
        // await fetch(`/api/admin/announcements/${selectedAnnouncement.id}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(formData)
        // })
        
        // Mock implementation
        const updatedAnnouncements = announcements.map(announcement => 
          announcement.id === selectedAnnouncement.id 
            ? { 
                ...announcement, 
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                priority: formData.priority as 'low' | 'medium' | 'high',
                targetAudience: formData.targetAudience as 'all' | 'users' | 'moderators' | 'admins'
              } 
            : announcement
        )
        
        setAnnouncements(updatedAnnouncements)
        
        toast({
          title: "Announcement updated",
          description: "The announcement has been successfully updated.",
          variant: "default",
        })
      } else {
        // Create new announcement
        // In a real implementation, call API
        // const response = await fetch('/api/admin/announcements', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(formData)
        // })
        // const data = await response.json()
        
        // Mock implementation
        const newAnnouncement: Announcement = {
          id: `${announcements.length + 1}`,
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          priority: formData.priority as 'low' | 'medium' | 'high',
          targetAudience: formData.targetAudience as 'all' | 'users' | 'moderators' | 'admins',
          createdAt: new Date().toISOString(),
          createdBy: 'admin'
        }
        
        setAnnouncements([newAnnouncement, ...announcements])
        
        toast({
          title: "Announcement created",
          description: "The announcement has been successfully created.",
          variant: "default",
        })
      }
      
      setIsModalOpen(false)
      setSelectedAnnouncement(null)
    } catch (err) {
      console.error('Error saving announcement:', err)
      toast({
        title: "Error",
        description: "Failed to save announcement. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteAnnouncement = async () => {
    if (!selectedAnnouncement) return
    
    try {
      // In a real implementation, call API
      // await fetch(`/api/admin/announcements/${selectedAnnouncement.id}`, {
      //   method: 'DELETE'
      // })
      
      // Mock implementation
      setAnnouncements(announcements.filter(announcement => announcement.id !== selectedAnnouncement.id))
      
      toast({
        title: "Announcement deleted",
        description: "The announcement has been successfully deleted.",
        variant: "default",
      })
      
      setIsDeleteModalOpen(false)
      setSelectedAnnouncement(null)
    } catch (err) {
      console.error('Error deleting announcement:', err)
      toast({
        title: "Error",
        description: "Failed to delete announcement. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      // In a real implementation, call API
      // await fetch(`/api/admin/announcements/${announcement.id}/toggle`, {
      //   method: 'PATCH'
      // })
      
      // Mock implementation
      const updatedAnnouncements = announcements.map(item => 
        item.id === announcement.id 
          ? { ...item, isActive: !item.isActive } 
          : item
      )
      
      setAnnouncements(updatedAnnouncements)
      
      toast({
        title: announcement.isActive ? "Announcement deactivated" : "Announcement activated",
        description: `The announcement has been ${announcement.isActive ? 'deactivated' : 'activated'}.`,
        variant: "default",
      })
    } catch (err) {
      console.error('Error toggling announcement:', err)
      toast({
        title: "Error",
        description: "Failed to update announcement status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Low
          </span>
        )
      case 'medium':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Medium
          </span>
        )
      case 'high':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            High
          </span>
        )
      default:
        return null
    }
  }

  if (loading && announcements.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
        <span className="ml-2 text-lg text-gray-600">Loading announcements...</span>
      </div>
    )
  }

  if (error && announcements.length === 0) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <p className="font-medium">Error</p>
        <p>{error}</p>
        <button 
          onClick={fetchAnnouncements}
          className="mt-2 rounded bg-red-100 px-3 py-1 text-sm hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link to="/admin" className="hover:text-orange-600">Admin</Link></li>
          <li>/</li>
          <li className="text-gray-900">System Announcements</li>
        </ol>
      </nav>

      <div className="mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {adminNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                item.path === '/admin/announcements'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">System Announcements</h2>
        
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
        </button>
      </div>
      
      {announcements.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center">
          <Bell className="mb-2 h-12 w-12 text-gray-400" />
          <h3 className="mb-1 text-lg font-medium text-gray-900">No announcements found</h3>
          <p className="text-gray-500">
            Create your first announcement to notify users about important updates.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id}
              className={`rounded-lg border p-4 shadow-sm ${
                announcement.isActive 
                  ? 'border-orange-200 bg-orange-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                    {!announcement.isActive && (
                      <span className="ml-2 rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>
                        {formatDate(announcement.startDate)} - {formatDate(announcement.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="mr-1 h-4 w-4" />
                      <span className="capitalize">
                        {announcement.targetAudience === 'all' ? 'All Users' : announcement.targetAudience}
                      </span>
                    </div>
                    <div>
                      {getPriorityBadge(announcement.priority)}
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-700">{announcement.content}</p>
                </div>
                
                <div className="ml-4 flex space-x-1">
                  <button
                    onClick={() => handleToggleActive(announcement)}
                    className={`rounded p-1 ${
                      announcement.isActive 
                        ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-500' 
                        : 'text-gray-400 hover:bg-green-100 hover:text-green-500'
                    }`}
                    title={announcement.isActive ? "Deactivate" : "Activate"}
                  >
                    {announcement.isActive ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenModal(announcement)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement)}
                    className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                    Target Audience
                  </label>
                  <select
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                  >
                    <option value="all">All Users</option>
                    <option value="users">Regular Users</option>
                    <option value="moderators">Moderators</option>
                    <option value="admins">Admins</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active (immediately visible to users)
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  {selectedAnnouncement ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
              <p className="text-center text-gray-700">
                Are you sure you want to delete the announcement <span className="font-semibold">"{selectedAnnouncement.title}"</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAnnouncement}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
