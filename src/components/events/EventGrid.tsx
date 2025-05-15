
import React from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { cn } from '@/lib/utils';

interface EventGridProps {
  events: Event[];
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  isRsvpLoading?: boolean;
  showRsvpButtons?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loadingEventId?: string | null;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onRsvp,
  isRsvpLoading,
  showRsvpButtons = true,
  className,
  style,
  loadingEventId
}) => {
  // All cards will now have the same style, no special treatment for first card
  
  return (
    <div 
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", className)} 
      style={style}
    >
      {events.map((event) => (
        <div key={event.id} data-event-id={event.id} className="h-full">
          <EventCard 
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            view="grid"
            compact={true}  // All cards are now compact
            featured={false} // No featured cards
            isLoading={loadingEventId === event.id}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
};
