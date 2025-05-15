
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventMetaTags } from '@/hooks/useEventMetaTags';
import { setCanonicalLink } from '@/utils/canonicalUtils';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { Event } from '@/types';

import { EventDetailErrorState } from '@/components/events/EventDetailErrorState';
import { EventDetailLoadingState } from '@/components/events/EventDetailLoadingState';
import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { EventDetailContent } from '@/components/events/EventDetailContent';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { MobileRsvpFooter } from '@/components/events/MobileRsvpFooter';
import { ShareDialog } from '@/components/events/share/ShareDialog';

const EventDetail = () => {
  const { eventId, eventSlug } = useParams<{ eventId?: string, eventSlug?: string }>();
  const navigate = useNavigate();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  // Get event data
  const {
    event,
    isLoading,
    error
  } = useEventDetails(eventId, eventSlug);

  // Set meta tags
  useEventMetaTags(event);
  
  const { handleRsvp } = useRsvpActions();
  
  useEffect(() => {
    // Set canonical link
    if (event?.slug) {
      setCanonicalLink(`${window.location.origin}/events/${event.slug}`);
    } else if (eventId) {
      setCanonicalLink(`${window.location.origin}/events/${eventId}`);
    }
  }, [event, eventId]);

  // Handle RSVP button click
  const handleRsvpClick = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!event) return false;
    try {
      await handleRsvp(event.id, status);
      return true;
    } catch (error) {
      console.error('Error updating RSVP:', error);
      return false;
    }
  };

  // Handle share button click
  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  // Handle event type icon click
  const handleEventTypeClick = (eventType: string) => {
    navigate(`/events?type=${encodeURIComponent(eventType)}`);
  };
  
  if (isLoading) {
    return <EventDetailLoadingState />;
  }

  if (error) {
    let errorMessage: string;
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'An unknown error occurred';
    }
    
    return <EventDetailErrorState error={errorMessage} />;
  }
  
  if (!event) {
    return <EventDetailErrorState error="Event not found" />;
  }

  return (
    <div className="bg-white">
      <EventDetailHeader 
        event={event} 
        onShare={handleShare}
        onEventTypeClick={handleEventTypeClick}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <EventDetailContent 
              event={event} 
              onEventTypeClick={handleEventTypeClick}
            />
          </div>
          
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="font-bold text-xl mb-4">RSVP to this event</h3>
                
                <EventRsvpButtons 
                  currentStatus={event.user_rsvp_status} 
                  onRsvp={handleRsvpClick} 
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile RSVP footer that appears on smaller screens */}
      <MobileRsvpFooter 
        event={event} 
        onRsvp={handleRsvpClick} 
        onShare={handleShare}
      />
      
      {/* Share dialog */}
      <ShareDialog 
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        event={event}
      />
    </div>
  );
};

export default EventDetail;
