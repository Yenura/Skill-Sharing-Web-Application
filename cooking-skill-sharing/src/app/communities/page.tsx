import Image from 'next/image'
import Link from 'next/link'

// Mock data - replace with API call
const communities = [
  {
    id: '1',
    name: 'Italian Cooking Enthusiasts',
    description: 'A community for lovers of Italian cuisine. Share recipes, tips, and techniques.',
    memberCount: 1234,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    category: 'Regional Cuisine',
  },
  {
    id: '2',
    name: 'Vegan Kitchen',
    description: 'Plant-based cooking community. Share vegan recipes and cooking tips.',
    memberCount: 856,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    category: 'Dietary Preference',
  },
  {
    id: '3',
    name: 'Baking Masters',
    description: 'For those who love to bake. Share your sweet and savory creations.',
    memberCount: 2103,
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d',
    category: 'Cooking Method',
  },
  {
    id: '4',
    name: 'Asian Cuisine',
    description: 'Explore the diverse flavors of Asian cooking. From street food to fine dining.',
    memberCount: 1567,
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa',
    category: 'Regional Cuisine',
  },
]

const categories = [
  'All',
  'Regional Cuisine',
  'Dietary Preference',
  'Cooking Method',
  'Skill Level',
  'Special Occasions',
]

export default function CommunitiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Cooking Communities</h1>
          <p className="mt-2 text-gray-600">
            Join communities of fellow cooking enthusiasts and share your culinary journey.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Link
              key={community.id}
              href={`/communities/${community.id}`}
              className="group block overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-48">
                <Image
                  src={community.image}
                  alt={community.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {community.category}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold group-hover:text-blue-600">
                  {community.name}
                </h3>
                <p className="mb-4 text-gray-600">{community.description}</p>
                <div className="flex items-center text-sm text-gray-500">
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
            </Link>
          ))}
        </div>

        {/* Create Community Button */}
        <div className="mt-8 text-center">
          <Link
            href="/communities/create"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
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
            Create a Community
          </Link>
        </div>
      </div>
    </main>
  )
} 