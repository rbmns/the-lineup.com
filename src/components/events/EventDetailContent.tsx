
import React from 'react';
import { Event } from '@/types';
import { useEventImages } from '@/hooks/useEventImages';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRecurringEvents } from '@/hooks/useRecurringEvents';
import { formatInTimeZone } from 'date-fns-tz';
import RelatedEvents from '@/components/events/related-events/RelatedEvents';
import MainEventContent from '@/components/events/MainEventContent';
import SidebarContent from '@/components/events/SidebarContent';
import MobileRsvpFooter from '@/components/events/MobileRsvpFooter';

interface EventDetailContentProps {
  event: Event;
  attendees: { going: any[]; interested: any[] };
  isAuthenticated: boolean;
  rsvpLoading: boolean;
  handleRsvpAction: (status: 'Going' | 'Interested') => void;
  handleBackToEvents: () => void;
  handleEventTypeClick: () => void;
}

export const EventDetailContent: React.FC<EventDetailContentProps> = ({
  event,
  attendees,
  isAuthenticated,
  rsvpLoading,
  handleRsvpAction,
  handleBackToEvents,
  handleEventTypeClick
}) => {
  const { getEventImageUrl } = useEventImages();
  const imageUrl = event.image_urls?.[0] || null;
  const isMobile = useIsMobile();
  
  // Get recurring events for this event
  const { recurringEvents } = useRecurringEvents(event);
  
  // Generate absolute URL for sharing
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/events/${event.destination ? `${event.destination}/` : ''}${event.slug || event.id}`;
  
  // Process entrance fee for display
  const getEntranceFeeDisplay = () => {
    const feeValue = event.fee;
    
    // Check for free entrance (handle all possible representations of zero)
    if (
      feeValue === 0 || // number 0
      feeValue === 0.0 || // floating point 0
      (typeof feeValue === 'string' && feeValue === '0') // string '0'
    ) {
      return "Free entrance";
    } 
    // Check if fee exists (not undefined or null)
    else if (feeValue !== undefined && feeValue !== null) {
      // Format fee display based on type
      return `Entrance: ${typeof feeValue === 'number' ? `€${feeValue}` : feeValue}`;
    } 
    // Default case when fee is not specified
    else {
      return "Entrance: Check with organizer";
    }
  };
  
  // Enhance the event with recurring count and entrance fee display
  const enhancedEvent = {
    ...event,
    recurring_count: recurringEvents.length,
    entrance_fee_display: getEntranceFeeDisplay()
  };
  
  // Format date for mobile display
  const formattedDate = event.start_time ? formatInTimeZone(
    new Date(event.start_time), 
    'Europe/Amsterdam', 
    "EEE, d MMM yyyy • HH:mm"
  ) : null;
  
  // Safe RSVP handler with proper event interruption
  const handleRsvp = (status: 'Going' | 'Interested') => {
    console.log(`EventDetailContent: Handling RSVP for status ${status}`);
    
    try {
      handleRsvpAction(status);
    } catch (error) {
      console.error("Error in EventDetailContent RSVP handler:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content - takes 2/3 on desktop, full width on mobile */}
        <div className="w-full lg:w-2/3">
          <MainEventContent 
            event={enhancedEvent}
            attendees={attendees}
            isAuthenticated={isAuthenticated}
            rsvpLoading={rsvpLoading}
            handleRsvp={handleRsvp}
            isMobile={isMobile}
            imageUrl={imageUrl}
            formattedDate={formattedDate}
            shareUrl={shareUrl}
            handleEventTypeClick={handleEventTypeClick}
            handleBackToEvents={handleBackToEvents}
          />

          {/* Related events section with improved spacing */}
          <div className="mt-6 lg:mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <RelatedEvents 
              eventType={event.event_type || ''}
              currentEventId={event.id} 
              tags={event.tags}
              vibe={event.vibe}
            />
          </div>
        </div>

        {/* Sidebar - only visible on desktop - aligned with main content top */}
        <div className="hidden lg:block lg:w-1/3 lg:pt-0">
          <SidebarContent 
            event={enhancedEvent}
            attendees={attendees}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      {/* RSVP buttons - fixed at bottom on mobile */}
      <MobileRsvpFooter
        isAuthenticated={isAuthenticated}
        isMobile={isMobile}
        rsvpStatus={event?.rsvp_status}
        handleRsvp={handleRsvp}
        rsvpLoading={rsvpLoading}
      />
    </>
  );
};
