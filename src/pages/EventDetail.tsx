
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { EventDetailContent } from '@/components/events/EventDetailContent';
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { MobileRsvpFooter } from '@/components/events/MobileRsvpFooter';
import { EventDetailErrorState } from '@/components/events/EventDetailErrorState';
import { EventDetailLoadingState } from '@/components/events/EventDetailLoadingState';
import { ShareDialog } from '@/components/events/share/ShareDialog';
import { useEventDetailParams } from '@/hooks/useEventDetailParams';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventMetaTags } from '@/hooks/useEventMetaTags';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useEventDetailHandlers } from '@/hooks/useEventDetailHandlers';
import { toast } from '@/hooks/use-toast';

const EventDetail = () => {
  // Use our comprehensive params hook to get all URL parameters
  const { id, eventId, eventSlug, hasTransitionState } = useEventDetailParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isMobile } = useDeviceDetection();
  
  // Use proper ID for data fetching, prefer explicit ID over slug
  const effectiveId = id || eventId || '';
  
  // Log for debugging
  useEffect(() => {
    console.log(`EventDetail page: Rendering with ID: ${effectiveId}, eventId: ${eventId}, eventSlug: ${eventSlug}`);
  }, [effectiveId, eventId, eventSlug]);
  
  // Safety check - if no valid ID is available, redirect to events page
  useEffect(() => {
    if (!effectiveId) {
      console.error("Missing valid event ID in URL parameters");
      toast({
        title: "Error",
        description: "Could not load the event due to missing ID", 
        variant: "destructive"
      });
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
    handleRsvp 
  } = useEventDetails(effectiveId);

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
  const handleRsvpEvent = wrapRsvpWithScrollPreservation(handleRsvp);
  
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

  return (
    <div className="container mx-auto px-4 py-8">
      <EventDetailHeader 
        event={event}
        coverImage={coverImage}
        onEventTypeClick={() => handleEventTypeClick(event.event_type)}
      />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventDetailContent 
            event={event}
            onRsvp={handleRsvpEvent}
            isRsvpLoading={rsvpLoading}
            isOwner={event.created_by === event.creator?.id}
          />
          
          {!isMobile && isAuthenticated && (
            <div className="mt-8 flex space-x-4">
              <EventRsvpButtons 
                currentStatus={event.rsvp_status} 
                onRsvp={handleRsvpEvent}
                className="w-full"
                size="lg"
              />
            </div>
          )}
          
          <RelatedEventsSection event={event} />
        </div>
      </div>
      
      {isMobile && isAuthenticated && (
        <MobileRsvpFooter 
          currentStatus={event.rsvp_status} 
          onRsvp={handleRsvpEvent}
          onShare={() => setShareDialogOpen(true)}
        />
      )}
      
      <ShareDialog 
        title={event.title}
        description={event.description || ""}
        eventUrl={`${window.location.origin}/events/${event.slug || event.id}`}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
};

export default EventDetail;
