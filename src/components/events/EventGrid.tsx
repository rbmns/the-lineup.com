
import React from 'react';
import { Event } from '@/types';
import PolymetEventCard from '@/components/polymet/event-card';
import { EventCard } from '@/components/EventCard';
import { cn } from '@/lib/utils';
import { EventGrid as InfiniteEventGrid } from './list-components/EventGrid';

// Helper function to map Event to PolymetEventCard props
const mapEventToPolymetCard = (event: Event) => ({
  id: event.id,
  title: event.title,
  image: event.image_urls?.[0] || "/img/default.jpg",
  category: event.event_category || "Other",
  vibe: event.tags && event.tags.length > 0 ? event.tags[0] : undefined,
  host: event.creator 
    ? {
        id: event.creator.id,
        name: event.creator.username || event.creator.email || "Host",
        avatar: Array.isArray(event.creator.avatar_url)
          ? event.creator.avatar_url[0]
          : event.creator.avatar_url,
      }
    : undefined,
  location: event.venues?.name || event.location || "",
  date: event.start_date || "",
  time: event.start_time || undefined,
  attendees: event.going_count || event.interested_count
    ? {
        count: (event.going_count ?? 0) + (event.interested_count ?? 0),
        avatars: [],
      }
    : undefined,
  showRsvp: false,
  className: "h-full w-full"
});

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
  visibleCount,
  hasMore,
  isLoading,
  onLoadMore,
  showSignupTeaser = false,
  eventsBeforeTeaserCount = 6,
  compact
}) => {
  // If we have the lazy loading props, use the InfiniteEventGrid as before
  if (
    visibleCount !== undefined &&
    hasMore !== undefined &&
    isLoading !== undefined &&
    onLoadMore !== undefined
  ) {
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
        showSignupTeaser={showSignupTeaser}
        eventsBeforeTeaserCount={eventsBeforeTeaserCount}
        compact={compact}
      />
    );
  }

  // Optimized grid for all viewport sizes - better tablet experience
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6 w-full",
        // Mobile: 1 column
        "grid-cols-1",
        // Small tablets: 2 columns with wider cards
        "sm:grid-cols-2",
        // Medium tablets: 2 columns
        "md:grid-cols-2",
        // Large tablets and small desktops: 3 columns
        "lg:grid-cols-3",
        // Large desktops: 3 columns (max for good card width)
        "xl:grid-cols-3",
        "2xl:grid-cols-4",
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
            loadingEventId={loadingEventId}
            compact={compact}
          />
        </div>
      ))}
    </div>
  );
};
