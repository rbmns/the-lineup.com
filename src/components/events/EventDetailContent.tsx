
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
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { formatDate, formatEventTime } from '@/utils/date-formatting';

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

  // Format event location
  const eventLocation = event.venues?.name ? 
    `${event.venues.name}${event.venues.city ? `, ${event.venues.city}` : ''}` : 
    event.location || 'Location TBD';
  
  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 py-6">
      <div className="space-y-6 text-left">
        {/* Event title */}
        <div className="text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-left">{event.title}</h1>
        </div>
        
        {/* Event Details Cards */}
        <div className="grid gap-4">
          {/* Date & Time Card */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Date & Time</h3>
                  <p className="text-sm text-gray-600">
                    {event.start_date && formatDate(event.start_date)}
                    {event.start_time && ` • ${formatEventTime(event.start_time, event.end_time)}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Venue</h3>
                  <p className="text-sm text-gray-600">{eventLocation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* RSVP Section - prominently placed and responsive */}
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <EventRsvpSection 
            isOwner={isOwner}
            onRsvp={handleRsvp}
            isRsvpLoading={isRsvpLoading || rsvpLoading}
            currentStatus={event.rsvp_status || null}
          />
        </div>
        
        <Separator />
        
        {/* Description */}
        <div className="text-left">
          <EventDescriptionSection description={event.description || ''} />
        </div>
        
        {/* Attendees summary */}
        <div className="text-left">
          <EventAttendeesSummary 
            goingCount={attendees?.going?.length || event.attendees?.going || 0}
            interestedCount={attendees?.interested?.length || event.attendees?.interested || 0}
          />
        </div>
        
        {/* Friends attending section */}
        {friendAttendees && (friendAttendees.going.length > 0 || friendAttendees.interested.length > 0) && (
          <div className="bg-gray-50 p-4 rounded-lg text-left">
            <EventFriendRsvps 
              going={friendAttendees.going}
              interested={friendAttendees.interested}
            />
          </div>
        )}
        
        {/* External link if available */}
        {bookingLink && (
          <div className="text-left">
            <EventExternalLink url={bookingLink} />
          </div>
        )}
        
        {/* Tags */}
        <div className="text-left">
          <EventTagsSection tags={event.tags} />
        </div>
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export const MemoizedEventDetailContent = React.memo(EventDetailContent);

// For backward compatibility, export the component as before
export { MemoizedEventDetailContent as EventDetailContent };
