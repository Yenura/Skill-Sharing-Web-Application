import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './components/Admin/AdminLayout'
import SystemAnnouncements from './components/Admin/SystemAnnouncements'
import UserManagement from './components/Admin/UserManagement'

// Create placeholder components for other admin sections
const ContentModeration = () => <div>Content Moderation Coming Soon</div>
const FeaturedContent = () => <div>Featured Content Coming Soon</div>
const Analytics = () => <div>Analytics Coming Soon</div>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Other app routes */}
        // ...existing code...

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<SystemAnnouncements />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="moderation" element={<ContentModeration />} />
          <Route path="featured" element={<FeaturedContent />} />
          <Route path="announcements" element={<SystemAnnouncements />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App