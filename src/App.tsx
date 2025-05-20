
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { FilterStateProvider } from '@/contexts/FilterStateContext';
import { queryClient } from '@/lib/queryClient';

// Import routes
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import EventsPageRefactored from './pages/EventsPageRefactored';
import Admin from './pages/Admin';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <FilterStateProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-background">
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/events" element={<EventsPageRefactored />} />
                    <Route path="/events/:eventId" element={<EventDetail />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:userId" element={<UserProfile />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </div>
            </Router>
          </FilterStateProvider>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
