
import React, { useMemo, useCallback } from 'react';
import { Event } from '@/types';
import { Separator } from '@/components/ui/separator';
import '@/styles/rsvp-animations.css';
import { EventDateTimeSection } from './detail-sections/EventDateTimeSection';
import { EventLocationSection } from './detail-sections/EventLocationSection';
import { EventDescriptionSection } from './detail-sections/EventDescriptionSection';
import { EventTagsSection } from './detail-sections/EventTagsSection';
import { EventRsvpSection } from './detail-sections/EventRsvpSection';
import { EventAttendeesSummary } from './detail-sections/EventAttendeesSummary';
import { EventExternalLink } from './detail-sections/EventExternalLink';
import { EventFriendRsvps } from './EventFriendRsvps';
import { extractEventCoordinates } from './detail-sections/EventCoordinatesExtractor';

interface EventDetailContentProps {
  event: Event;
  attendees?: { going: any[]; interested: any[] };
  friendAttendees?: { going: any[]; interested: any[] };
  relatedEvents?: Event[];
  relatedLoading?: boolean;
  isAuthenticated?: boolean;
  rsvpLoading?: boolean;
  onRsvp?: (status: 'Going' | 'Interested') => Promise<boolean>;
  isRsvpLoading?: boolean;
  isOwner?: boolean;
}

const EventDetailContent = ({
  event,
  attendees,
  friendAttendees,
  onRsvp,
  isRsvpLoading = false,
  rsvpLoading = false,
  isOwner = false,
}: EventDetailContentProps) => {
  // Get coordinates in a standardized format - memoized
  const coordinates = useMemo(() => 
    extractEventCoordinates(event.coordinates), 
    [event.coordinates]
  );
  
  // Check if we have a booking link - memoized
  const bookingLink = useMemo(() => 
    event.booking_link || event.organizer_link || null, 
    [event.booking_link, event.organizer_link]
  );
  
  // Handle RSVP - memoized callback
  const handleRsvp = useCallback(async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      console.log(`EventDetailContent: Current RSVP status before handling: ${event.rsvp_status}, handling: ${status}`);
      
      const result = await onRsvp(status);
      return result;
    } catch (error) {
      console.error('RSVP error:', error);
      return false;
    }
  }, [onRsvp, event.rsvp_status]);
  
  return (
    <div className="space-y-6">
      {/* Event title and basic info */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>
        
        {/* Date and time info - without duration */}
        <EventDateTimeSection startTime={event.start_time} endTime={null} />
      </div>
      
      {/* RSVP Section - prominently placed and responsive */}
      <div className="bg-gray-50 rounded-lg p-4">
        <EventRsvpSection 
          isOwner={isOwner}
          onRsvp={handleRsvp}
          isRsvpLoading={isRsvpLoading || rsvpLoading}
          currentStatus={event.rsvp_status || null}
        />
      </div>
      
      <Separator />
      
      {/* Location section */}
      {(event.venue_id || event.location || coordinates) && (
        <EventLocationSection 
          venue={event.venues} 
          location={event.location}
          coordinates={coordinates}
          title={event.title}
        />
      )}
      
      {/* Description */}
      <EventDescriptionSection description={event.description || ''} />
      
      {/* Attendees summary */}
      <EventAttendeesSummary 
        goingCount={attendees?.going?.length || event.attendees?.going || 0}
        interestedCount={attendees?.interested?.length || event.attendees?.interested || 0}
      />
      
      {/* Friends attending section */}
      {friendAttendees && (friendAttendees.going.length > 0 || friendAttendees.interested.length > 0) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <EventFriendRsvps 
            going={friendAttendees.going}
            interested={friendAttendees.interested}
          />
        </div>
      )}
      
      {/* External link if available */}
      {bookingLink && <EventExternalLink url={bookingLink} />}
      
      {/* Tags */}
      <EventTagsSection tags={event.tags} />
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export const MemoizedEventDetailContent = React.memo(EventDetailContent);

// For backward compatibility, export the component as before
export { MemoizedEventDetailContent as EventDetailContent };
