import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Image from 'next/image'
import { useState } from 'react'

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Community name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  category: yup.string().required('Category is required'),
  rules: yup.array().of(yup.string()).min(1, 'Add at least one rule'),
})

type FormData = {
  name: string
  description: string
  category: string
  rules: string[]
}

const categories = [
  'Regional Cuisine',
  'Dietary Preference',
  'Cooking Method',
  'Skill Level',
  'Special Occasions',
]

export default function CreateCommunityPage() {
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [rules, setRules] = useState<string[]>([''])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      rules: [''],
    },
  })

  const onSubmit = (data: FormData) => {
    // In a real app, this would be an API call
    console.log({ ...data, coverImage })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addRule = () => {
    setRules([...rules, ''])
  }

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  const updateRule = (index: number, value: string) => {
    const newRules = [...rules]
    newRules[index] = value
    setRules(newRules)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create a Community</h1>
          <p className="mt-2 text-gray-600">
            Start a new cooking community and connect with fellow food enthusiasts.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Cover Image Upload */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">Community Cover Image</h2>
            <div className="flex items-center justify-center">
              {coverImage ? (
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={coverImage}
                    alt="Community cover"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="mb-3 h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag
                      and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Community Details */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">Community Details</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Community Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  {...register('category')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Community Rules */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">Community Rules</h2>
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => updateRule(index, e.target.value)}
                    placeholder="Add a community rule"
                    className="flex-grow rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRule}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <svg
                  className="mr-1 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Rule
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </main>
  )
} 