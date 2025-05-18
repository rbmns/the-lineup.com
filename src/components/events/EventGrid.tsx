import React from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { cn } from '@/lib/utils';
import { EventGrid as ListEventGrid } from './list-components/EventGrid';

interface EventGridProps {
  events: Event[];
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loadingEventId?: string | null;
  visibleCount?: number;
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onRsvp,
  showRsvpButtons = true,
  className,
  style,
  loadingEventId,
  visibleCount,
  hasMore,
  isLoading,
  onLoadMore
}) => {
  // If we have the lazy loading props, use the ListEventGrid component
  if (visibleCount !== undefined && hasMore !== undefined && 
      isLoading !== undefined && onLoadMore !== undefined) {
    return (
      <ListEventGrid
        events={events}
        visibleCount={visibleCount}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={onLoadMore}
        onRsvp={onRsvp}
        showRsvpButtons={showRsvpButtons}
        className={className}
        style={style}
        loadingEventId={loadingEventId}
      />
    );
  }
  
  // Otherwise, use the simple grid
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
            compact={true}
            className="h-full"
            loadingEventId={loadingEventId}
          />
        </div>
      ))}
    </div>
  );
};
