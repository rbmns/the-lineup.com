import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import ProfilePage from '@/pages/ProfilePage';
import EditProfilePage from '@/pages/EditProfilePage';
import Events from '@/pages/Events';
import EventDetailPage from '@/pages/EventDetailPage';
import CreateEvent from '@/pages/events/create';
import OrganisePage from '@/pages/OrganisePage';
import CreateVenuePage from '@/pages/CreateVenuePage';
import CasualPlansPage from '@/pages/CasualPlansPage';
import CreateCasualPlanPage from '@/components/casual-plans/CreateCasualPlanPage';
import CreateEventSimple from '@/pages/CreateEventSimple';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/profile/:userId" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/profile/edit" element={<Layout><EditProfilePage /></Layout>} />
            <Route path="/events" element={<Layout><Events /></Layout>} />
            <Route path="/events/:eventId" element={<Layout><EventDetailPage /></Layout>} />
            <Route path="/events/create" element={<Layout><CreateEvent /></Layout>} />
            <Route path="/organise" element={<Layout><OrganisePage /></Layout>} />
            <Route path="/venues/create" element={<Layout><CreateVenuePage /></Layout>} />
            <Route path="/casual-plans" element={<Layout><CasualPlansPage /></Layout>} />
            <Route path="/casual-plans/create" element={<Layout><CreateCasualPlanPage /></Layout>} />
            <Route path="/events/create-simple" element={<CreateEventSimple />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
