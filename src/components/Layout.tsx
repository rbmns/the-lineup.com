
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import LeftSidebar from "@/components/nav/LeftSidebar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { EventDetailContent } from "@/components/events/EventDetailContent";
import { EventDetailHeader } from "@/components/events/EventDetailHeader";
import { useQuery } from '@tanstack/react-query';
import { fetchEventById } from '@/lib/eventService';

const Layout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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
          // For other pages (home, etc.), use the global overlay
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

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      {/* Fixed Navigation - Always at top */}
      <MainNav />
      
      {/* Main Layout Container */}
      <div className="flex w-full min-h-screen">
        {/* Left sidebar - Desktop only */}
        {!isMobile && (
          <div className="fixed left-0 top-16 bottom-0 w-20 bg-white border-r border-gray-200 z-30">
            <LeftSidebar />
          </div>
        )}
        
        {/* Main Content Area - No padding */}
        <div 
          className={`flex-1 w-full min-h-screen ${
            isMobile 
              ? 'pt-16 pb-20' // Mobile: account for nav + bottom nav
              : 'pt-16 ml-20' // Desktop: account for top nav + left sidebar
          }`}
        >
          <main className="bg-white w-full min-h-full">
            <Outlet context={{ onEventSelect: handleEventSelect, selectedEventId }} />
          </main>
          
          {/* Footer - Desktop only */}
          {!isMobile && <Footer />}
        </div>
      </div>

      {/* Event Overlays */}
      {/* Event Side Panel - ONLY for /events page on desktop */}
      {selectedEventId && location.pathname === '/events' && !isMobile && (
        <EventSidePanel 
          eventId={selectedEventId}
          onClose={() => handleEventSelect(null)}
        />
      )}

      {/* Global Event Detail Overlay - for pages OTHER than /events and event detail pages */}
      {globalEventOverlay && location.pathname !== '/events' && !isEventDetailPage && (
        <GlobalEventOverlay 
          eventId={globalEventOverlay}
          onClose={handleCloseGlobalOverlay}
          isMobile={isMobile}
        />
      )}

      {/* Mobile Event Detail Overlay for /events page */}
      {selectedEventId && location.pathname === '/events' && isMobile && (
        <MobileEventOverlay 
          eventId={selectedEventId}
          onClose={() => handleEventSelect(null)}
        />
      )}

      {/* URL-based Event Detail Overlay - only show if we're on an event detail URL */}
      {isEventDetailPage && location.pathname !== '/events' && !globalEventOverlay && (
        <URLEventOverlay 
          onClose={() => navigate(-1)}
          isMobile={isMobile}
        />
      )}

      {/* Mobile Navigation - Fixed to bottom */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
          <LeftSidebar />
        </div>
      )}

      <Toaster />
      <CookieConsent />
    </div>
  );
};

// Event Side Panel Component for /events page on desktop
const EventSidePanel: React.FC<{ eventId: string; onClose: () => void }> = ({ eventId, onClose }) => (
  <div 
    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
    style={{ 
      top: '64px',
      bottom: '0',
      left: '80px',
      right: '0'
    }}
    onClick={onClose}
  >
    <div className="w-full h-full flex items-center justify-center p-6">
      <div 
        className="bg-white rounded-xl w-full max-w-4xl h-[90vh] overflow-hidden relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="h-full overflow-y-auto">
          <EventDetailOverlay eventId={eventId} />
        </div>
      </div>
    </div>
  </div>
);

// Global Event Overlay Component for other pages
const GlobalEventOverlay: React.FC<{ eventId: string; onClose: () => void; isMobile: boolean }> = ({ eventId, onClose, isMobile }) => (
  <div 
    className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm ${
      isMobile ? 'p-2' : 'p-6'
    }`}
    style={{ 
      top: isMobile ? '64px' : '64px',
      bottom: isMobile ? '80px' : '0',
      left: isMobile ? '0' : '80px',
      right: '0'
    }}
    onClick={onClose}
  >
    <div className="w-full h-full flex items-center justify-center">
      <div 
        className={`bg-white rounded-xl w-full overflow-hidden relative shadow-2xl ${
          isMobile 
            ? 'h-full max-w-full rounded-lg' 
            : 'max-w-4xl h-[90vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="h-full overflow-y-auto">
          <EventDetailOverlay eventId={eventId} />
        </div>
      </div>
    </div>
  </div>
);

// Mobile Event Overlay Component for /events page
const MobileEventOverlay: React.FC<{ eventId: string; onClose: () => void }> = ({ eventId, onClose }) => (
  <div className="fixed inset-0 z-50 bg-white" style={{ top: '64px', bottom: '80px' }}>
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-lg">Event Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <EventDetailOverlay eventId={eventId} />
      </div>
    </div>
  </div>
);

// URL Event Overlay Component for event detail URLs
const URLEventOverlay: React.FC<{ onClose: () => void; isMobile: boolean }> = ({ onClose, isMobile }) => (
  <div 
    className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm ${
      isMobile ? 'p-2' : 'p-6'
    }`}
    style={{ 
      top: isMobile ? '64px' : '64px',
      bottom: isMobile ? '80px' : '0',
      left: isMobile ? '0' : '80px',
      right: '0'
    }}
  >
    <div className="w-full h-full flex items-center justify-center">
      <div 
        className={`bg-white rounded-xl w-full overflow-hidden relative shadow-2xl ${
          isMobile 
            ? 'h-full max-w-full rounded-lg' 
            : 'max-w-4xl h-[90vh]'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  </div>
);

// Component for event detail overlay - consistent across all pages
const EventDetailOverlay: React.FC<{ eventId: string }> = ({ eventId }) => {
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEventById(eventId),
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-48 md:h-64 bg-gray-200 rounded mb-6"></div>
          <div className="px-4 md:px-6 pb-6 text-left">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-full text-left px-4 md:px-6 py-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
        <p className="text-gray-600 text-sm md:text-base">The event you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      <EventDetailHeader 
        event={event}
        eventType={event.event_category || ''}
        title={event.title}
        showTitleOverlay={false}
      />
      <div className="w-full text-left px-4 md:px-6 py-4 md:py-6">
        <EventDetailContent 
          event={event}
          isOwner={false}
        />
      </div>
    </div>
  );
};

export default Layout;
