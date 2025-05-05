import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Loader2 } from 'lucide-react'

interface SplashScreenProps {
  onLoadingComplete: () => void
}

export const SplashScreen = ({ onLoadingComplete }: SplashScreenProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          setTimeout(onLoadingComplete, 500) // Add a small delay before unmounting
          return 100
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <ChefHat className="h-16 w-16 text-orange-500" />
            </motion.div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">CookingShare</h1>
            <p className="mt-2 text-gray-600">Share your culinary journey</p>
          </motion.div>

          <div className="mt-8 w-64">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
                className="h-full bg-orange-500"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Loading your cooking experience...
            </p>
          </div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mt-8"
          >
            <Loader2 className="h-6 w-6 text-orange-500" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 