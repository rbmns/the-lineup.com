
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
  
  // Improved responsive grid with better breakpoints for smaller screens
  return (
    <div 
      className={cn(
        "grid gap-3 w-full",
        "grid-cols-1", // Mobile: 1 column (very small screens)
        "xs:grid-cols-1", // Extra small: 1 column
        "sm:grid-cols-2", // Small screens: 2 columns (576px+)
        "md:grid-cols-2", // Medium screens: 2 columns (768px+)
        "lg:grid-cols-3", // Large screens: 3 columns (1024px+)
        "xl:grid-cols-3", // Extra large: 3 columns (1280px+)
        "2xl:grid-cols-4", // 2XL: 4 columns for very wide screens
        className
      )} 
      style={style}
    >
      {events.map((event) => (
        <div key={event.id} data-event-id={event.id} className="w-full min-w-0">
          <EventCard 
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            compact={compact}
            className="h-full w-full"
            loadingEventId={loadingEventId}
          />
        </div>
      ))}
    </div>
  );
};
