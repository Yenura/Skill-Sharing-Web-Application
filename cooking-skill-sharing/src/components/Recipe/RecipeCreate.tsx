import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { 
  PhotoIcon, 
  PlusIcon, 
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { Camera, X, Save, Upload, Plus as LucidePlus, Trash2, Clock, ChefHat, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { api } from '@/lib/api'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

// Available tags for recipes
const availableTags = [
  'Italian', 'Asian', 'Vegetarian', 'Vegan', 'Baking', 'BBQ', 
  'Grilling', 'Quick Meals', 'Healthy', 'Mediterranean', 'Fusion',
  'Pasta', 'Pizza', 'Street Food', 'Desserts', 'Bread', 'Pastries',
  'Smoking', 'Outdoor Cooking', 'Weeknight Dinners', 'Time-Saving',
  'Plant-Based', 'Gluten-Free', 'Low-Carb', 'Keto', 'Paleo',
  'Budget-Friendly', 'Family-Friendly', 'Gourmet', 'Traditional',
  'Modern', 'Seasonal', 'Holiday', 'Breakfast', 'Lunch', 'Dinner',
  'Appetizers', 'Soups', 'Salads', 'Main Dishes', 'Side Dishes'
]

// Validation schema
const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  cookingTime: yup.number().required('Cooking time is required').min(1, 'Cooking time must be at least 1 minute'),
  difficulty: yup.string().oneOf(['easy', 'medium', 'hard'], 'Please select a difficulty level').required('Difficulty is required'),
  servings: yup.number().required('Servings is required').min(1, 'Servings must be at least 1'),
  ingredients: yup.array().of(
    yup.object().shape({
      item: yup.string().required('Ingredient is required'),
      amount: yup.string().required('Amount is required'),
      unit: yup.string().required('Unit is required')
    })
  ).min(1, 'At least one ingredient is required'),
  instructions: yup.array().of(
    yup.object().shape({
      step: yup.string().required('Instruction step is required')
    })
  ).min(1, 'At least one instruction step is required'),
  tags: yup.array().of(yup.string()).min(1, 'At least one tag is required')
})

type FormValues = {
  title: string
  description: string
  cookingTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  ingredients: { item: string; amount: string; unit: string }[]
  instructions: { step: string }[]
  tags: string[]
}

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const CUISINE_TYPES = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Mediterranean',
  'American',
  'French',
  'Korean',
  'Vietnamese',
  'Middle Eastern',
  'Spanish',
  'Greek',
  'Brazilian',
  'Caribbean',
  'African',
  'Fusion',
]

const COOKING_METHODS = [
  'Baking',
  'Grilling',
  'Frying',
  'Roasting',
  'Steaming',
  'Boiling',
  'Slow Cooking',
  'Pressure Cooking',
  'Smoking',
  'Sous Vide',
  'Fermentation',
  'Pickling',
  'Curing',
  'Marinating',
]

