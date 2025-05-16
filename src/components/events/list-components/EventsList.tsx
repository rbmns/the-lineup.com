
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
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div 
      className={cn("grid gap-6", 
        compact 
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
      style={style}
    >
      {events.map((event) => (
        <div key={event.id} data-event-id={event.id} className="h-full">
          <EventCard 
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            loadingEventId={loadingEventId}
            className="h-full"
            compact={compact}
          />
        </div>
      ))}
    </div>
  );
};
