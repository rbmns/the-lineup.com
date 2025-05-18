
import { useMemo } from 'react';
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
import { extractEventCoordinates } from './detail-sections/EventCoordinatesExtractor';

interface EventDetailContentProps {
  event: Event;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean>;
  isRsvpLoading?: boolean;
  isOwner?: boolean;
}

export const EventDetailContent: React.FC<EventDetailContentProps> = ({
  event,
  onRsvp,
  isRsvpLoading = false,
  isOwner = false,
}) => {
  // Get coordinates in a standardized format
  const coordinates = useMemo(() => extractEventCoordinates(event.coordinates), [event.coordinates]);
  
  // Check if we have a booking link
  const bookingLink = event.booking_link || event.organizer_link || null;
  
  // Handle RSVP
  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      console.log(`EventDetailContent: Current RSVP status before handling: ${event.rsvp_status}, handling: ${status}`);
      
      const result = await onRsvp(event.id, status);
      return result;
    } catch (error) {
      console.error('RSVP error:', error);
      return false;
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
      {/* Event details - takes up 2/3 of the space on desktop */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{event.title}</h1>
          
          {/* Date and time info */}
          <EventDateTimeSection startTime={event.start_time} endTime={event.end_time} />
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
        
        {/* Tags */}
        <EventTagsSection tags={event.tags} />
      </div>
      
      {/* Sidebar - takes up 1/3 of the space on desktop */}
      <div className="space-y-8">
        {/* RSVP actions */}
        <EventRsvpSection 
          isOwner={isOwner}
          onRsvp={handleRsvp}
          isRsvpLoading={isRsvpLoading}
          currentStatus={event.rsvp_status || null}
        />
        
        {/* Attendees summary */}
        <EventAttendeesSummary 
          goingCount={event.attendees?.going || 0}
          interestedCount={event.attendees?.interested || 0}
        />
        
        {/* External link if available */}
        {bookingLink && <EventExternalLink url={bookingLink} />}
      </div>
    </div>
  );
};
