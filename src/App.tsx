
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import LandingPage from '@/pages/LandingPage';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import Profile from '@/pages/Profile';
import Friends from '@/pages/Friends';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import { AuthProvider } from '@/contexts/AuthContext';
import CasualPlans from '@/pages/CasualPlans';
import CasualPlanDetail from '@/pages/CasualPlanDetail';
import GoodbyePage from '@/pages/GoodbyePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:eventId" element={<EventDetail />} />
              <Route path="events/:destination/:eventSlug" element={<EventDetail />} />
              <Route path="casual-plans" element={<CasualPlans />} />
              <Route path="casual-plans/:planId" element={<CasualPlanDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="friends" element={<Friends />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="goodbye" element={<GoodbyePage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
