import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  PhotoIcon,
  XMarkIcon,
  UserGroupIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const categories = [
  { value: 'REGIONAL_CUISINE', label: 'Regional Cuisine' },
  { value: 'DIETARY_PREFERENCE', label: 'Dietary Preference' },
  { value: 'COOKING_TECHNIQUE', label: 'Cooking Technique' },
  { value: 'INGREDIENT_FOCUS', label: 'Ingredient Focus' },
  { value: 'MEAL_TYPE', label: 'Meal Type' },
  { value: 'SKILL_LEVEL', label: 'Skill Level' },
];

interface Community {
  id: number;
  name: string;
  description: string;
  category: string;
  coverImage: string;
  isPrivate: boolean;
  rules: string[];
}

export const CommunityEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Community>({
    id: 0,
    name: '',
    description: '',
    category: '',
    coverImage: '',
    isPrivate: false,
    rules: [],
  });
  const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
  const [communityImage, setCommunityImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState({
    community: '',
    cover: ''
  });

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  const fetchCommunity = async () => {
    try {
      // TODO: Implement API call to fetch community details
      // const response = await api.get(`/communities/${id}`);
      // setFormData(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load community details.',
        variant: 'destructive',
      });
      navigate('/communities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handlePrivacyChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPrivate: checked }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCoverImage(e.target.files[0]);
    }
  };

  const handleRuleChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.map((rule, i) => (i === index ? value : rule)),
    }));
  };

  const addRule = () => {
    setFormData((prev) => ({ ...prev, rules: [...prev.rules, ''] }));
  };

  const removeRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('isPrivate', formData.isPrivate.toString());
      formData.rules.forEach((rule) => {
        if (rule.trim()) {
          data.append('rules[]', rule);
        }
      });
      if (newCoverImage) {
        data.append('coverImage', newCoverImage);
      }

      // TODO: Implement API call to update community
      // await api.put(`/communities/${id}`, data, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      toast({
        title: 'Success',
        description: 'Community updated successfully!',
      });

      navigate(`/communities/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update community. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Community name is required').min(3, 'Name must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  tags: yup.array().min(1, 'Select at least one tag'),
  isPrivate: yup.boolean(),
  allowMemberPosts: yup.boolean(),
  allowMemberComments: yup.boolean(),
  rules: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Rule title is required'),
      description: yup.string().required('Rule description is required')
    })
  )
})

type FormValues = {
  name: string
  description: string
  tags: string[]
  isPrivate: boolean
  allowMemberPosts: boolean
  allowMemberComments: boolean
  rules: { title: string; description: string }[]
}

// Available tags
const availableTags = [
  'Beginner Friendly',
  'Advanced Techniques',
  'Vegetarian',
  'Vegan',
  'Baking',
  'Grilling',
  'Asian Cuisine',
  'Italian Cuisine',
  'Mediterranean',
  'Quick Meals',
  'Healthy Eating',
  'Food Photography'
]

export default function CommunityEdit({ community }: { community: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [communityImage, setCommunityImage] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState({
    community: community?.image || '',
    cover: community?.coverImage || ''
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: community?.name || '',
      description: community?.description || '',
      tags: community?.tags || [],
      isPrivate: community?.isPrivate || false,
      allowMemberPosts: community?.allowMemberPosts || true,
      allowMemberComments: community?.allowMemberComments || true,
      rules: community?.rules || []
    }
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'community' | 'cover') => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(prev => ({ ...prev, [type]: previewUrl }))

    // Store file for upload
    if (type === 'community') {
      setCommunityImage(file)
    } else {
      setCoverImage(file)
    }
  }

  const removeImage = (type: 'community' | 'cover') => {
    setImagePreview(prev => ({ ...prev, [type]: '' }))
    if (type === 'community') {
      setCommunityImage(null)
    } else {
      setCoverImage(null)
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to community page
      router.push(`/community/${community.id}`)
    } catch (err) {
      setError('Failed to update community. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Edit Community</h1>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Images Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Community Images</h2>
          
          {/* Community Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Community Image
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {imagePreview.community ? (
                <div className="relative h-32 w-32">
                  <img
                    src={imagePreview.community}
                    alt="Community"
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('community')}
                    className="absolute -right-2 -top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleImageUpload(e, 'community')}
                  className="hidden"
                  id="community-image"
                />
                <label
                  htmlFor="community-image"
                  className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Upload Image
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  JPEG, PNG or WebP (max. 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Image
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {imagePreview.cover ? (
                <div className="relative h-32 w-64">
                  <img
                    src={imagePreview.cover}
                    alt="Cover"
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('cover')}
                    className="absolute -right-2 -top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleImageUpload(e, 'cover')}
                  className="hidden"
                  id="cover-image"
                />
                <label
                  htmlFor="cover-image"
                  className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Upload Cover
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  JPEG, PNG or WebP (max. 5MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Community Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const currentTags = watch('tags')
                    const newTags = currentTags.includes(tag)
                      ? currentTags.filter(t => t !== tag)
                      : [...currentTags, tag]
                    setValue('tags', newTags)
                  }}
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    watch('tags').includes(tag)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Privacy Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-medium">Private Community</h3>
                  <p className="text-sm text-gray-500">
                    Only approved members can view and join
                  </p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  {...register('isPrivate')}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0 after:top-0 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-medium">Member Posts</h3>
                  <p className="text-sm text-gray-500">
                    Allow members to create posts
                  </p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  {...register('allowMemberPosts')}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0 after:top-0 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-medium">Member Comments</h3>
                  <p className="text-sm text-gray-500">
                    Allow members to comment on posts
                  </p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  {...register('allowMemberComments')}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0 after:top-0 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Community Rules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Community Rules</h2>
            <button
              type="button"
              onClick={() => {
                const currentRules = watch('rules')
                setValue('rules', [
                  ...currentRules,
                  { title: '', description: '' }
                ])
              }}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Rule
            </button>
          </div>

          <div className="space-y-4">
            {watch('rules').map((_, index) => (
              <div key={index} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Rule Title
                  </label>
                  <input
                    type="text"
                    {...register(`rules.${index}.title`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.rules?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.rules[index].title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rule Description
                  </label>
                  <textarea
                    rows={2}
                    {...register(`rules.${index}.description`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.rules?.[index]?.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.rules[index].description.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const currentRules = watch('rules')
                    setValue(
                      'rules',
                      currentRules.filter((_, i) => i !== index)
                    )
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove Rule
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
} 