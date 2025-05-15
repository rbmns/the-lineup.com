
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
  // Assign visual variants to events to create a more interesting grid
  const getCardStyle = (index: number) => {
    // Alternate between various styles to create a visually interesting grid
    if (index === 0) return true; // First event is featured
    return false;
  };

  return (
    <div 
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", className)} 
      style={style}
    >
      {events.map((event, index) => (
        <div key={event.id} data-event-id={event.id} className="h-full">
          <EventCard 
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            view="grid"
            compact={index !== 0 && index % 4 !== 0} // Make some cards compact
            featured={getCardStyle(index)}
            isLoading={loadingEventId === event.id}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
};
