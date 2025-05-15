
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
  loadingEventId?: string | null;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  onRsvp,
  isRsvpLoading,
  showRsvpButtons = true,
  compact = false,
  className,
  style,
  loadingEventId
}) => {
  // Function to determine if an event should be featured based on its index
  const isEventFeatured = (index: number): boolean => {
    return index === 0 || index % 7 === 0; // First event and every 7th event
  };

  return (
    <div 
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", className)} 
      style={style}
    >
      {events.map((event, index) => (
        <div key={event.id} className="event-list-item" data-event-id={event.id}>
          <EventCard 
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            view="grid"
            compact={compact || (!isEventFeatured(index) && index % 3 !== 0)}
            featured={isEventFeatured(index)}
            isLoading={loadingEventId === event.id}
          />
        </div>
      ))}
    </div>
  );
};
