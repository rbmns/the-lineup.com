
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
          <Layout />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
