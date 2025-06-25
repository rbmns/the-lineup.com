
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock, Users } from 'lucide-react';
import { EventCardActions } from './EventCardActions';
import { formatEventDate, formatEventTime } from '@/utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  showRsvpButtons?: boolean;
  isLoading?: boolean;
  compact?: boolean;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onRsvp,
  showRsvpButtons = false,
  isLoading = false,
  compact = false,
  className
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on RSVP buttons or other interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('[data-no-navigation="true"]') || target.closest('button')) {
      return;
    }
    navigate(`/events/${event.id}`);
  };

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (onRsvp) {
      await onRsvp(eventId, status);
    }
    return true;
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-lg transition-all duration-200 h-full",
        isLoading && "opacity-50",
        className
      )}
      onClick={handleCardClick}
      data-event-id={event.id}
    >
      <CardContent className="p-4 h-full flex flex-col">
        {/* Event Image */}
        {event.image_urls && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={event.image_urls}
              alt={event.title}
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        {/* Event Details */}
        <div className="flex-1 space-y-3">
          {/* Title and Vibe */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
            {event.vibe && (
              <Badge variant="secondary" className="text-xs">
                {event.vibe}
              </Badge>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4" />
            <span>{formatEventDate(event.start_date)}</span>
            {event.start_time && (
              <>
                <Clock className="h-4 w-4 ml-2" />
                <span>{formatEventTime(event.start_time)}</span>
              </>
            )}
          </div>

          {/* Location */}
          {event.destination && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.destination}</span>
            </div>
          )}

          {/* Description */}
          {event.description && !compact && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        {/* RSVP Actions */}
        {showRsvpButtons && (
          <EventCardActions
            eventId={event.id}
            currentRsvpStatus={event.rsvp_status}
            showRsvpButtons={true}
            onRsvp={handleRsvp}
            isLoading={isLoading}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </CardContent>
    </Card>
  );
};
