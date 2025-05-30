
import React from 'react';
import { Event } from '@/types';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { EventDescription } from '@/components/events/EventDescription';
import { AMSTERDAM_TIMEZONE } from '@/utils/dateUtils';
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

function formatDateTime(start_date?: string | null, start_time?: string | null, end_time?: string | null) {
  // Combine start date and times
  if (!start_date || !start_time) return null;
  try {
    const startIso = `${start_date}T${start_time}`;
    const start = new Date(startIso);

    let startStr = formatInTimeZone(start, AMSTERDAM_TIMEZONE, "EEEE, d MMMM yyyy");
    let timeStr = formatInTimeZone(start, AMSTERDAM_TIMEZONE, "HH:mm");

    if (end_time) {
      const endIso = `${start_date}T${end_time}`;
      const end = new Date(endIso);
      let endTimeStr = formatInTimeZone(end, AMSTERDAM_TIMEZONE, "HH:mm");
      return `${startStr}, ${timeStr} - ${endTimeStr}`;
    }
    return `${startStr}, ${timeStr}`;
  } catch (err) {
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

  const dateTimeInfo = formatDateTime(event.start_date, event.start_time, event.end_time);

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 animate-fade-in">
      {/* Image header */}
      <EventDetailHeader
        event={event}
        coverImage={imageUrl}
        eventType={event?.event_category || 'other'}
        onClose={handleBackToEvents}
        shareUrl={shareUrl}
        title={event?.title || 'Event'}
        onEventTypeClick={handleEventTypeClick}
        startTime={event?.start_time}
        showTitleOverlay={!isMobile} // Only show overlay on desktop
        dateTimeInfo={!isMobile ? dateTimeInfo : undefined} // Only on desktop
      />

      <CardContent className="p-0">
        <div className="p-6 space-y-6">
          {/* Mobile: show title/date under image only on mobile */}
          {isMobile && (
            <div className="mb-2">
              <h1 className="text-xl font-semibold leading-tight mb-1 text-gray-900">
                {event?.title || 'Event'}
              </h1>
              {dateTimeInfo && (
                <div className="flex items-center gap-2 text-gray-700 text-sm mt-1 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{dateTimeInfo}</span>
                </div>
              )}
            </div>
          )}

          {/* RSVP buttons for desktop - under the image */}
          {isAuthenticated && !isMobile && (
            <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
              <EventRsvpButtons 
                currentStatus={event?.rsvp_status}
                onRsvp={handleRsvpWrapped}
                isLoading={rsvpLoading} /* Changed from loading to isLoading */
                className="w-full"
                size="lg"
              />
            </div>
          )}

          {/* Event description section */}
          <EventDescription description={event.description} isMobile={isMobile} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MainEventContent;
