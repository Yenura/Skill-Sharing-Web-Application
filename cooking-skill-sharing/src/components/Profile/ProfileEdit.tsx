import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Camera, X, Save, Upload, MapPin, Globe, Phone, Mail, Lock, Bell, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../Auth/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { api } from '@/lib/api'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

// Mock data - replace with API call
const cookingInterests = [
  'Baking',
  'Vegan',
  'Asian Cuisine',
  'Mediterranean',
  'BBQ',
  'Desserts',
  'Healthy Eating',
  'Quick Meals',
  'Italian',
  'Mexican',
]

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  username: yup.string().required('Username is required'),
  bio: yup.string().max(500, 'Bio must be less than 500 characters'),
  location: yup.string(),
  website: yup.string().url('Must be a valid URL'),
  phone: yup.string().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number'),
  email: yup.string().email('Invalid email address'),
  socialLinks: yup.object().shape({
    instagram: yup.string().url('Must be a valid URL'),
    facebook: yup.string().url('Must be a valid URL'),
    twitter: yup.string().url('Must be a valid URL'),
    youtube: yup.string().url('Must be a valid URL'),
  }),
  currentPassword: yup.string().min(8, 'Password must be at least 8 characters'),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match'),
})

interface ProfileFormData {
  name: string
  bio: string
  location: string
  website: string
  interests: string[]
}

interface ProfileData {
  id: string
  username: string
  name: string
  bio: string
  profilePicture: string
  coverImage: string
  cookingInterests: string[]
  location: string
  website: string
  phone: string
  email: string
  socialLinks: {
    instagram?: string
    facebook?: string
    twitter?: string
    youtube?: string
  }
  notificationPreferences: {
    emailNotifications: boolean
    pushNotifications: boolean
    recipeUpdates: boolean
    communityUpdates: boolean
    marketingEmails: boolean
  }
  profileVisibility: {
    showEmail: boolean
    showPhone: boolean
    showLocation: boolean
    showSocialLinks: boolean
  }
}

const COOKING_INTERESTS = [
  'Baking',
  'Grilling',
  'Vegan',
  'Vegetarian',
  'Asian Cuisine',
  'Italian Cuisine',
  'Mexican Cuisine',
  'Mediterranean',
  'Desserts',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Appetizers',
  'Soups',
  'Salads',
  'Pasta',
  'Seafood',
  'Meat',
  'Poultry',
  'Gluten-Free',
  'Low-Carb',
  'Keto',
  'Paleo',
  'Slow Cooker',
  'Instant Pot',
  'Air Fryer',
  'BBQ',
  'Fermentation',
  'Preserving',
  'Cocktails',
]

