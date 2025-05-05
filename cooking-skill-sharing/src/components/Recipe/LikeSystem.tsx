import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

// Mock data - replace with API call
const likedUsers = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  },
  {
    id: '2',
    name: 'Sarah Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
  },
]

interface LikeSystemProps {
  contentId: string
  contentType: 'recipe' | 'comment'
  initialLikes: number
  isLiked: boolean
}

export default function LikeSystem({
  contentId,
  contentType,
  initialLikes,
  isLiked: initialIsLiked,
}: LikeSystemProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [showLikedUsers, setShowLikedUsers] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
    setIsLoading(false)
  }

  return (
    <div className="relative">
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
          isLiked
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {isLiked ? (
          <HeartSolidIcon className="h-5 w-5" />
        ) : (
          <HeartIcon className="h-5 w-5" />
        )}
        <span>{likes}</span>
      </button>

      {/* Liked Users Popup */}
      <AnimatePresence>
        {showLikedUsers && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowLikedUsers(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg bg-white p-4 shadow-lg"
            >
              <h3 className="mb-3 font-medium">Liked by</h3>
              <div className="space-y-2">
                {likedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50"
                  >
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-medium">{user.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Show Liked Users Button */}
      {likes > 0 && (
        <button
          onClick={() => setShowLikedUsers(!showLikedUsers)}
          className="ml-2 text-sm text-gray-500 hover:text-gray-700"
        >
          See all
        </button>
      )}
    </div>
  )
} 