
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
import { EventDetailErrorState } from '@/components/events/EventDetailErrorState';
import { EventDetailLoadingState } from '@/components/events/EventDetailLoadingState';
import { EventDetailLayout } from '@/components/events/detail/EventDetailLayout';

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
  const handleRsvpEvent = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
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
    <EventDetailLayout
      event={event}
      attendees={attendees}
      isAuthenticated={isAuthenticated}
      rsvpLoading={rsvpLoading}
      handleRsvp={handleRsvpEvent}
      isMobile={isMobile}
      coverImage={coverImage}
      formattedDate={formattedDate}
      shareUrl={shareUrl}
      handleEventTypeClick={handleEventTypeClick}
      handleBackToEvents={handleBackToEvents}
      shareDialogOpen={shareDialogOpen}
      setShareDialogOpen={setShareDialogOpen}
    />
  );
};

export default EventDetail;
