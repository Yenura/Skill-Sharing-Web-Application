"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api' // Import the api utility
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'recipe' | 'community';
  author?: {
    id: string;
    username: string;
    profilePicture: string;
  };
}

export const FeaturedSection = () => {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedContent()
  }, [])

  const fetchFeaturedContent = async () => {
    setLoading(true); // Keep loading state management
    try {
      // Use the api utility to fetch from the backend endpoint
      const { data, error } = await api.get<FeaturedItem[]>('/featured'); 
      
      if (error) {
        throw new Error(error);
      }
      
      if (data) {
        setFeaturedItems(data);
      } else {
        // Handle case where data is null but no error string (shouldn't happen often)
        setFeaturedItems([]); 
      }
    } catch (error) {
      console.error('Error fetching featured content:', error);
      setFeaturedItems([]); // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === featuredItems.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredItems.length - 1 : prevIndex - 1
    )
  }

  if (loading) {
    return (
      <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
    )
  }

  if (featuredItems.length === 0) {
    return null
  }

  return (
    <div className="relative h-96 rounded-lg overflow-hidden">
      {featuredItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={item.image}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <Link
                href={`/${item.type}/${item.id}`}
                className="block group"
              >
                <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-gray-200 mb-4 line-clamp-2">
                  {item.description}
                </p>
                {item.author && (
                  <div className="flex items-center space-x-2">
                    <Image
                      src={item.author.profilePicture}
                      alt={item.author.username}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-white">
                      {item.author.username}
                    </span>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {featuredItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
