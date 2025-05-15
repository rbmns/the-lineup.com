
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import EventDetail from './pages/EventDetail';
import EventsPageRefactored from './pages/EventsPageRefactored';
import Friends from './pages/Friends';
import UserProfilePage from './pages/UserProfilePage';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import Index from './pages/Index';
import Login from './pages/Login';  // Added import for Login page

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />  {/* Standalone route for login */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/events" element={<EventsPageRefactored />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/users/:userId" element={<UserProfilePage />} />
            
            {/* Not Found Route - fallback for all other routes */}
            <Route path="*" element={<EventsPageRefactored />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
