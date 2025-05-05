"use client";


import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return; // Don't run timeout logic until mounted

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000) // Keep the original delay

    return () => clearTimeout(timer)
  }, [hasMounted]) // Depend on hasMounted

  // Render nothing on the server or during the initial client render before mounting
  // This prevents the mismatch, but might cause a flash if loading is very fast.
  // Alternatively, always render the initial state and let the effect handle hiding.
  // Let's stick to the original logic of showing initially and hiding later,
  // but ensure the effect only runs post-mount.

  // If we want to ensure server/client initial match, we render based on isVisible
  // and the effect handles the change *after* mount.
  if (!hasMounted && typeof window === 'undefined') {
     // Optional: Could return null on server if needed, but usually rendering initial state is fine.
     // return null; 
  }


  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-32 h-32 mx-auto mb-4"
            >
              <Image
                src="/globe.svg"
                alt="CookShare"
                fill
                className="object-contain"
              />
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold text-orange-500 mb-2"
            >
              CookShare
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-600"
            >
              Share your culinary journey
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-32 h-1 bg-orange-500 mx-auto mt-4"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
