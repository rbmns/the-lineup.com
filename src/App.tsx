
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { FilterStateProvider } from '@/contexts/FilterStateContext';
import { queryClient } from '@/lib/queryClient';

// Import routes
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Users from './pages/Users';
import UserProfilePage from './pages/UserProfilePage';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import EventsPageRefactored from './pages/EventsPageRefactored';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import ProfileSettings from './pages/ProfileSettings';
import Friends from './pages/Friends';
import Index from './pages/Index';
import DesignSystem from './pages/DesignSystem';
import GoodbyePage from './pages/GoodbyePage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <FilterStateProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-background">
                <Routes>
                  {/* Add the GoodbyePage route outside of the Layout */}
                  <Route path="/goodbye" element={<GoodbyePage />} />
                  
                  <Route element={<Layout />}>
                    {/* Put the root route inside the Layout */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/events" element={<EventsPageRefactored />} />
                    <Route path="/events/:eventId" element={<EventDetail />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:userId" element={<UserProfilePage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                    <Route path="/profile/settings" element={<ProfileSettings />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/design-system" element={<DesignSystem />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </div>
            </Router>
          </FilterStateProvider>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
