import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventDetailParams } from '@/hooks/useEventDetailParams';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventMetaTags } from '@/hooks/useEventMetaTags';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useEventDetailHandlers } from '@/hooks/useEventDetailHandlers';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventDetailErrorState } from '@/components/events/EventDetailErrorState';
import { EventDetailLoadingState } from '@/components/events/EventDetailLoadingState';
import { ShareDialog } from '@/components/events/share/ShareDialog';
import { MainEventContent } from '@/components/events/MainEventContent';
import { SidebarContent } from '@/components/events/SidebarContent';
import { MobileRsvpFooter } from '@/components/events/MobileRsvpFooter';
import { RelatedEvents } from '@/components/events/related-events/RelatedEvents';

const EventDetail = () => {
  // Use our comprehensive params hook to get all URL parameters
  const { id, eventId, eventSlug, hasTransitionState, initialRsvpStatus, originalEvent } = useEventDetailParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isMobile } = useDeviceDetection();
  
  // Use proper ID for data fetching, prefer explicit ID over slug
  const effectiveId = id || eventId || '';
  
  // Always scroll to the top when the event detail page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [effectiveId]);
  
  // Safety check - if no valid ID is available, redirect to events page
  useEffect(() => {
    if (!effectiveId) {
      console.error("Missing event ID in URL parameters");
      navigate('/events');
    }
  }, [effectiveId, navigate]);

  // Only fetch when we have a valid ID
  const { 
    event, 
    isLoading, 
    error, 
    attendees, 
    rsvpLoading,
    handleRsvp,
    refreshData
  } = useEventDetails(effectiveId);

  // Apply initial RSVP status from navigation state to ensure consistency
  useEffect(() => {
    if (event && initialRsvpStatus) {
      console.log(`Applying initial RSVP status from navigation: ${initialRsvpStatus}`);
      // Update the local event state with the RSVP status from navigation
      event.rsvp_status = initialRsvpStatus;
    }
    
    // If we have original event data from navigation, use it to supplement our event data
    if (originalEvent && event && originalEvent.id === event.id) {
      console.log("Using original event data from navigation to supplement current event data");
      
      // Only supplement properties that might be missing
      if (originalEvent.rsvp_status) {
        console.log(`Setting RSVP status from originalEvent: ${originalEvent.rsvp_status}`);
        event.rsvp_status = originalEvent.rsvp_status;
      }
    }
  }, [event, initialRsvpStatus, originalEvent]);

  const { coverImage } = useEventImages(event);
  const metaTags = useEventMetaTags(event);
  const { navigateToEvent } = useEventNavigation();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Use the event detail handlers
  const { 
    handleBackToEvents,
    handleEventTypeClick,
    wrapRsvpWithScrollPreservation
  } = useEventDetailHandlers();
  
  // Enhanced RSVP with scroll preservation
  const handleRsvpEvent = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    try {
      await handleRsvp(status);
      // After successful RSVP, refresh event data to ensure we have the latest
      await refreshData();
      return true;
    } catch (error) {
      console.error('Error handling RSVP:', error);
      return false;
    }
  };
  
  // Format date for display
  const formattedDate = event?.start_time ? new Date(event.start_time).toLocaleDateString(
    'en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
  ) : null;
  
  // Set metadata for SEO
  useEffect(() => {
    if (event && metaTags) {
      metaTags.setMetaTags({
        title: event.title,
        description: event.description || '',
        imageUrl: coverImage || '',
        path: `/events/${event.slug || event.id}`
      });
    }
  }, [event, coverImage, metaTags]);

  // Show loading state while fetching
  if (isLoading) {
    return <EventDetailLoadingState />;
  }

  // Show error state if we encounter problems
  if (error || !event) {
    return (
      <EventDetailErrorState 
        error={error ? new Error(error.toString()) : new Error("Event not found")}
        onBackToEvents={handleBackToEvents}
      />
    );
  }

  const shareUrl = `${window.location.origin}/events/${event.slug || event.id}`;

  return (
    <div className="container mx-auto px-4 pt-6 pb-24">
      {/* Back button for all screen sizes - Improved styling */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={handleBackToEvents}
          size={isMobile ? "default" : "lg"}
          className="flex items-center gap-1.5 text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Events
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main event content - takes up 8/12 of the screen on desktop */}
        <div className="lg:col-span-8 order-first">
          <MainEventContent 
            event={event}
            attendees={attendees}
            isAuthenticated={isAuthenticated}
            rsvpLoading={rsvpLoading}
            handleRsvp={handleRsvpEvent}
            isMobile={isMobile}
            imageUrl={coverImage}
            formattedDate={formattedDate}
            shareUrl={shareUrl}
            handleEventTypeClick={handleEventTypeClick}
            handleBackToEvents={handleBackToEvents}
          />
        </div>
        
        {/* Sidebar content - takes up 4/12 of the screen on desktop */}
        <div className="lg:col-span-4 order-last">
          <SidebarContent 
            event={event}
            attendees={attendees}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
      
      {/* Related Events Section - properly implemented */}
      <div className="mt-12">
        <RelatedEvents 
          eventId={event.id} 
          eventType={event.event_type || ''}
          startDate={event.start_date || ''}
          tags={event.tags}
          vibe={event.vibe}
        />
      </div>
          
      {/* Bottom back to events button - desktop and mobile */}
      <div className="mt-8 mb-4 flex justify-center">
        <Button 
          variant="outline" 
          onClick={handleBackToEvents}
          className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
          size={isMobile ? "default" : "lg"}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </Button>
      </div>
      
      {/* Mobile RSVP Footer */}
      {isMobile && isAuthenticated && (
        <MobileRsvpFooter 
          currentStatus={event.rsvp_status} 
          onRsvp={handleRsvpEvent}
          onShare={() => setShareDialogOpen(true)}
        />
      )}
      
      {/* Share Dialog */}
      <ShareDialog 
        title={event.title}
        description={event.description || ""}
        eventUrl={shareUrl}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
};

export default EventDetail;
