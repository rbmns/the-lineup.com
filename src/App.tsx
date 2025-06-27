
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import ProfilePage from '@/pages/ProfilePage';
import ProfileEdit from '@/pages/ProfileEdit';
import Events from '@/pages/Events';
import EventDetailPage from '@/pages/events/EventDetailPage';
import CreateEvent from '@/pages/events/create';
import OrganisePage from '@/pages/OrganisePage';
import CreateVenuePage from '@/pages/CreateVenuePage';
import CasualPlans from '@/pages/CasualPlans';
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
            <Route path="/profile/edit" element={<Layout><ProfileEdit /></Layout>} />
            <Route path="/events" element={<Layout><Events /></Layout>} />
            <Route path="/events/:eventId" element={<Layout><EventDetailPage /></Layout>} />
            <Route path="/events/create" element={<Layout><CreateEvent /></Layout>} />
            <Route path="/organise" element={<Layout><OrganisePage /></Layout>} />
            <Route path="/venues/create" element={<Layout><CreateVenuePage /></Layout>} />
            <Route path="/casual-plans" element={<Layout><CasualPlans /></Layout>} />
            <Route path="/casual-plans/create" element={<Layout><CreateCasualPlanPage /></Layout>} />
            <Route path="/events/create-simple" element={<CreateEventSimple />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
