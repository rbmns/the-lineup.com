import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { FilterStateProvider } from '@/contexts/FilterStateContext';
import { Toaster } from '@/components/ui/sonner';
import { HelmetProvider } from 'react-helmet-async';
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CreatorGuard } from '@/components/auth/CreatorGuard';

// Lazy load components
const Home = lazy(() => import('@/pages/Home'));
const Events = lazy(() => import('@/pages/Events'));
const CreateEvent = lazy(() => import('@/pages/CreateEvent'));
const EventDetail = lazy(() => import('@/pages/EventDetail'));
const CasualPlans = lazy(() => import('@/pages/CasualPlans'));
const CreateCasualPlanPage = lazy(() => import('@/components/casual-plans/CreateCasualPlanPage'));
const OrganisePage = lazy(() => import('@/pages/OrganisePage'));
const Friends = lazy(() => import('@/pages/Friends'));
const Profile = lazy(() => import('@/pages/Profile'));
const PublicProfile = lazy(() => import('@/pages/PublicProfile'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Log the current environment
    console.log("Current Environment:", process.env.NODE_ENV);
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SearchProvider>
              <FilterStateProvider>
                <Router>
                  <Layout>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/create" element={
                          <CreatorGuard>
                            <CreateEvent />
                          </CreatorGuard>
                        } />
                        <Route path="/events/:id" element={<EventDetail />} />
                        <Route path="/casual-plans" element={<CasualPlans />} />
                        <Route path="/casual-plans/create" element={<CreateCasualPlanPage />} />
                        <Route path="/organise" element={<OrganisePage />} />
                        <Route path="/friends" element={<Friends />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:username" element={<PublicProfile />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                      </Routes>
                    </Suspense>
                  </Layout>
                </Router>
                <Toaster />
              </FilterStateProvider>
            </SearchProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
