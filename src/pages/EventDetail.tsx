
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
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventMetaTags } from '@/hooks/useEventMetaTags';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  // Safety check for valid eventId
  useEffect(() => {
    if (!eventId) {
      console.error("Missing event ID in URL params");
      navigate('/events');
    }
  }, [eventId, navigate]);

  const { event, error, isLoading } = useEventDetails(eventId || '');
  const { coverImage } = useEventImages(event);
  const metaTags = useEventMetaTags(event);
  const { handleRsvp } = useRsvpActions();
  const { navigateToEvent } = useEventNavigation();
  const { isMobile } = useDeviceDetection();
  const { isAuthenticated } = useAuth();
  
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
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

  if (isLoading) {
    return <EventDetailLoadingState />;
  }

  if (error || !event) {
    return (
      <EventDetailErrorState 
        error={error ? new Error(error.toString()) : new Error("Event not found")}
        onBackToEvents={() => navigate('/events')}
      />
    );
  }

  const handleEventTypeClick = (eventType: string) => {
    navigate(`/events?type=${eventType}`);
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleRsvpEvent = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (handleRsvp) {
      try {
        await handleRsvp(event.id, status);
        return true;
      } catch (error) {
        console.error("Error during RSVP:", error);
        return false;
      }
    }
    return false;
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
            onRsvp={(status: 'Going' | 'Interested') => handleRsvp(event.id, status)}
            isRsvpLoading={false}
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
          
          {/* Pass the entire event object to RelatedEventsSection */}
          <RelatedEventsSection event={event} />
        </div>
      </div>
      
      {isMobile && isAuthenticated && (
        <MobileRsvpFooter 
          currentStatus={event.rsvp_status} 
          onRsvp={handleRsvpEvent}
          onShare={handleShare}
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
