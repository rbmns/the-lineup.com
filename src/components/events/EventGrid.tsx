
import React from 'react';
import { Event } from '@/types';
import { EventCard } from '@/components/EventCard';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div
      className={cn(
        // Grid layout with consistent heights and better mobile spacing
        "grid w-full max-w-full overflow-x-hidden",
        // Responsive grid columns with tighter mobile gaps
        isMobile 
          ? "grid-cols-1 gap-4" 
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6",
        // Ensure equal row heights
        "auto-rows-fr",
        className
      )}
      style={style}
    >
      {events.map((event) => (
        <div key={event.id} data-event-id={event.id} className="w-full h-full">
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
