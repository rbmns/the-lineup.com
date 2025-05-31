
import React from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { cn } from '@/lib/utils';
import { EventGrid as InfiniteEventGrid } from './list-components/EventGrid';

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
  showSignupTeaser?: boolean;
  eventsBeforeTeaserCount?: number;
  compact?: boolean;
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
  onLoadMore,
  showSignupTeaser = false,
  eventsBeforeTeaserCount = 6,
  compact
}) => {
  // If we have the lazy loading props, use the InfiniteEventGrid component
  if (visibleCount !== undefined && hasMore !== undefined && 
      isLoading !== undefined && onLoadMore !== undefined) {
    return (
      <InfiniteEventGrid
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
        showSignupTeaser={showSignupTeaser}
        eventsBeforeTeaserCount={eventsBeforeTeaserCount}
        compact={compact}
      />
    );
  }
  
  // Mobile-first responsive grid with better spacing
  return (
    <div 
      className={cn(
        "grid gap-4 w-full",
        "grid-cols-1", // Mobile: 1 column
        "sm:grid-cols-2", // Small screens: 2 columns  
        "lg:grid-cols-3", // Large screens: 3 columns
        "xl:grid-cols-3", // Extra large: keep 3 columns
        className
      )} 
      style={style}
    >
      {events.map((event) => (
        <div key={event.id} data-event-id={event.id} className="w-full">
          <EventCard 
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            compact={compact}
            className="h-full w-full"
            loadingEventId={loadingEventId}
            onClick={undefined}
          />
        </div>
      ))}
    </div>
  );
};
