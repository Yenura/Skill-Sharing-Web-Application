'use client'

import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'

interface ConfettiProps {
  duration?: number;
  onComplete?: () => void;
}

export const Confetti = ({ duration = 3000, onComplete }: ConfettiProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Set dimensions to window size
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Initial dimensions
    updateDimensions()

    // Update on resize
    window.addEventListener('resize', updateDimensions)

    // Set timer to stop confetti
    const timer = setTimeout(() => {
      setIsActive(false)
      if (onComplete) onComplete()
    }, duration)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      clearTimeout(timer)
    }
  }, [duration, onComplete])

  if (!isActive) return null

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.2}
      colors={[
        '#FFA500', // Orange
        '#FF4500', // OrangeRed
        '#FFD700', // Gold
        '#FF6347', // Tomato
        '#FF8C00', // DarkOrange
        '#FF7F50', // Coral
      ]}
    />
  )
}
