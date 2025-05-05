import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { PlusIcon, XMarkIcon, PhotoIcon, ArrowUpTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface RecipeFormData {
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  prepTime: number
  cookTime: number
  servings: number
  ingredients: { item: string; amount: string; unit: string }[]
  instructions: { step: number; text: string; image?: string }[]
  tags: string[]
  cuisineType: string
  skillLevel: string
}

const difficultyLevels = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const cuisineTypes = [
  { value: 'italian', label: 'Italian' },
  { value: 'asian', label: 'Asian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'american', label: 'American' },
  { value: 'indian', label: 'Indian' },
  { value: 'french', label: 'French' },
  { value: 'other', label: 'Other' },
]

const commonTags = [
  'Italian',
  'Asian',
  'Mexican',
  'Mediterranean',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Quick & Easy',
  'Baking',
  'Grilling',
  'Healthy',
  'Dessert',
  'Breakfast',
  'Dinner',
  'Lunch',
]

const measurementUnits = [
  'g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'pinch', 'piece', 'slice', 'whole'
]

export default function RecipeUploadForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [ingredients, setIngredients] = useState<RecipeFormData['ingredients']>([{ item: '', amount: '', unit: '' }])
  const [instructions, setInstructions] = useState<RecipeFormData['instructions']>([{ step: 1, text: '' }])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RecipeFormData>({
    defaultValues: {
      difficulty: 'medium',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      skillLevel: 'intermediate',
      cuisineType: 'other'
    }
  })

  const addIngredient = () => {
    setIngredients([...ingredients, { item: '', amount: '', unit: '' }])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const updateIngredient = (index: number, field: 'item' | 'amount' | 'unit', value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  const addInstruction = () => {
    setInstructions([...instructions, { step: instructions.length + 1, text: '' }])
  }

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      const newInstructions = instructions.filter((_, i) => i !== index)
      // Update step numbers
      newInstructions.forEach((instruction, i) => {
        instruction.step = i + 1
      })
      setInstructions(newInstructions)
    }
  }

  const updateInstruction = (index: number, text: string) => {
    const newInstructions = [...instructions]
    newInstructions[index].text = text
    setInstructions(newInstructions)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    )
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      
      // Limit to 3 photos
      const totalPhotos = [...photos, ...newFiles].slice(0, 3)
      setPhotos(totalPhotos)
      
      // Create URLs for preview
      const newUrls = newFiles.map(file => URL.createObjectURL(file))
      setPhotoUrls([...photoUrls, ...newUrls].slice(0, 3))
    }
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
    
    // Also remove the URL and revoke it to prevent memory leaks
    URL.revokeObjectURL(photoUrls[index])
    const newUrls = [...photoUrls]
    newUrls.splice(index, 1)
    setPhotoUrls(newUrls)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        // Basic info validation
        if (!watch('title') || !watch('description')) {
          return false
        }
        return true
      case 2:
        // Ingredients validation
        return ingredients.every(ing => ing.item && ing.amount && ing.unit)
      case 3:
        // Instructions validation
        return instructions.every(inst => inst.text.trim() !== '')
      case 4:
        // Tags validation (optional, so always true)
        return true
      default:
        return true
    }
  }

  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1)
    }
  }

  const onSubmit = async (data: RecipeFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError('')

      // Create FormData for file uploads
      const formData = new FormData()
      
      // Add recipe data as JSON
      const recipeData = {
        ...data,
        ingredients,
        instructions,
        tags: selectedTags,
      }
      
      formData.append('recipe', JSON.stringify(recipeData))
      
      // Add photos
      photos.forEach((photo, index) => {
        formData.append(`photo${index + 1}`, photo)
      })

      // Send to backend API
      const response = await fetch('http://localhost:8080/api/recipes', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const result = await response.json()
      console.log('Recipe created:', result)
      
      setSubmitSuccess(true)
      
      // Redirect to the new recipe page after a short delay
      setTimeout(() => {
        router.push(`/recipe/${result.id}`)
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting recipe:', error)
      setSubmitError('Failed to submit recipe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {submitSuccess && (
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Recipe submitted successfully! Redirecting you to your recipe...
              </p>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              {...register('title', { 
                required: 'Recipe title is required',
                maxLength: { value: 100, message: 'Title must be less than 100 characters' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 20, message: 'Description should be at least 20 characters' }
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                {...register('difficulty', { required: 'Difficulty is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                {difficultyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preparation Time (minutes)
              </label>
              <input
                type="number"
                {...register('prepTime', { 
                  required: 'Prep time is required', 
                  min: { value: 1, message: 'Must be at least 1 minute' },
                  max: { value: 300, message: 'Must be less than 300 minutes' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
              {errors.prepTime && (
                <p className="mt-1 text-sm text-red-600">{errors.prepTime.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cooking Time (minutes)
              </label>
              <input
                type="number"
                {...register('cookTime', { 
                  required: 'Cooking time is required', 
                  min: { value: 0, message: 'Must be 0 or more minutes' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
              {errors.cookTime && (
                <p className="mt-1 text-sm text-red-600">{errors.cookTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Servings
              </label>
              <input
                type="number"
                {...register('servings', { 
                  required: 'Number of servings is required', 
                  min: { value: 1, message: 'Must serve at least 1 person' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
              {errors.servings && (
                <p className="mt-1 text-sm text-red-600">{errors.servings.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cuisine Type</label>
              <select
                {...register('cuisineType', { required: 'Cuisine type is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                {cuisineTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.cuisineType && (
                <p className="mt-1 text-sm text-red-600">{errors.cuisineType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skill Level</label>
              <select
                {...register('skillLevel', { required: 'Skill level is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.skillLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.skillLevel.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Photos (Max 3)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                  >
                    <span onClick={triggerFileInput}>Upload photos</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      ref={fileInputRef}
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            {photoUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <div className="relative h-24 w-full overflow-hidden rounded-lg">
                      <Image
                        src={url}
                        alt={`Recipe photo ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
              <button
                type="button"
                onClick={addIngredient}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Ingredient
              </button>
            </div>

            <div className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="w-1/2">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ingredient.item}
                      onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div className="w-1/4">
                    <input
                      type="text"
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div className="w-1/4">
                    <select
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                      <option value="">Select unit</option>
                      {measurementUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-gray-400 hover:text-gray-500"
                    disabled={ingredients.length === 1}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Instructions</h3>
              <button
                type="button"
                onClick={addInstruction}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Step
              </button>
            </div>

            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                    {instruction.step}
                  </div>
                  <textarea
                    placeholder="Describe this step"
                    value={instruction.text}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    onChange={(e) => updateInstruction(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="text-gray-400 hover:text-gray-500"
                    disabled={instructions.length === 1}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
            <p className="text-sm text-gray-500 mb-4">Select tags that describe your recipe (at least 1)</p>
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTags.includes(tag)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length === 0 && step === 4 && (
              <p className="mt-2 text-sm text-red-600">Please select at least one tag</p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={goToNextStep}
            className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || selectedTags.length === 0}
            className={`ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting || selectedTags.length === 0 
                ? 'bg-orange-300 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Recipe'}
          </button>
        )}
      </div>
    </form>
  )
}