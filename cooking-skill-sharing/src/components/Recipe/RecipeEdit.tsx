import { useState } from 'react'
import Image from 'next/image'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { PlusIcon, TrashIcon, CameraIcon } from '@heroicons/react/24/outline'

// Mock data - replace with API call
const recipe = {
  id: '1',
  title: 'Homemade Pizza',
  description: 'A delicious homemade pizza with fresh ingredients and a crispy crust.',
  images: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
  ],
  ingredients: [
    { id: '1', name: 'Pizza dough', amount: '1', unit: 'ball' },
    { id: '2', name: 'Tomato sauce', amount: '1', unit: 'cup' },
    { id: '3', name: 'Mozzarella cheese', amount: '2', unit: 'cups' },
    { id: '4', name: 'Fresh basil', amount: '1/4', unit: 'cup' },
  ],
  instructions: [
    {
      id: '1',
      step: 1,
      description: 'Preheat the oven to 450°F (230°C)',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    },
    {
      id: '2',
      step: 2,
      description: 'Roll out the pizza dough on a floured surface',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    },
    {
      id: '3',
      step: 3,
      description: 'Spread tomato sauce and add toppings',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    },
    {
      id: '4',
      step: 4,
      description: 'Bake for 15-20 minutes until crust is golden',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    },
  ],
  cookingTime: 30,
  difficulty: 'Medium',
  servings: 4,
  tags: ['Italian', 'Pizza', 'Main Course'],
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  cookingTime: yup
    .number()
    .min(1, 'Cooking time must be at least 1 minute')
    .required('Cooking time is required'),
  difficulty: yup.string().required('Difficulty is required'),
  servings: yup
    .number()
    .min(1, 'Servings must be at least 1')
    .required('Servings is required'),
  ingredients: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Ingredient name is required'),
      amount: yup.string().required('Amount is required'),
      unit: yup.string().required('Unit is required'),
    })
  ),
  instructions: yup.array().of(
    yup.object().shape({
      description: yup.string().required('Instruction is required'),
    })
  ),
  tags: yup.array().min(1, 'Select at least one tag'),
})

interface RecipeFormData {
  title: string
  description: string
  cookingTime: number
  difficulty: string
  servings: number
  ingredients: {
    name: string
    amount: string
    unit: string
  }[]
  instructions: {
    description: string
    image?: string
  }[]
  tags: string[]
}

export default function RecipeEdit() {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>(recipe.images)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: recipe.title,
      description: recipe.description,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      ingredients: recipe.ingredients.map(({ name, amount, unit }) => ({
        name,
        amount,
        unit,
      })),
      instructions: recipe.instructions.map(({ description, image }) => ({
        description,
        image,
      })),
      tags: recipe.tags,
    },
  })

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  })

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions',
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages([...images, reader.result as string])
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: RecipeFormData) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Recipe data:', data)
    setIsLoading(false)
  }

  return (
    <div className="max-w-4xl rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold">Edit Recipe</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Images */}
        <div>
          <label className="block font-medium">Recipe Images</label>
          <div className="mt-2 flex flex-wrap gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative h-32 w-32">
                <Image
                  src={image}
                  alt={`Recipe image ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500">
              <div className="text-center">
                <CameraIcon className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-1 block text-sm text-gray-500">Add Image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cookingTime" className="block font-medium">
              Cooking Time (minutes)
            </label>
            <input
              id="cookingTime"
              type="number"
              {...register('cookingTime')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.cookingTime && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cookingTime.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="difficulty" className="block font-medium">
              Difficulty
            </label>
            <select
              id="difficulty"
              {...register('difficulty')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            {errors.difficulty && (
              <p className="mt-1 text-sm text-red-600">
                {errors.difficulty.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="servings" className="block font-medium">
              Servings
            </label>
            <input
              id="servings"
              type="number"
              {...register('servings')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.servings && (
              <p className="mt-1 text-sm text-red-600">
                {errors.servings.message}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Ingredients */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block font-medium">Ingredients</label>
            <button
              type="button"
              onClick={() =>
                appendIngredient({ name: '', amount: '', unit: '' })
              }
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Ingredient</span>
            </button>
          </div>
          <div className="mt-2 space-y-4">
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4">
                <div className="flex-grow">
                  <label className="block text-sm font-medium">
                    Ingredient Name
                  </label>
                  <input
                    {...register(`ingredients.${index}.name`)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium">Amount</label>
                  <input
                    {...register(`ingredients.${index}.amount`)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium">Unit</label>
                  <input
                    {...register(`ingredients.${index}.unit`)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="mb-2 text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block font-medium">Instructions</label>
            <button
              type="button"
              onClick={() => appendInstruction({ description: '' })}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Step</span>
            </button>
          </div>
          <div className="mt-2 space-y-4">
            {instructionFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <textarea
                    {...register(`instructions.${index}.description`)}
                    rows={2}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium">Tags</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Italian', 'Pizza', 'Main Course', 'Quick Meals', 'Vegetarian'].map(
              (tag) => (
                <label
                  key={tag}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    value={tag}
                    {...register('tags')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{tag}</span>
                </label>
              )
            )}
          </div>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
} 