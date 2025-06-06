
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
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
  const publicRoutes = ['/', '/events', '/casual-plans', '/login', '/signup'];
  
  // Check if current route starts with a public route (for dynamic routes like /events/:id)
  const isPublicRoute = publicRoutes.some(route => 
    location.pathname === route || 
    (route === '/events' && location.pathname.startsWith('/events/'))
  );

  // Check if we should show the side panel layout (on events and home pages)
  const showSidePanelLayout = location.pathname === '/' || location.pathname === '/events';

  // Handle URL parameters for selected event
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const eventId = searchParams.get('selected');
    setSelectedEventId(eventId);
  }, [location.search]);

  // Update URL when event is selected
  const handleEventSelect = (eventId: string | null) => {
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
          {/* Main content area - takes remaining space */}
          <div className="flex-1 overflow-hidden">
            <main className="h-full overflow-y-auto">
              <Outlet context={{ onEventSelect: handleEventSelect, selectedEventId }} />
            </main>
          </div>
          
          {/* Event side panel - conditional, positioned between main content and social sidebar */}
          {selectedEventId && (
            <EventSidePanel
              eventId={selectedEventId}
              isOpen={!!selectedEventId}
              onClose={() => handleEventSelect(null)}
            />
          )}
          
          {/* Social sidebar - always on the far right */}
          <SocialSidebar />
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
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
