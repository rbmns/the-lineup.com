import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import SignupPage from './pages/SignupPage';
import AccountSettings from './pages/AccountSettings';
import UserManagementPage from './pages/UserManagementPage';
import FriendshipPage from './pages/FriendshipPage';
import DestinationEventsPage from './pages/DestinationEventsPage';
import DestinationDetail from './pages/DestinationDetail';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import NotFoundPage from './pages/NotFoundPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { ScrollToTop } from './components/ScrollToTop';
import EventsPageRefactored from './pages/EventsPageRefactored';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <SiteHeader />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPageRefactored />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/profiles/:username" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              <Route path="/destinations/:destination/events" element={<DestinationEventsPage />} />
              <Route path="/destinations/:destination/events/:eventType" element={<DestinationEventsPage />} />
              <Route path="/destinations/:destination" element={<DestinationDetail />} />
              
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/friendships" 
                element={
                  <ProtectedRoute>
                    <FriendshipPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events/create" 
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events/edit/:eventId" 
                element={
                  <ProtectedRoute>
                    <EditEvent />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <UserManagementPage />
                  </AdminRoute>
                } 
              />
              
              {/* Not Found Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <SiteFooter />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
