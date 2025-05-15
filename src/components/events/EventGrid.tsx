
import React from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard'; // Assuming this is the main EventCard
import { cn } from '@/lib/utils';

interface EventGridProps {
  events: Event[];
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  // isRsvpLoading?: boolean; // Replaced by loadingEventId
  showRsvpButtons?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loadingEventId?: string | null; // Added
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onRsvp,
  // isRsvpLoading, // Removed
  showRsvpButtons = true,
  className,
  style,
  loadingEventId // Added
}) => {
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
            // view="grid" // EventCard doesn't seem to have a 'view' prop, remove if not defined
            compact={true}
            // featured={false} // EventCard doesn't seem to have a 'featured' prop, remove if not defined
            // isLoading={loadingEventId === event.id} // EventCard has its own internal loading, but we can pass this down
            className="h-full"
            loadingEventId={loadingEventId} // Pass to EventCard
          />
        </div>
      ))}
    </div>
  );
};
