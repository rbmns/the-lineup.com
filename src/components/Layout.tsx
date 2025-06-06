import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import LeftSidebar from "@/components/nav/LeftSidebar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { SocialSidebar } from "@/components/social/SocialSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Calendar, Coffee, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventDetail from "@/pages/EventDetail";

const Layout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [socialSidebarVisible, setSocialSidebarVisible] = useState(true);

  // Define which routes should be accessible without authentication
  const publicRoutes = ['/', '/events', '/casual-plans', '/search', '/privacy', '/terms', '/cookies'];
  
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

  // Global event overlay handler - for pages other than /events
  const [globalEventOverlay, setGlobalEventOverlay] = useState<string | null>(null);

  // Listen for global event clicks
  useEffect(() => {
    const handleEventCardClick = (event: CustomEvent) => {
      const eventId = event.detail.eventId;
      if (eventId) {
        // If we're on the /events page, use the side panel
        if (location.pathname === '/events') {
          handleEventSelect(eventId);
        } else {
          // For other pages (home, search, etc.), use the global overlay
          setGlobalEventOverlay(eventId);
        }
      }
    };

    window.addEventListener('eventCardClicked', handleEventCardClick as EventListener);
    
    return () => {
      window.removeEventListener('eventCardClicked', handleEventCardClick as EventListener);
    };
  }, [location.pathname]);

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

  // Calculate layout dimensions
  const topNavHeight = isMobile ? 'h-[104px]' : 'h-16'; // Mobile has 2 rows
  const leftSidebarWidth = isMobile ? 'w-0' : 'w-20';
  const socialSidebarWidth = !isMobile && socialSidebarVisible ? 'w-64' : 'w-0';

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Full-width top navigation */}
      <div className="w-full">
        <MainNav />
      </div>
      
      <div className="flex w-full">
        {/* Left sidebar - fixed, always visible on desktop */}
        {!isMobile && (
          <div className={`fixed left-0 top-16 bottom-0 w-20 bg-white border-r border-gray-200 z-30`}>
            <LeftSidebar />
          </div>
        )}
        
        {/* Main content area - full width between sidebars */}
        <div 
          className={`flex-1 w-full ${
            isMobile ? 'pt-[104px]' : 'pt-16 ml-20'
          } ${
            !isMobile && socialSidebarVisible ? 'mr-64' : ''
          }`}
        >
          <main className="bg-white w-full">
            <Outlet context={{ onEventSelect: handleEventSelect, selectedEventId }} />
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
        
        {/* Social sidebar - fixed on the right, positioned below top nav */}
        {!isMobile && (
          <div className={`fixed right-0 top-16 bottom-0 ${socialSidebarVisible ? 'w-64' : 'w-0'} z-30`}>
            <SocialSidebar 
              visible={socialSidebarVisible}
              onToggleVisibility={() => setSocialSidebarVisible(!socialSidebarVisible)}
            />
          </div>
        )}
      </div>

      {/* Event Side Panel - ONLY for /events page on desktop */}
      {selectedEventId && location.pathname === '/events' && !isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          style={{ 
            top: '64px',
            bottom: '0',
            left: '80px',
            right: socialSidebarVisible ? '256px' : '0'
          }}
        >
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl h-[95%] overflow-hidden relative shadow-2xl">
              <button
                onClick={() => handleEventSelect(null)}
                className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="h-full overflow-y-auto">
                <EventDetail eventId={selectedEventId} showBackButton={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Event Detail Overlay - for pages OTHER than /events and NOT for URL-based event pages */}
      {globalEventOverlay && location.pathname !== '/events' && !isEventDetailPage && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          style={{ 
            top: '64px',
            bottom: '0',
            left: isMobile ? '0' : '80px',
            right: isMobile ? '0' : (socialSidebarVisible ? '256px' : '0')
          }}
        >
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl h-[95%] overflow-hidden relative shadow-2xl">
              <button
                onClick={handleCloseGlobalOverlay}
                className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="h-full overflow-y-auto">
                <EventDetail eventId={globalEventOverlay} showBackButton={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Event Detail Overlay for /events page */}
      {selectedEventId && location.pathname === '/events' && isMobile && (
        <div className="fixed inset-0 z-50 bg-white" style={{ top: '104px', bottom: '80px' }}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <h2 className="font-semibold text-lg">Event Details</h2>
              <button
                onClick={() => handleEventSelect(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EventDetail eventId={selectedEventId} showBackButton={false} />
            </div>
          </div>
        </div>
      )}

      {/* URL-based Event Detail Overlay - only show if we're on an event detail URL and NOT on /events page */}
      {isEventDetailPage && location.pathname !== '/events' && !globalEventOverlay && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          style={{ 
            top: '64px',
            bottom: '0',
            left: isMobile ? '0' : '80px',
            right: isMobile ? '0' : (socialSidebarVisible ? '256px' : '0')
          }}
        >
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl h-[95%] overflow-hidden relative shadow-2xl">
              <button
                onClick={() => navigate(-1)}
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
        </div>
      )}

      {/* Mobile Navigation - sticky bottom navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex items-center justify-around py-2">
            <Link
              to="/search"
              className={`flex flex-col items-center p-2 ${
                location.pathname === '/search' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Search className="h-5 w-5" />
              <span className="text-xs mt-1">Search</span>
            </Link>
            <Link
              to="/events"
              className={`flex flex-col items-center p-2 ${
                location.pathname === '/events' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs mt-1">Events</span>
            </Link>
            <Link
              to="/casual-plans"
              className={`flex flex-col items-center p-2 ${
                location.pathname === '/casual-plans' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Coffee className="h-5 w-5" />
              <span className="text-xs mt-1">Plans</span>
            </Link>
            <Link
              to="/friends"
              className={`flex flex-col items-center p-2 ${
                location.pathname === '/friends' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">Friends</span>
            </Link>
          </div>
        </div>
      )}

      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
