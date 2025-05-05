import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrashIcon, 
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface RecipeDeleteProps {
  recipeId: string
  recipeTitle: string
  onDelete?: () => void
}

export default function RecipeDelete({ recipeId, recipeTitle, onDelete }: RecipeDeleteProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const openModal = () => {
    setIsModalOpen(true)
    setError(null)
  }
  
  const closeModal = () => {
    setIsModalOpen(false)
    setError(null)
  }
  
  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    
    try {
      // In a real app, you would call your API to delete the recipe
      // await deleteRecipe(recipeId)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete()
      }
      
      // Redirect to the user's profile or home page
      router.push('/profile/me')
    } catch (err) {
      console.error('Error deleting recipe:', err)
      setError('Failed to delete recipe. Please try again.')
      setIsDeleting(false)
    }
  }
  
  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
      >
        <TrashIcon className="mr-1.5 h-4 w-4" />
        Delete Recipe
      </button>
      
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Delete Recipe</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-medium">{recipeTitle}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="ml-auto flex-shrink-0 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {error && (
                  <div className="mt-4 rounded-md bg-red-50 p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isDeleting}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400"
                  >
                    {isDeleting ? (
                      <>
                        <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <TrashIcon className="mr-1.5 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
} 