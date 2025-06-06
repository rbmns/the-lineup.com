
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from '@/lib/queryClient';
import Layout from '@/components/Layout';
import LandingPage from '@/pages/LandingPage';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Search from '@/pages/Search';
import CasualPlans from '@/pages/CasualPlans';
import Friends from '@/pages/Friends';
import Profile from '@/pages/Profile';
import ProfilePage from '@/pages/ProfilePage';
import ProfileEdit from '@/pages/ProfileEdit';
import GoodbyePage from '@/pages/GoodbyePage';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="events" element={<Events />} />
                  <Route path="events/:id" element={<EventDetail />} />
                  <Route path="search" element={<Search />} />
                  <Route path="casual-plans" element={<CasualPlans />} />
                  <Route path="friends" element={<Friends />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="profile/edit" element={<ProfileEdit />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/goodbye" element={<GoodbyePage />} />
              </Routes>
              <Toaster />
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
