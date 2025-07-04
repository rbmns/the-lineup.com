
import React from 'react';
import { Event } from '@/types';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { EventDescription } from '@/components/events/EventDescription';
import { formatInTimeZone } from 'date-fns-tz';

interface MainEventContentProps {
  event: Event;
  attendees: { going: any[]; interested: any[] };
  isAuthenticated: boolean;
  rsvpLoading: boolean;
  handleRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  isMobile: boolean;
  imageUrl: string | null;
  formattedDate: string | null;
  shareUrl: string;
  handleEventTypeClick: () => void;
  handleBackToEvents: () => void;
}

function formatDateTime(start_datetime?: string | null, end_datetime?: string | null, timezone?: string) {
  if (!start_datetime) return null;
  
  try {
    const eventTimezone = timezone || 'Europe/Amsterdam';
    const startDate = new Date(start_datetime);
    
    let startStr = formatInTimeZone(startDate, eventTimezone, "EEEE, d MMMM yyyy");
    let timeStr = formatInTimeZone(startDate, eventTimezone, "HH:mm");

    if (end_datetime) {
      const endDate = new Date(end_datetime);
      let endTimeStr = formatInTimeZone(endDate, eventTimezone, "HH:mm");
      return `${startStr}, ${timeStr} - ${endTimeStr}`;
    }
    return `${startStr}, ${timeStr}`;
  } catch (err) {
    console.error('Error formatting with timestampz:', err);
    return null;
  }
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
  const handleRsvpWrapped = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    try {
      await handleRsvp(status);
      return true;
    } catch (error) {
      console.error('Error handling RSVP:', error);
      return false;
    }
  };

  const dateTimeInfo = formatDateTime(
    event.start_datetime,
    event.end_datetime,
    event.timezone
  );

  return (
    <Card className="bg-pure-white border border-mist-grey shadow-md overflow-hidden">
      {/* Image header */}
      <EventDetailHeader
        event={event}
        coverImage={imageUrl}
        eventType={event?.event_category || 'other'}
        onClose={handleBackToEvents}
        shareUrl={shareUrl}
        title={event?.title || 'Event'}
        onEventTypeClick={handleEventTypeClick}
        showTitleOverlay={!isMobile}
        dateTimeInfo={!isMobile ? dateTimeInfo : undefined}
      />

      <CardContent className="p-0">
        <div className="p-6 space-y-6">
          {/* Mobile: show title/date under image only on mobile */}
          {isMobile && (
            <div className="mb-6">
              <h1 className="text-h1 font-montserrat text-graphite-grey leading-tight mb-3">
                {event?.title || 'Event'}
              </h1>
              {dateTimeInfo && (
                <div className="flex items-center gap-2 text-body-base text-graphite-grey font-lato">
                  <Calendar className="h-5 w-5 text-ocean-teal flex-shrink-0" />
                  <span>{dateTimeInfo}</span>
                </div>
              )}
            </div>
          )}

          {/* RSVP buttons section */}
          {isAuthenticated && (
            <div className="bg-mist-grey/30 p-6 rounded-lg">
              <h3 className="text-h4 text-graphite-grey font-montserrat mb-4">Join this event</h3>
              <EventRsvpButtons 
                currentStatus={event?.rsvp_status}
                onRsvp={handleRsvpWrapped}
                isLoading={rsvpLoading}
                className="w-full"
                size="lg"
              />
            </div>
          )}

          {/* Event description section */}
          <div className="space-y-4">
            <h2 className="text-h2 text-graphite-grey font-montserrat">About this event</h2>
            <EventDescription description={event.description} isMobile={isMobile} />
          </div>

          {/* Organizer section */}
          {event.organiser_name && (
            <div className="space-y-4">
              <h3 className="text-h3 text-graphite-grey font-montserrat">Organizer</h3>
              <p className="text-body-base text-graphite-grey font-lato">
                This event is organized by <span className="font-semibold text-ocean-teal">{event.organiser_name}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MainEventContent;
