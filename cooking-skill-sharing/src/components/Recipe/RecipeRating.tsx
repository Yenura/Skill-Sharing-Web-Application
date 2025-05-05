import { useState } from 'react'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

// Mock data - replace with API call
const reviews = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    },
    rating: 5,
    comment: 'This recipe was amazing! The instructions were clear and the result was delicious.',
    date: '2024-02-25T10:30:00Z',
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Sarah Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    rating: 4,
    comment: 'Great recipe! I would suggest adding a bit more salt next time.',
    date: '2024-02-24T15:45:00Z',
  },
]

interface RecipeRatingProps {
  recipeId: string
  averageRating: number
  totalRatings: number
}

export default function RecipeRating({
  recipeId,
  averageRating,
  totalRatings,
}: RecipeRatingProps) {
  const [userRating, setUserRating] = useState(0)
  const [review, setReview] = useState('')
  const [localReviews, setLocalReviews] = useState(reviews)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userRating === 0) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newReview = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      },
      rating: userRating,
      comment: review,
      date: new Date().toISOString(),
    }

    setLocalReviews([newReview, ...localReviews])
    setUserRating(0)
    setReview('')
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-6 w-6 ${
                star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
        <span className="text-gray-500">({totalRatings} ratings)</span>
      </div>

      <form onSubmit={handleRatingSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setUserRating(star)}
              className="focus:outline-none"
            >
              {star <= userRating ? (
                <StarIcon className="h-8 w-8 text-yellow-400" />
              ) : (
                <StarOutlineIcon className="h-8 w-8 text-gray-300" />
              )}
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          rows={3}
        />

        <button
          type="submit"
          disabled={userRating === 0 || isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reviews</h3>
        {localReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center gap-3">
              <Image
                src={review.user.avatar}
                alt={review.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{review.user.name}</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2 text-gray-600">{review.comment}</p>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(review.date).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 