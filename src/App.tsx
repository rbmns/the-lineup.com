
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import Layout from '@/components/Layout';

// Lazy load pages - using existing page names
const Events = lazy(() => import("./pages/Events"));
const CasualPlans = lazy(() => import("./pages/CasualPlans"));
const Friends = lazy(() => import("./pages/Friends"));
const Search = lazy(() => import("./pages/Search"));
const Login = lazy(() => import("./pages/Login"));

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Events />} />
                      <Route path="events" element={<Events />} />
                      <Route path="casual-plans" element={<CasualPlans />} />
                      <Route path="friends" element={<Friends />} />
                      <Route path="search" element={<Search />} />
                      <Route path="login" element={<Login />} />
                    </Route>
                  </Routes>
                </Suspense>
                <Toaster />
              </div>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
