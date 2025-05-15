
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Pages
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Friends from './pages/Friends';
import EventsPageRefactored from './pages/EventsPageRefactored'; // Updated import
import EventDetail from './pages/EventDetail';
import Explore from './pages/Explore';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import UserProfilePage from './pages/UserProfilePage';
import GoodbyePage from './pages/GoodbyePage';
import AdminSettings from './pages/AdminSettings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import VenueEvents from './pages/VenueEvents'; // Add this import

// Components
import { AuthProvider } from './contexts/AuthContext';
import { CookieConsent } from './components/CookieConsent';
import Layout from './components/Layout';

const App = () => {
  return (
    <AuthProvider>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Use refactored EventsPage as the homepage */}
            <Route index element={<EventsPageRefactored />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<ProfileEdit />} />
            <Route path="friends" element={<Friends />} />
            
            {/* Event routes - multiple formats for compatibility */}
            <Route path="events" element={<EventsPageRefactored />} />
            {/* SEO-friendly event routes */}
            <Route path="events/:destination/:eventSlug" element={<EventDetail />} />
            <Route path="events/:eventSlug" element={<EventDetail />} /> {/* New SEO-friendly route */}
            <Route path="e/:eventSlug" element={<EventDetail />} />
            <Route path="events/:eventId" element={<EventDetail />} />
            
            {/* Venue route - SEO-friendly */}
            <Route path="venues/:venueSlug" element={<VenueEvents />} />
            
            {/* New filter-based URL structure */}
            <Route path="destinations/:destination/events" element={<EventsPageRefactored />} />
            <Route path="destinations/:destination/events/:eventType" element={<EventsPageRefactored />} />
            
            <Route path="map" element={<Explore />} />
            <Route path="login" element={<Login />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="users/:userId" element={<UserProfilePage />} />
            <Route path="goodbye" element={<GoodbyePage />} />
            <Route path="admin/settings" element={<AdminSettings />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster position="top-center" richColors />
        <CookieConsent />
      </div>
    </AuthProvider>
  );
};

export default App;
