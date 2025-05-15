
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainNav from './MainNav';
import { Footer } from './ui/footer';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";

const Layout: React.FC = () => {
  const location = useLocation();
  const { loading: authLoading } = useAuth();
  const isHomePage = location.pathname === '/';
  const isLoginOrGoodbye = location.pathname === '/login' || location.pathname === '/goodbye';
  
  // Add console logging for debugging
  React.useEffect(() => {
    console.log('Layout rendering, current route:', location.pathname, 'Auth loading:', authLoading);
  }, [location.pathname, authLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <main className="flex-1">
        {authLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple mx-auto" />
              <p className="mt-4 text-gray-600">Loading your profile...</p>
            </div>
          </div>
        ) : (
          <React.Suspense fallback={
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple border-r-transparent align-[-0.125em]" />
                <p className="mt-4 text-gray-600">Loading content...</p>
              </div>
            </div>
          }>
            <Outlet />
          </React.Suspense>
        )}
      </main>
      
      {/* Only show footer on certain pages */}
      {!isLoginOrGoodbye && <Footer />}
      
      {/* Add Toaster component for notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;
