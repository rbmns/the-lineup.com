
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient } from '@/components/query-client';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import CreateEvent from '@/pages/events/create';
import Admin from '@/pages/Admin';
import CasualPlans from '@/pages/CasualPlans';
import Friends from '@/pages/Friends';
import ProfilePage from '@/pages/ProfilePage';
import ProfileEdit from '@/pages/ProfileEdit';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import GoodbyePage from '@/pages/GoodbyePage';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <QueryClient>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* All routes now use Layout with sticky navigation */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="events" element={<Events />} />
                <Route path="events/create" element={<CreateEvent />} />
                <Route path="events/:id" element={<EventDetail />} />
                <Route path="casual-plans" element={<CasualPlans />} />
                <Route path="friends" element={<Friends />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/edit" element={<ProfileEdit />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="goodbye" element={<GoodbyePage />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsOfService />} />
                <Route path="cookies" element={<CookiePolicy />} />
                <Route path="admin" element={<Admin />} />
              </Route>
              
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </QueryClient>
    </HelmetProvider>
  );
}

export default App;
