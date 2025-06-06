
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

  // Check if we're on an event detail page
  const isEventDetailPage = location.pathname.startsWith('/events/') && location.pathname !== '/events';

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

  // Global event overlay handler for all pages
  const [globalEventOverlay, setGlobalEventOverlay] = useState<string | null>(null);

  // Listen for global event clicks
  useEffect(() => {
    const handleEventCardClick = (event: CustomEvent) => {
      const eventId = event.detail.eventId;
      if (eventId) {
        setGlobalEventOverlay(eventId);
      }
    };

    window.addEventListener('eventCardClicked', handleEventCardClick as EventListener);
    
    return () => {
      window.removeEventListener('eventCardClicked', handleEventCardClick as EventListener);
    };
  }, []);

  // Close global overlay
  const handleCloseGlobalOverlay = () => {
    setGlobalEventOverlay(null);
  };
  
  useEffect(() => {
    // Only redirect to login if user is not authenticated AND trying to access a protected route
    if (!loading && !user && !isPublicRoute) {
      navigate('/login');
    }
  }, [user, loading, navigate, location, isPublicRoute]);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left sidebar */}
        <LeftSidebar />
        
        {/* Main content area */}
        <div className="flex-1 overflow-hidden relative">
          <main className="h-full overflow-y-auto">
            <Outlet context={{ onEventSelect: handleEventSelect, selectedEventId }} />
          </main>
        </div>
        
        {/* Event side panel - positioned on the right for /events page */}
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

      {/* Global Event Detail Overlay - covers 95% of main content area */}
      {globalEventOverlay && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="flex h-full">
            {/* Left sidebar space */}
            <div className="w-20" />
            
            {/* Main overlay content - 95% of remaining space */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-[95%] h-[90vh] overflow-hidden relative shadow-2xl">
                <button
                  onClick={handleCloseGlobalOverlay}
                  className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="h-full overflow-y-auto">
                  <iframe 
                    src={`/events/${globalEventOverlay}`} 
                    className="w-full h-full border-0"
                    title="Event Details"
                  />
                </div>
              </div>
            </div>
            
            {/* Social sidebar space */}
            <div className="w-80" />
          </div>
        </div>
      )}

      {/* Event Detail Overlay for URL-based navigation */}
      {isEventDetailPage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="flex h-full">
            {/* Left sidebar space */}
            <div className="w-20" />
            
            {/* Main overlay content - 95% of remaining space */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-[95%] h-[90vh] overflow-hidden relative shadow-2xl">
                <button
                  onClick={() => navigate('/events')}
                  className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="h-full overflow-y-auto">
                  <Outlet />
                </div>
              </div>
            </div>
            
            {/* Social sidebar space */}
            <div className="w-80" />
          </div>
        </div>
      )}

      <Footer />
      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
