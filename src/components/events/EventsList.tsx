
import React from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { cn } from '@/lib/utils';

interface EventsListProps {
  events: Event[];
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loadingEventId?: string | null;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  onRsvp,
  showRsvpButtons = true,
  compact = false,
  className,
  style,
  loadingEventId
}) => {
  return (
    <div 
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", className)} 
      style={style}
    >
      {events.map((event) => (
        <div key={event.id} className="event-list-item h-full" data-event-id={event.id}>
          <EventCard 
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            compact={compact || true} 
            className="h-full"
            loadingEventId={loadingEventId}
          />
        </div>
      ))}
    </div>
  );
};
