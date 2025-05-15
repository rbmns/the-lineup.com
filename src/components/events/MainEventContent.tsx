
import React from 'react';
import { Event } from '@/types';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { EventMetaInfo } from '@/components/events/EventMetaInfo';
import { EventFriendRsvps } from '@/components/events/EventFriendRsvps';
import { EventLocationInfo } from '@/components/events/EventLocationInfo';
import { BookingInformation } from '@/components/events/BookingInformation';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { EventDescription } from '@/components/events/EventDescription';

interface MainEventContentProps {
  event: Event;
  attendees: { going: any[]; interested: any[] };
  isAuthenticated: boolean;
  rsvpLoading: boolean;
  handleRsvp: (status: 'Going' | 'Interested') => void;
  isMobile: boolean;
  imageUrl: string | null;
  formattedDate: string | null;
  shareUrl: string;
  handleEventTypeClick: () => void;
  handleBackToEvents: () => void;
}

export const MainEventContent: React.FC<MainEventContentProps> = ({
  event,
  attendees,
  isAuthenticated,
  rsvpLoading,
  handleRsvp,
  isMobile,
  imageUrl,
  formattedDate,
  shareUrl,
  handleEventTypeClick,
  handleBackToEvents
}) => {
  return (
    <Card className="overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 animate-fade-in">
      <EventDetailHeader
        image={imageUrl}
        eventType={event?.event_type || 'other'}
        onClose={handleBackToEvents}
        shareUrl={shareUrl}
        title={event?.title || 'Event'}
        event={event}
        onEventTypeClick={handleEventTypeClick}
        startTime={event?.start_time}
        showTitleOverlay={!isMobile}
      />

      <CardContent className="p-0">
        <div className="p-6 space-y-6">
          {/* Mobile title and date - only shown on mobile */}
          {isMobile && (
            <div className="mb-2">
              <h1 className="text-xl font-semibold leading-tight mb-2">
                {event?.title || 'Event'}
              </h1>
              {formattedDate && (
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                  {event.recurring_count && event.recurring_count > 0 && (
                    <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                      +{event.recurring_count} more dates
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* RSVP buttons for desktop - directly under the image */}
          {isAuthenticated && !isMobile && (
            <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
              <EventRsvpButtons 
                currentStatus={event?.rsvp_status}
                onRsvp={handleRsvp}
                loading={rsvpLoading}
                className="w-full"
                size="lg"
              />
            </div>
          )}

          {/* Event description section */}
          <EventDescription description={event.description} isMobile={isMobile} />
          
          {/* Mobile-only components */}
          <div className="lg:hidden space-y-4">
            {/* Friends attending section in Card style - mobile only */}
            {isAuthenticated && attendees && (attendees.going.length > 0 || attendees.interested.length > 0) && (
              <Card className="shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CardContent className="p-5">
                  <EventFriendRsvps
                    going={attendees?.going || []}
                    interested={attendees?.interested || []}
                  />
                </CardContent>
              </Card>
            )}
            
            {/* Mobile-only location and booking info cards */}
            <EventLocationInfo 
              venue={event.venues} 
              className="animate-fade-in"
              style={{ animationDelay: '150ms' }}
              compact={true}
            />
            
            <BookingInformation 
              event={event} 
              className="animate-fade-in"
              style={{ animationDelay: '200ms' }}
              compact={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MainEventContent;
