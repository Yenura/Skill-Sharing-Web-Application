import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, X, Upload, Clock, Users } from 'lucide-react'

interface RecipeFormProps {
  initialData?: {
    id: string
    title: string
    description: string
    thumbnail: string
    cookingTime: number
    servings: number
    difficulty: string
    ingredients: {
      id: string
      name: string
      amount: string
      unit: string
    }[]
    instructions: {
      id: string
      step: number
      description: string
      image?: string
    }[]
    tags: string[]
  }
  mode: 'create' | 'edit'
}

export const RecipeForm = ({ initialData, mode }: RecipeFormProps) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    cookingTime: initialData?.cookingTime || 30,
    servings: initialData?.servings || 4,
    difficulty: initialData?.difficulty || 'medium',
    ingredients: initialData?.ingredients || [{ id: '1', name: '', amount: '', unit: '' }],
    instructions: initialData?.instructions || [{ id: '1', step: 1, description: '' }],
    tags: initialData?.tags || [],
  })

  useEffect(() => {
    if (initialData?.thumbnail) {
      setThumbnailPreview(initialData.thumbnail)
    }
  }, [initialData])

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleIngredientChange = (
    index: number,
    field: 'name' | 'amount' | 'unit',
    value: string
  ) => {
    setFormData((prev) => {
      const newIngredients = [...prev.ingredients]
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: value,
      }
      return {
        ...prev,
        ingredients: newIngredients,
      }
    })
  }

  const handleInstructionChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newInstructions = [...prev.instructions]
      newInstructions[index] = {
        ...newInstructions[index],
        description: value,
      }
      return {
        ...prev,
        instructions: newInstructions,
      }
    })
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          id: String(Date.now()),
          name: '',
          amount: '',
          unit: '',
        },
      ],
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        {
          id: String(Date.now()),
          step: prev.instructions.length + 1,
          description: '',
        },
      ],
    }))
  }

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({
          ...instruction,
          step: i + 1,
        })),
    }))
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }))
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare recipe data as a JSON object
      const recipeData = {
        title: formData.title,
        description: formData.description,
        cookingTime: formData.cookingTime,
        servings: formData.servings,
        difficulty: formData.difficulty,
        ingredients: formData.ingredients.map(ing => ({
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
        })),
        instructions: formData.instructions.map(inst => ({
          step: inst.step,
          description: inst.description,
          // instruction image handling will be added later
        })),
        tags: formData.tags,
        // thumbnail/media handling will be added later
      };

      const url = mode === 'create' ? '/api/recipes' : `/api/recipes/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      // Assuming userId is available, e.g., from AuthContext or props
      // For now, hardcoding or getting from a placeholder
      const userId = 'placeholder-user-id'; // Replace with actual user ID logic

      const response = await fetch(`${url}?userId=${userId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the backend returns the saved recipe with an ID
        router.push(`/recipe/${data.id}`); // Use /recipe/[id] route
      } else {
        const errorData = await response.json();
        console.error('Failed to save recipe:', errorData);
        alert(`Failed to save recipe: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('An unexpected error occurred while saving the recipe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Thumbnail Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Recipe Thumbnail
        </label>
        <div className="flex items-center space-x-4">
          <div className="relative h-48 w-48 rounded-lg overflow-hidden bg-gray-100">
            {thumbnailPreview ? (
              <Image
                src={thumbnailPreview}
                alt="Recipe thumbnail"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
              id="thumbnail"
            />
            <label
              htmlFor="thumbnail"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
            >
              Upload Image
            </label>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">
              Cooking Time (minutes)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleInputChange}
                required
                min="1"
                className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-orange-500 focus:ring-orange-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
              Servings
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleInputChange}
                required
                min="1"
                className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-orange-500 focus:ring-orange-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
          <button
            type="button"
            onClick={addIngredient}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-orange-600 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Ingredient
          </button>
        </div>

        <div className="space-y-4">
          {formData.ingredients.map((ingredient, index) => (
            <div key={ingredient.id} className="flex items-center space-x-4">
              <input
                type="text"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                placeholder="Amount"
                className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
              <input
                type="text"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                placeholder="Unit"
                className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                placeholder="Ingredient name"
                className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Instructions</h3>
          <button
            type="button"
            onClick={addInstruction}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-orange-600 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Step
          </button>
        </div>

        <div className="space-y-4">
          {formData.instructions.map((instruction, index) => (
            <div key={instruction.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                {instruction.step}
              </div>
              <div className="flex-1">
                <textarea
                  value={instruction.description}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  placeholder="Describe this step"
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-600"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          id="tags"
          placeholder="Add tags (press Enter)"
          onKeyDown={handleTagInput}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
        </button>
      </div>
    </form>
  )
}
