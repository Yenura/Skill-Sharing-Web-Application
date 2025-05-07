import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Auth from './components/auth/Auth';
// import Post from './components/auth/Post';
import Profile from './components/profile/Profile';
import Dashboard from './components/dashboard/Dashboard';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './config/AuthContext.jsx';
import Messaging from './components/messaging/Messaging';
import SinglePostView from './components/post/SinglePostView';
import CreateLearningPlan from './components/profile/components/CreateLearningPlan';
import ViewLearningPlans from './components/profile/components/ViewLearningPlans';
import EditLearningPlan from './components/profile/components/EditLearningPlan';
import ViewAllLearningPlans from './components/profile/components/ViewAllLearningPlans';
import OtherLearningPlans from './components/profile/components/OtherLearningPlans';

// Community Components
import Communities from './components/community/Communities';
import CommunityDetail from './components/community/CommunityDetail';
import CreateCommunity from './components/community/CreateCommunity';
import ChallengeDetail from './components/community/ChallengeDetail';

// Configure router with future flags to resolve warnings
const router = createBrowserRouter(
  [
    { path: "/auth", element: <Auth /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/profile", element: <Profile /> },
    { path: "/profile/:userId", element: <Profile /> },
    { path: "/messages", element: <Messaging /> },
    { path: "/messages/:userId", element: <Messaging /> },
    { path: "/post/:postId", element: <SinglePostView /> },
    { path: "/", element: <Navigate to="/auth" replace /> },
    { path: "/learning-plans/my-plans", element: <ViewLearningPlans /> },
    { path: "/learning-plans/create", element: <CreateLearningPlan /> },
    { path: "/learning-plans/edit/:id", element: <EditLearningPlan /> },
    { path: "/learning-plans", element: <ViewAllLearningPlans /> },
    { path: "/learning-plans/followed", element: <OtherLearningPlans /> },
    { path: "/communities", element: <Communities /> },
    { path: "/communities/:communityId", element: <CommunityDetail /> },
    { path: "/communities/create", element: <CreateCommunity /> },
    { path: "/challenges/:challengeId", element: <ChallengeDetail /> }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_prependBasename: true
    }
  }
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
