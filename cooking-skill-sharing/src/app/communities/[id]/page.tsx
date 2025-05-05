'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Define the Community interface
interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  image: string;
  category: string;
  createdAt: string;
  rules: string[];
  moderators: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

// Define Post interface for type safety
interface Post {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  image: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export default function CommunityPage({ params }: { params: { id: string } }) {
  // State for community data
  const [community, setCommunity] = useState<Community>({
    id: params.id,
    name: 'Italian Cooking Enthusiasts',
    description: 'A community for lovers of Italian cuisine. Share recipes, tips, and techniques.',
    memberCount: 1234,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    category: 'Regional Cuisine',
    createdAt: '2024-01-15',
    rules: [
      'Be respectful to all members',
      'Share authentic Italian recipes',
      'Include clear instructions and measurements',
      'Credit original sources when applicable',
    ],
    moderators: [
      {
        id: '1',
        name: 'Chef Maria',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      },
      {
        id: '2',
        name: 'John Rossi',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      },
    ],
  });

  // State for posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: "My Nonna's Pasta Carbonara Recipe",
      author: {
        id: '1',
        name: 'Chef Maria',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      },
      content: "Here's my grandmother's authentic recipe for pasta carbonara...",
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
      likes: 156,
      comments: 23,
      createdAt: '2024-02-20T10:00:00Z',
    },
    {
      id: '2',
      title: 'Tips for Perfect Risotto',
      author: {
        id: '2',
        name: 'John Rossi',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      },
      content: 'After years of making risotto, here are my top tips...',
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
      likes: 89,
      comments: 12,
      createdAt: '2024-02-19T15:30:00Z',
    },
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Community Header */}
      <div className="relative h-64 w-full">
        <Image
          src={community.image}
          alt={community.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl font-bold">{community.name}</h1>
            <p className="mt-2 text-lg">{community.description}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Create Post Button */}
            <div className="mb-8">
              <Link
                href={`/communities/${community.id}/create-post`}
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <svg
                  className="mr-2 h-5 w-5"
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
                Create a Post
              </Link>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="overflow-hidden rounded-lg bg-white shadow-sm"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-center">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium">{post.author.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                    <p className="mb-4 text-gray-600">{post.content}</p>
                    <div className="relative h-64 w-full overflow-hidden rounded-lg">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
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
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
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
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Info */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">About Community</h2>
              <div className="mb-4">
                <p className="text-gray-600">{community.description}</p>
              </div>
              <div className="mb-4">
                <div className="flex items-center text-gray-500">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>{community.memberCount.toLocaleString()} members</span>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-medium">Community Rules</h3>
                <ul className="list-inside list-disc space-y-1 text-gray-600">
                  {community.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Moderators */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Moderators</h2>
              <div className="space-y-4">
                {community.moderators.map((moderator) => (
                  <div key={moderator.id} className="flex items-center">
                    <Image
                      src={moderator.avatar}
                      alt={moderator.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="font-medium">{moderator.name}</h3>
                      <p className="text-sm text-gray-500">Moderator</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 