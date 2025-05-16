
import React from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';

interface EventsListProps {
  events: Event[];
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  loadingEventId?: string | null;
  compact?: boolean;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  onRsvp,
  showRsvpButtons = true,
  loadingEventId,
  compact = false
}) => {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "grid gap-6",
      compact 
        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    )}>
      {events.map((event) => (
        <div key={event.id} data-event-id={event.id} className="h-full">
          <EventCard 
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            isRsvpLoading={loadingEventId === event.id}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
};

// Helper function to properly format classNames
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
