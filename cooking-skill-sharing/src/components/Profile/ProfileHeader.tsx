import Image from 'next/image'
import { UserPlusIcon } from '@heroicons/react/24/outline'

interface ProfileHeaderProps {
  user: {
    id: number
    name: string
    avatar: string
    bio: string
    followers: number
    following: number
    cookingInterests: string[]
  }
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative h-32 w-32 rounded-full overflow-hidden">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mt-1">{user.bio}</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Follow
            </button>
          </div>

          <div className="mt-4 flex items-center gap-6">
            <div>
              <span className="text-lg font-semibold text-gray-900">
                {user.followers.toLocaleString()}
              </span>
              <span className="text-gray-600 ml-1">Followers</span>
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900">
                {user.following.toLocaleString()}
              </span>
              <span className="text-gray-600 ml-1">Following</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {user.cookingInterests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 