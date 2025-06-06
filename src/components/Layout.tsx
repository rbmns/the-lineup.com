
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import LeftSidebar from "@/components/nav/LeftSidebar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { EventSidePanel } from "@/components/events/EventSidePanel";
import { SocialSidebar } from "@/components/social/SocialSidebar";

const Layout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Define which routes should be accessible without authentication
  const publicRoutes = ['/', '/events', '/casual-plans', '/login', '/signup', '/search'];
  
  // Check if current route starts with a public route (for dynamic routes like /events/:id)
  const isPublicRoute = publicRoutes.some(route => 
    location.pathname === route || 
    (route === '/events' && location.pathname.startsWith('/events/')) ||
    (route === '/search' && location.pathname.startsWith('/search'))
  );

  // Always show the side panel layout for consistency
  const showSidePanelLayout = true;

  // Handle URL parameters for selected event on /events page
  useEffect(() => {
    if (location.pathname === '/events') {
      const searchParams = new URLSearchParams(location.search);
      const eventId = searchParams.get('selected');
      setSelectedEventId(eventId);
    } else {
      setSelectedEventId(null);
    }
  }, [location.search, location.pathname]);

  // Update URL when event is selected on /events page
  const handleEventSelect = (eventId: string | null) => {
    if (location.pathname !== '/events') return;
    
    setSelectedEventId(eventId);
    const searchParams = new URLSearchParams(location.search);
    
    if (eventId) {
      searchParams.set('selected', eventId);
    } else {
      searchParams.delete('selected');
    }
    
    const newUrl = searchParams.toString() ? 
      `${location.pathname}?${searchParams.toString()}` : 
      location.pathname;
    
    navigate(newUrl, { replace: true });
  };
  
  useEffect(() => {
    // Only redirect to login if user is not authenticated AND trying to access a protected route
    if (!loading && !user && !isPublicRoute) {
      navigate('/login');
    }
  }, [user, loading, navigate, location, isPublicRoute]);

  if (showSidePanelLayout) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left sidebar */}
          <LeftSidebar />
          
          {/* Main content area - adjusts width when overlay is open */}
          <div className={`flex-1 overflow-hidden relative transition-all duration-300 ${
            selectedEventId && location.pathname === '/events' ? 'mr-[800px]' : ''
          }`}>
            <main className="h-full overflow-y-auto">
              <Outlet context={{ onEventSelect: handleEventSelect, selectedEventId }} />
            </main>
          </div>
          
          {/* Event side panel - positioned on the right */}
          {selectedEventId && location.pathname === '/events' && (
            <EventSidePanel
              eventId={selectedEventId}
              isOpen={!!selectedEventId}
              onClose={() => handleEventSelect(null)}
            />
          )}
          
          {/* Social sidebar - always on the far right */}
          <SocialSidebar selectedEventId={location.pathname === '/events' ? selectedEventId : undefined} />
        </div>
        <Footer />
        <Toaster />
        <CookieConsent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1">
          <Outlet />
        </main>
        {/* Social sidebar on all pages */}
        <SocialSidebar />
      </div>
      <Footer />
      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
