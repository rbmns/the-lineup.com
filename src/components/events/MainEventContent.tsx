
import React from 'react';
import { Event } from '@/types';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { EventMetaInfo } from '@/components/events/EventMetaInfo';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { EventDescription } from '@/components/events/EventDescription';

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
  // Wrapper for handleRsvp to meet type requirements
  const handleRsvpWrapped = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    await handleRsvp(status);
    return true;
  };

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 animate-fade-in">
      <EventDetailHeader
        event={event}
        coverImage={imageUrl}
        eventType={event?.event_type || 'other'}
        onClose={handleBackToEvents}
        shareUrl={shareUrl}
        title={event?.title || 'Event'}
        onEventTypeClick={handleEventTypeClick}
        startTime={event?.start_time}
        showTitleOverlay={!isMobile}
      />

      <CardContent className="p-0">
        <div className="p-6 space-y-6">
          {/* Mobile title and date - only shown on mobile */}
          {isMobile && (
            <div className="mb-2">
              <h1 className="text-xl font-semibold leading-tight mb-2 text-gray-900">
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
                onRsvp={handleRsvpWrapped}
                loading={rsvpLoading}
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
