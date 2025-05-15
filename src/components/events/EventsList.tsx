
import React from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { cn } from '@/lib/utils';

interface EventsListProps {
  events: Event[];
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  isRsvpLoading?: boolean;
  showRsvpButtons?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  onRsvp,
  isRsvpLoading,
  showRsvpButtons = true,
  compact = false,
  className,
  style
}) => {
  return (
    <div 
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)} 
      style={style}
    >
      {events.map((event) => (
        <div key={event.id} className="event-list-item" data-event-id={event.id}>
          <EventCard 
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            view="grid"
            compact={true}
          />
        </div>
      ))}
    </div>
  );
};