export const ProfileEdit = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newInterest, setNewInterest] = useState('')
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  })
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isPasswordChanging, setIsPasswordChanging] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const imageRef = useRef<HTMLImageElement>(null)
  
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const coverImageInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      username: '',
      bio: '',
      location: '',
      website: '',
      phone: '',
      email: '',
      socialLinks: {
        instagram: '',
        facebook: '',
        twitter: '',
        youtube: '',
      },
      notificationPreferences: {
        emailNotifications: true,
        pushNotifications: true,
        recipeUpdates: true,
        communityUpdates: true,
        marketingEmails: false,
      },
      profileVisibility: {
        showEmail: false,
        showPhone: false,
        showLocation: true,
        showSocialLinks: true,
      },
    },
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      router.push('/login')
    }
  }, [user])

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('username', profile.username)
      setValue('bio', profile.bio)
      setValue('location', profile.location)
      setValue('website', profile.website)
      setValue('phone', profile.phone)
      setValue('email', profile.email)
      setValue('socialLinks', profile.socialLinks)
    }
  }, [profile, setValue])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/users/me')
      setProfile(response.data)
      setProfileImagePreview(response.data.profilePicture)
      setCoverImagePreview(response.data.coverImage)
    } catch (err) {
      setError('Failed to load profile. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleInterestInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault()
      const newInterestValue = e.currentTarget.value.trim()
      if (
        newInterestValue &&
        !profile?.cookingInterests.includes(newInterestValue) &&
        COOKING_INTERESTS.includes(newInterestValue)
      ) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                cookingInterests: [...prev.cookingInterests, newInterestValue],
              }
            : null
        )
        e.currentTarget.value = ''
      }
    }
  }

  const removeInterest = (interestToRemove: string) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            cookingInterests: prev.cookingInterests.filter(
              (interest) => interest !== interestToRemove
            ),
          }
        : null
    )
  }

  const validateImage = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      setImageError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)')
      return false
    }

    if (file.size > maxSize) {
      setImageError('Image size should be less than 5MB')
      return false
    }

    setImageError(null)
    return true
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateImage(file)) {
        setProfileImageFile(file)
        setProfileImagePreview(URL.createObjectURL(file))
      }
    }
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateImage(file)) {
        setCoverImageFile(file)
        setCoverImagePreview(URL.createObjectURL(file))
      }
    }
  }

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty')
        }
        resolve(blob)
      }, 'image/jpeg')
    })
  }

  const handleImageCrop = async (file: File, type: 'profile' | 'cover') => {
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result as string
      image.onload = async () => {
        const croppedImage = await getCroppedImg(image, crop)
        if (type === 'profile') {
          setProfileImageFile(new File([croppedImage], file.name, { type: 'image/jpeg' }))
          setProfileImagePreview(URL.createObjectURL(croppedImage))
        } else {
          setCoverImageFile(new File([croppedImage], file.name, { type: 'image/jpeg' }))
          setCoverImagePreview(URL.createObjectURL(croppedImage))
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handlePasswordChange = async (data: any) => {
    setIsPasswordChanging(true)
    setPasswordError(null)

    try {
      await api.put('/users/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setShowPasswordChange(false)
      reset({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordError('Failed to change password. Please check your current password.')
    } finally {
      setIsPasswordChanging(false)
    }
  }

  const onSubmit = async (data: any) => {
    if (!profile) return

    setIsSaving(true)
    setError(null)

    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'socialLinks' || key === 'notificationPreferences' || key === 'profileVisibility') {
          formData.append(key, JSON.stringify(data[key]))
        } else {
          formData.append(key, data[key])
        }
      })
      formData.append('cookingInterests', JSON.stringify(profile.cookingInterests))

      if (profileImageFile) {
        formData.append('profilePicture', profileImageFile)
      }

      if (coverImageFile) {
        formData.append('coverImage', coverImageFile)
      }

      await api.put('/users/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      router.push(`/profile/${user?.id}`)
    } catch (err) {
      setError('Failed to save profile. Please try again later.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Profile not found</h3>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'privacy'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Privacy
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
          )}
          
          {imageError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">{imageError}</div>
          )}

          {activeTab === 'profile' && (
            <>
              <div className="relative h-48 w-full">
                {coverImagePreview ? (
                  <Image
                    src={coverImagePreview}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
                <button
                  onClick={() => coverImageInputRef.current?.click()}
                  className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <Camera className="h-5 w-5 text-gray-700" />
                </button>
                <input
                  type="file"
                  ref={coverImageInputRef}
                  onChange={handleCoverImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="relative px-6 py-4 -mt-16">
                <div className="flex items-end">
                  <div className="relative h-24 w-24 rounded-full border-4 border-white overflow-hidden">
                    {profileImagePreview ? (
                      <Image
                        src={profileImagePreview}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                    <button
                      onClick={() => profileImageInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={profileImageInputRef}
                    onChange={handleProfileImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <Input
                    id="name"
                    {...register('name')}
                    error={errors.name?.message}
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Input
                    id="username"
                    {...register('username')}
                    error={errors.username?.message}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    {...register('bio')}
                    error={errors.bio?.message}
                    rows={4}
                    maxLength={500}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {watch('bio')?.length || 0}/500 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="location"
                      {...register('location')}
                      error={errors.location?.message}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="website"
                      {...register('website')}
                      error={errors.website?.message}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone"
                      {...register('phone')}
                      error={errors.phone?.message}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                      Instagram
                    </label>
                    <Input
                      id="instagram"
                      {...register('socialLinks.instagram')}
                      error={errors.socialLinks?.instagram?.message}
                    />
                  </div>

                  <div>
                    <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                      Facebook
                    </label>
                    <Input
                      id="facebook"
                      {...register('socialLinks.facebook')}
                      error={errors.socialLinks?.facebook?.message}
                    />
                  </div>

                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                      Twitter
                    </label>
                    <Input
                      id="twitter"
                      {...register('socialLinks.twitter')}
                      error={errors.socialLinks?.twitter?.message}
                    />
                  </div>

                  <div>
                    <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                      YouTube
                    </label>
                    <Input
                      id="youtube"
                      {...register('socialLinks.youtube')}
                      error={errors.socialLinks?.youtube?.message}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cooking Interests
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    placeholder="Add cooking interest (press Enter)"
                    onKeyDown={handleInterestInput}
                    list="cooking-interests"
                  />
                  <datalist id="cooking-interests">
                    {COOKING_INTERESTS.map((interest) => (
                      <option key={interest} value={interest} />
                    ))}
                  </datalist>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile?.cookingInterests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="mb-4"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
                </Button>

                {showPasswordChange && (
                  <div className="space-y-4">
                    {passwordError && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-md">{passwordError}</div>
                    )}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...register('currentPassword')}
                        error={errors.currentPassword?.message}
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...register('newPassword')}
                        error={errors.newPassword?.message}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleSubmit(handlePasswordChange)}
                      disabled={isPasswordChanging}
                    >
                      {isPasswordChanging ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    {...register('notificationPreferences.emailNotifications')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                    <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                  </div>
                  <input
                    type="checkbox"
                    {...register('notificationPreferences.pushNotifications')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Recipe Updates</label>
                    <p className="text-sm text-gray-500">Get notified about recipe updates and comments</p>
                  </div>
                  <input
                    type="checkbox"
                    {...register('notificationPreferences.recipeUpdates')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Community Updates</label>
                    <p className="text-sm text-gray-500">Get notified about community activities</p>
                  </div>
                  <input
                    type="checkbox"
                    {...register('notificationPreferences.communityUpdates')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Marketing Emails</label>
                    <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                  </div>
                  <input
                    type="checkbox"
                    {...register('notificationPreferences.marketingEmails')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Profile Visibility</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Email</label>
                    <p className="text-sm text-gray-500">Display your email address on your profile</p>
                  </div>
                  <input
                    type="checkbox"
                    {...register('profileVisibility.showEmail')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Phone</label>
                    <p className="text-sm text-gray-500">Display your phone number on your profile</p>
                  </div>
                  <input
                    type="checkbox"
                    {...register('profileVisibility.showPhone')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Location</label>
                    <p className="text-sm text-gray-500">Display your location on your profile</p>
                  </div>
                  <input
                    type="checkbox"
                    {...register('profileVisibility.showLocation')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Social Links</label>
                    <p className="text-sm text-gray-500">Display your social media links on your profile</p>
                  </div>
                  <input
                    type="checkbox"
                    {...register('profileVisibility.showSocialLinks')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 