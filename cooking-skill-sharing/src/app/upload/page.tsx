import { useState } from 'react'
import Navbar from '@/components/Navigation/Navbar'
import RecipeUploadForm from '@/components/Recipe/RecipeUploadForm'

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Share Your Recipe</h1>
          <RecipeUploadForm />
        </div>
      </div>
    </main>
  )
} 