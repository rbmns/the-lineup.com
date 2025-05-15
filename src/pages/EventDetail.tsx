
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventMetaTags } from '@/hooks/useEventMetaTags';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { EventDetailLoadingState } from '@/components/events/EventDetailLoadingState';
import { EventDetailErrorState } from '@/components/events/EventDetailErrorState';
import { EventDetailContent } from '@/components/events/EventDetailContent';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEventDetailParams } from '@/hooks/useEventDetailParams';
import { useEventDetailHandlers } from '@/hooks/useEventDetailHandlers';
import { useViewportOptimization } from '@/hooks/useViewportOptimization';
import { useIsMobile } from '@/hooks/use-mobile';

const EventDetail = () => {
  const { user, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
  // Extract route parameters and URL handling
  const { 
    id, eventId, eventSlug, destination, 
    location, initialFetchDone, forceKey,
    isSlugRoute, isDestinationRoute,
    hasTransitionState
  } = useEventDetailParams();
  
  // Extract event handlers
  const { 
    handleBackToEvents, 
    handleEventTypeClick,
    wrapRsvpWithScrollPreservation 
  } = useEventDetailHandlers();
  
  // Check if this navigation is from another event (for transitions)
  const isFromEventNavigation = location?.state?.fromEventNavigation === true;
  const useTransition = location?.state?.useTransition === true;
  
  // Hook for managing the event data
  const { 
    event, 
    attendees,
    isLoading, 
    error, 
    rsvpLoading,
    handleRsvpAction: originalHandleRsvpAction,
    refreshData
  } = useEventDetails(id, user?.id, eventSlug, destination);
  
  // Apply meta tags for SEO
  useEventMetaTags(event);
  
  // Mobile viewport optimization
  useViewportOptimization();
  
  // Add navigation from event handlers
  const navigate = useNavigate();
  
  // Wrap the RSVP action with scroll preservation
  const handleRsvpAction = wrapRsvpWithScrollPreservation(originalHandleRsvpAction);

  // Force refresh the event data on component mount or URL change - with safeguards
  useEffect(() => {
    // Check if we have valid parameters
    if (!eventId && !eventSlug) {
      console.log("No event ID or slug found, skipping data fetch");
      return;
    }
    
    // Check if we already fetched this data
    if (initialFetchDone.current) {
      console.log("Initial fetch already done, skipping");
      return; 
    }
    
    console.log(`Initial data fetch for ${eventId || eventSlug}`);
    initialFetchDone.current = true;
    refreshData();
    
    // Scroll to top when loading a new event
    window.scrollTo(0, 0);
  }, [eventId, eventSlug, destination, refreshData, initialFetchDone]);

  // Redirect to canonical URL if needed
  useEffect(() => {
    // This effect ensures we only apply the redirection when all data is available
    if (event && location && location.pathname && !error) {
      // Inside the effect, we have guaranteed that all values are defined
      const applyRedirection = () => {
        try {
          // Now we can safely call our hook within an effect where we've verified all values
          const canonicalUrl = `${window.location.origin}/events/${event.slug || event.id}`;
          const link = document.querySelector('link[rel="canonical"]');
          if (link) {
            document.head.removeChild(link);
          }
          const canonicalLink = document.createElement('link');
          canonicalLink.rel = 'canonical';
          canonicalLink.href = canonicalUrl;
          document.head.appendChild(canonicalLink);
          
          // Handle redirections directly instead of using the hook
          if (!isSlugRoute && !isDestinationRoute && event.destination && event.slug) {
            const newUrl = `/events/${encodeURIComponent(event.destination)}/${event.slug}`;
            if (location.pathname !== newUrl) {
              console.log(`Redirecting to destination+slug URL: ${newUrl}`);
              navigate(newUrl, { replace: true });
            }
          } else if (!isSlugRoute && !isDestinationRoute && event.slug && !event.destination) {
            const newUrl = `/events/${event.slug}`;
            if (location.pathname !== newUrl) {
              console.log(`Redirecting to slug URL: ${newUrl}`);
              navigate(newUrl, { replace: true });
            }
          }
        } catch (e) {
          console.error("Error in redirection logic:", e);
        }
      };
      
      applyRedirection();
    }
    
    return () => {
      // Clean up canonical link on unmount
      try {
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
          document.head.removeChild(canonicalLink);
        }
      } catch (e) {
        console.error("Error cleaning up canonical link:", e);
      }
    };
  }, [event, location, isSlugRoute, isDestinationRoute, error, navigate]);

  // Determine which animation class to use based on navigation source
  const getAnimationClass = () => {
    // Use scale-in effect for transitions between events
    if (isFromEventNavigation && useTransition) {
      return "event-page-transition animate-scale-in";
    }
    // Use fade-in for regular page loads
    return "event-page-transition animate-fade-in";
  };

  if (error) {
    return (
      <EventDetailErrorState
        error={error}
        onBackToEvents={handleBackToEvents}
      />
    );
  }

  if (isLoading) {
    return <EventDetailLoadingState />;
  }

  if (!event) {
    return (
      <EventDetailErrorState
        error={null}
        onBackToEvents={handleBackToEvents}
        notFound={true}
      />
    );
  }

  return (
    <div className={`container py-8 relative ${getAnimationClass()}`} key={forceKey}>
      {/* Back to Events button - only shown on desktop */}
      {!isMobile && (
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "50ms" }}>
          <Button 
            variant="secondary" 
            onClick={handleBackToEvents}
            className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
            type="button"
            size="default"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Back to Events</span>
          </Button>
        </div>
      )}
      
      <EventDetailContent
        event={event}
        attendees={attendees}
        isAuthenticated={isAuthenticated}
        rsvpLoading={rsvpLoading}
        handleRsvpAction={handleRsvpAction}
        handleBackToEvents={handleBackToEvents}
        handleEventTypeClick={() => handleEventTypeClick(event.event_type)}
      />
    </div>
  );
};

export default EventDetail;
