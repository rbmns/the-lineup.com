
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
import { Calendar, MapPin, Clock, Euro } from 'lucide-react';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';
import { LineupImage } from '@/components/ui/lineup-image';

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
  const { getEventImageUrl } = useEventImages();
  
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
  
  const imageUrl = getEventImageUrl(event);

  return (
    <div className="w-full bg-white">
      {/* Full width image header with category pill on top */}
      <div className="relative w-full">
        <LineupImage
          src={imageUrl}
          alt={event.title}
          aspectRatio="hero"
          overlayVariant="sunset"
          className="w-full h-64 sm:h-80 lg:h-96"
          loading="eager"
        />
        
        {/* Category pill on top of image */}
        {event.event_category && (
          <div className="absolute top-4 left-4 z-30">
            <CategoryPill 
              category={event.event_category}
              size="sm"
              showIcon={true}
            />
          </div>
        )}
      </div>

      {/* Content area with structured layout */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title Section */}
          <div>
            <h1 className="font-inter font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-tight mb-4">
              {event.title}
            </h1>
          </div>
          
          {/* Key Details Grid */}
          <div className="grid gap-4 sm:gap-6">
            {/* Date & Time Card */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-inter font-semibold text-gray-900 mb-1">Date & Time</h3>
                    <p className="font-inter text-sm text-gray-600">
                      {event.start_date && formatDate(event.start_date)}
                      {event.start_time && ` • ${formatEventTime(event.start_time, event.end_time)}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-inter font-semibold text-gray-900 mb-1">Venue</h3>
                    <p className="font-inter text-sm text-gray-600">{eventLocation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entrance Fee Card - only show if fee exists */}
            {event.fee && (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <Euro className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-inter font-semibold text-gray-900 mb-1">Entrance Fee</h3>
                      <p className="font-inter text-sm text-gray-600">€{event.fee}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* RSVP Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <EventRsvpSection 
                isOwner={isOwner}
                onRsvp={handleRsvp}
                isRsvpLoading={isRsvpLoading || rsvpLoading}
                currentStatus={event.rsvp_status || null}
              />
            </CardContent>
          </Card>
          
          <Separator className="my-8" />
          
          {/* Description */}
          {event.description && (
            <div className="prose max-w-none">
              <EventDescriptionSection description={event.description} />
            </div>
          )}
          
          {/* Attendees summary */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <EventAttendeesSummary 
                goingCount={attendees?.going?.length || event.attendees?.going || 0}
                interestedCount={attendees?.interested?.length || event.attendees?.interested || 0}
              />
            </CardContent>
          </Card>
          
          {/* Friends attending section */}
          {friendAttendees && (friendAttendees.going.length > 0 || friendAttendees.interested.length > 0) && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-inter font-semibold text-gray-900 mb-4">Friends Attending</h3>
                <EventFriendRsvps 
                  going={friendAttendees.going}
                  interested={friendAttendees.interested}
                />
              </CardContent>
            </Card>
          )}
          
          {/* External link if available */}
          {bookingLink && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 sm:p-6">
                <EventExternalLink url={bookingLink} />
              </CardContent>
            </Card>
          )}
          
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <EventTagsSection tags={event.tags} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export const MemoizedEventDetailContent = React.memo(EventDetailContent);

// For backward compatibility, export the component as before
export { MemoizedEventDetailContent as EventDetailContent };
