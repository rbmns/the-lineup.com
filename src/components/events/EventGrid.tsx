
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
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onRsvp,
  isRsvpLoading,
  showRsvpButtons = true,
  className,
  style
}) => {
  return (
    <div 
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)} 
      style={style}
    >
      {events.map((event) => (
        <div key={event.id} data-event-id={event.id}>
          <EventCard 
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            view="grid" // Now this is a valid prop since we added it to EventCardProps
          />
        </div>
      ))}
    </div>
  );
};