export const RecipeCreate = () => {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  })
  const imageRef = useRef<HTMLImageElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<RecipeFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      ingredients: [{ item: '', amount: '', unit: '' }],
      instructions: [{ step: '' }],
      tags: [],
    },
  })

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients'
  })
  
  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions'
  })
  
  const selectedTags = watch('tags')
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    const newImages: File[] = []
    const newPreviewUrls: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.match('image/(jpeg|png|webp)')) {
        setError('Only JPEG, PNG, and WebP images are allowed')
        continue
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        continue
      }
      
      newImages.push(file)
      newPreviewUrls.push(URL.createObjectURL(file))
    }
    
    setMediaFiles([...mediaFiles, ...newImages])
    setMediaPreviews([...mediaPreviews, ...newPreviewUrls])
    setError(null)
  }
  
  const removeImage = (index: number) => {
    const newImages = [...mediaFiles]
    const newPreviewUrls = [...mediaPreviews]
    
    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)
    
    setMediaFiles(newImages)
    setMediaPreviews(newPreviewUrls)
  }
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setValue('tags', selectedTags.filter(t => t !== tag))
    } else {
      setValue('tags', [...selectedTags, tag])
    }
  }
  
  const validateMedia = (file: File): boolean => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const validVideoTypes = ['video/mp4', 'video/webm']
    const maxImageSize = 5 * 1024 * 1024 // 5MB
    const maxVideoSize = 30 * 1024 * 1024 // 30MB

    if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
      setMediaError('Please upload a valid image (JPEG, PNG, GIF, WebP) or video (MP4, WebM) file')
      return false
    }

    if (validImageTypes.includes(file.type) && file.size > maxImageSize) {
      setMediaError('Image size should be less than 5MB')
      return false
    }

    if (validVideoTypes.includes(file.type)) {
      if (file.size > maxVideoSize) {
        setMediaError('Video size should be less than 30MB')
        return false
      }
      // Check video duration
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = URL.createObjectURL(file)
      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src)
          if (video.duration > 30) {
            setMediaError('Video duration must be less than 30 seconds')
            resolve(false)
          } else {
            setMediaError(null)
            resolve(true)
          }
        }
      })
    }

    setMediaError(null)
    return true
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateMedia(file)) {
        if (mediaFiles.length < 3) {
          setMediaFiles([...mediaFiles, file])
          setMediaPreviews([...mediaPreviews, URL.createObjectURL(file)])
        } else {
          setMediaError('Maximum 3 media files allowed')
        }
      }
    }
  }

  const addIngredient = () => {
    const ingredients = getValues('ingredients')
    setValue('ingredients', [...ingredients, { item: '', amount: '', unit: '' }])
  }

  const removeIngredient = (index: number) => {
    const ingredients = getValues('ingredients')
    setValue('ingredients', ingredients.filter((_, i) => i !== index))
  }

  const addStep = () => {
    const steps = getValues('instructions')
    setValue('instructions', [...steps, { step: '' }])
  }

  const removeStep = (index: number) => {
    const steps = getValues('instructions')
    setValue('instructions', steps.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: RecipeFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'ingredients' || key === 'instructions' || key === 'tags') {
          formData.append(key, JSON.stringify(data[key as keyof RecipeFormData]))
        } else {
          formData.append(key, data[key as keyof RecipeFormData] as string)
        }
      })

      mediaFiles.forEach((file, index) => {
        formData.append(`media${index}`, file)
      })

      await api.post('/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      router.push('/recipes')
    } catch (err) {
      setError('Failed to create recipe. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    {
      title: 'Basic Information',
      description: 'Enter the basic details of your recipe',
    },
    {
      title: 'Ingredients',
      description: 'Add all the ingredients needed',
    },
    {
      title: 'Instructions',
      description: 'Write step-by-step cooking instructions',
    },
    {
      title: 'Media & Tips',
      description: 'Add photos/videos and cooking tips',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {steps.map((step, index) => (
              <button
                key={step.title}
                onClick={() => setActiveStep(index + 1)}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeStep === index + 1
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <span className="mr-2">{step.title}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
          )}

          {activeStep === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Recipe Title
                </label>
                <Input
                  id="title"
                  {...register('title')}
                  error={errors.title?.message}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  id="description"
                  {...register('description')}
                  error={errors.description?.message}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    {...register('difficulty')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  >
                    <option value="">Select difficulty</option>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {errors.difficulty && (
                    <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
                    Servings
                  </label>
                  <Input
                    id="servings"
                    type="number"
                    {...register('servings', { valueAsNumber: true })}
                    error={errors.servings?.message}
                  />
                </div>

                <div>
                  <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">
                    Cooking Time (minutes)
                  </label>
                  <Input
                    id="cookingTime"
                    type="number"
                    {...register('cookingTime', { valueAsNumber: true })}
                    error={errors.cookingTime?.message}
                  />
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
                <Button
                  type="button"
                  onClick={addIngredient}
                  variant="outline"
                  className="flex items-center"
                >
                  <LucidePlus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>

              {watch('ingredients').map((_, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ingredient Name
                    </label>
                    <Input
                      {...register(`ingredients.${index}.item`)}
                      error={errors.ingredients?.[index]?.item?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`ingredients.${index}.amount`)}
                      error={errors.ingredients?.[index]?.amount?.message}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Unit
                      </label>
                      <Input
                        {...register(`ingredients.${index}.unit`)}
                        error={errors.ingredients?.[index]?.unit?.message}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      variant="outline"
                      className="px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Cooking Steps</h3>
                <Button
                  type="button"
                  onClick={addStep}
                  variant="outline"
                  className="flex items-center"
                >
                  <LucidePlus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>

              {watch('instructions').map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Step Description
                      </label>
                      <Textarea
                        {...register(`instructions.${index}.step`)}
                        error={errors.instructions?.[index]?.step?.message}
                        rows={3}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeStep(index)}
                      variant="outline"
                      className="px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Media Upload</h3>
                {mediaError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">{mediaError}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      {preview.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={200}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <video
                          src={preview}
                          className="w-full h-48 rounded-lg object-cover"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {mediaPreviews.length < 3 && (
                    <button
                      type="button"
                      onClick={() => mediaInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-48 hover:border-orange-500"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Upload photo/video</span>
                      <span className="text-xs text-gray-400">Max 3 files</span>
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={mediaInputRef}
                  onChange={handleMediaUpload}
                  accept="image/*,video/*"
                  className="hidden"
                />
              </div>

              <div>
                <label htmlFor="tips" className="block text-sm font-medium text-gray-700">
                  Cooking Tips
                </label>
                <Textarea
                  id="tips"
                  {...register('tips')}
                  rows={4}
                  placeholder="Share any helpful tips or tricks for making this recipe..."
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveStep(activeStep - 1)}
              disabled={activeStep === 1}
            >
              Previous
            </Button>
            {activeStep < steps.length ? (
              <Button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Recipe...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Recipe
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
} 