
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
import EditEvent from '@/pages/events/EditEventPage';
import CasualPlans from '@/pages/CasualPlans';
import CreateCasualPlanPage from '@/components/casual-plans/CreateCasualPlanPage';
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
import NotFound from '@/pages/NotFound';
import DesignSystem from '@/pages/DesignSystem';
import SearchPage from '@/pages/SearchPage';
import OrganisePage from '@/pages/OrganisePage';
import { SearchProvider } from '@/contexts/SearchContext';
import AdminPage from '@/pages/AdminPage';
import Dashboard from '@/pages/Dashboard';

function App() {
  return (
    <HelmetProvider>
      <QueryClient>
        <AuthProvider>
          <SearchProvider>
            <BrowserRouter>
              <Routes>
                {/* All routes now use Layout with sticky navigation */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="events" element={<Events />} />
                  <Route path="events/create" element={<CreateEvent />} />
                  <Route path="events/:id" element={<EventDetail />} />
                  <Route path="events/:eventId/edit" element={<EditEvent />} />
                  {/* Add redirect from /event to /events */}
                  <Route path="event" element={<Navigate to="/events" replace />} />
                  <Route path="casual-plans" element={<CasualPlans />} />
                  <Route path="casual-plans/create" element={<CreateCasualPlanPage />} />
                  <Route path="friends" element={<Friends />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="profile/edit" element={<ProfileEdit />} />
                  {/* Update organise route to redirect to dashboard */}
                  <Route path="organise" element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="admin" element={<AdminPage />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                  <Route path="goodbye" element={<GoodbyePage />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<TermsOfService />} />
                  <Route path="cookies" element={<CookiePolicy />} />
                  <Route path="design-system" element={<DesignSystem />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SearchProvider>
          <Toaster />
        </AuthProvider>
      </QueryClient>
    </HelmetProvider>
  );
}

export default App;
