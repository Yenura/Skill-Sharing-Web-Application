import Navbar from '@/components/Navigation/Navbar'
import ProfileHeader from '@/components/Profile/ProfileHeader'
import ProfileTabs from '@/components/Profile/ProfileTabs'

export default function ProfilePage() {
  // This would typically come from an API
  const mockUser = {
    id: 1,
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    bio: 'Passionate home chef sharing recipes and cooking tips. Love experimenting with different cuisines!',
    followers: 1200,
    following: 350,
    cookingInterests: ['Italian', 'Asian', 'Baking', 'Mediterranean'],
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24">
        <ProfileHeader user={mockUser} />
        <ProfileTabs userId={mockUser.id} />
      </div>
    </main>
  )
} 