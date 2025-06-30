
import React from 'react';
import { Event } from '@/types';
import { EventCard } from '@/components/EventCard';
import { cn } from '@/lib/utils';

interface EventGridProps {
  events: Event[];
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loadingEventId?: string | null;
  compact?: boolean;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onRsvp,
  showRsvpButtons = true,
  className,
  style,
  loadingEventId,
  compact
}) => {
  return (
    <div
      className={cn(
        // Using design system grid layout
        "grid gap-4 sm:gap-6 w-full",
        // Responsive grid using design system breakpoints
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4",
        className
      )}
      style={style}
    >
      {events.map((event) => (
        <div key={event.id} data-event-id={event.id} className="w-full min-w-0 h-full">
          <EventCard 
            event={event} 
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            loadingEventId={loadingEventId}
            compact={compact}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
};
