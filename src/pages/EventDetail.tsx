
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { EventDetailContent } from '@/components/events/EventDetailContent';
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { MobileRsvpFooter } from '@/components/events/MobileRsvpFooter';
import { EventDetailErrorState } from '@/components/events/EventDetailErrorState';
import { EventDetailLoadingState } from '@/components/events/EventDetailLoadingState';
import { EventShareDialog } from '@/components/events/share/ShareDialog';
import { useEventDetailParams } from '@/hooks/useEventDetailParams';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventMetaTags } from '@/hooks/useEventMetaTags';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

const EventDetail = () => {
  const { eventId, eventSlug } = useEventDetailParams();
  const { event, error, isLoading } = useEventDetails(eventId, eventSlug);
  const { coverImage } = useEventImages(event);
  const { addMetaTags } = useEventMetaTags();
  const { handleRsvp } = useRsvpActions();
  const { navigateToEvents } = useEventNavigation();
  const { isMobile } = useDeviceDetection();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  useEffect(() => {
    if (event) {
      addMetaTags({
        title: event.title,
        description: event.description || '',
        imageUrl: coverImage || '',
        path: `/events/${event.slug || event.id}`
      });
    }
  }, [event, coverImage, addMetaTags]);

  if (isLoading) {
    return <EventDetailLoadingState />;
  }

  if (error || !event) {
    return (
      <EventDetailErrorState 
        error={error ? new Error(error.toString()) : new Error("Event not found")}
        onBackToEvents={() => navigateToEvents()}
      />
    );
  }

  const handleEventTypeClick = (eventType: string) => {
    navigate(`/events?type=${eventType}`);
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <EventDetailHeader 
        event={event}
        coverImage={coverImage}
      />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventDetailContent 
            event={event}
            handleEventTypeClick={handleEventTypeClick}
          />
          
          {!isMobile && isAuthenticated && (
            <div className="mt-8 flex space-x-4">
              <EventRsvpButtons 
                currentStatus={event.user_rsvp_status} 
                onRsvp={(status) => handleRsvp(event.id, status)}
                fullWidth={true}
              />
            </div>
          )}
          
          <RelatedEventsSection eventId={event.id} venueId={event.venue_id} />
        </div>
      </div>
      
      {isMobile && isAuthenticated && (
        <MobileRsvpFooter 
          currentStatus={event.user_rsvp_status} 
          onRsvp={(status) => handleRsvp(event.id, status)}
          onShare={handleShare}
        />
      )}
      
      <EventShareDialog 
        isOpen={shareDialogOpen} 
        onOpenChange={setShareDialogOpen}
        event={event}
      />
    </div>
  );
};

export default EventDetail;
