import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Info } from 'lucide-react'
import { useAuth } from '../Auth/AuthContext'
import { useToast } from '@/components/ui/use-toast'

const categories = [
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

export default function GroupCreation() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isPrivate: false,
    guidelines: '',
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }))
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'File must be an image' }))
        return
      }
      
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      
      // Clear error
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.image
          return newErrors
        })
      }
    }
  }
  
  const handleRemoveImage = () => {
    setImageFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
  }
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Group name must be at least 3 characters'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a group",
        variant: "destructive",
      })
      return
    }
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('isPrivate', formData.isPrivate.toString())
      formDataToSend.append('guidelines', formData.guidelines)
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      const response = await fetch('/api/groups', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to create group')
      }

      const data = await response.json()
      // const formDataToSend = new FormData()
      // formDataToSend.append('name', formData.name)
      // formDataToSend.append('description', formData.description)
      // formDataToSend.append('category', formData.category)
      // formDataToSend.append('isPrivate', formData.isPrivate.toString())
      // formDataToSend.append('guidelines', formData.guidelines)
      // if (imageFile) {
      //   formDataToSend.append('image', imageFile)
      // }
      
      // const response = await fetch('/api/groups', {
      //   method: 'POST',
      //   body: formDataToSend
      // })
      
      // if (!response.ok) {
      //   throw new Error('Failed to create group')
      // }
      
      // const data = await response.json()
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
      
      toast({
        title: "Group created",
        description: "Your cooking community has been successfully created!",
        variant: "default",
      })
      
      // Redirect to the new group page
      // router.push(`/groups/${data.id}`)
      router.push('/groups')
    } catch (err) {
      console.error('Error creating group:', err)
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Cooking Community</h1>
        <p className="mt-2 text-gray-600">
          Start a new community to connect with other cooks who share your interests.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-medium text-gray-900">Community Details</h2>
          
          {/* Group Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Community Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm`}
              placeholder="e.g., Sourdough Enthusiasts"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`mt-1 block w-full rounded-md border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm`}
              placeholder="Describe what your community is about and who should join..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          
          {/* Privacy Setting */}
          <div className="mb-4">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="isPrivate"
                  name="isPrivate"
                  type="checkbox"
                  checked={formData.isPrivate}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isPrivate" className="font-medium text-gray-700">
                  Private Community
                </label>
                <p className="text-gray-500">
                  Private communities require admin approval to join and are not visible in search results.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Image */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-medium text-gray-900">Community Image</h2>
          
          <div className="mb-4">
            <p className="mb-2 text-sm text-gray-600">
              Upload an image that represents your community (optional)
            </p>
            
            {imagePreview ? (
              <div className="relative mt-2 inline-block">
                <img
                  src={imagePreview}
                  alt="Community preview"
                  className="h-48 w-48 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <label
                  htmlFor="image-upload"
                  className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
            
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>
        </div>
        
        {/* Community Guidelines */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-medium text-gray-900">Community Guidelines</h2>
          
          <div className="mb-4">
            <label htmlFor="guidelines" className="block text-sm font-medium text-gray-700">
              Guidelines (optional)
            </label>
            <textarea
              id="guidelines"
              name="guidelines"
              value={formData.guidelines}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
              placeholder="Set expectations for community members..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Provide guidelines for community members to follow. This helps maintain a positive and productive environment.
            </p>
          </div>
        </div>
        
        {/* Info Box */}
        <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
          <div className="flex">
            <Info className="h-5 w-5 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium">Before you create a community</h3>
              <div className="mt-2 text-sm">
                <p>
                  As a community creator, you'll be responsible for moderating content and managing members.
                  Make sure to check our community guidelines to ensure your group complies with our platform policies.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Community'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
