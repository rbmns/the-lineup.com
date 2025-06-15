import React from 'react';
import { Event } from '@/types';
import PolymetEventCard from '@/components/polymet/event-card';
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
        // Avatar demo: doesn't display avatars in current event type
        avatars: [],
      }
    : undefined,
  showRsvp: false,
  // RSVP handlers can be attached later if you decide to switch fully
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

// NEW: Use PolymetEventCard for all events in the grid so you can compare.
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

  // Render using PolymetEventCard for all events, as preview
  return (
    <div
      className={cn(
        "grid gap-3 w-full",
        "grid-cols-1",
        "xs:grid-cols-1",
        "sm:grid-cols-2",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "xl:grid-cols-3",
        "2xl:grid-cols-4",
        className
      )}
      style={style}
    >
      {events.map((event) => (
        <div key={event.id} data-event-id={event.id} className="w-full min-w-0">
          <PolymetEventCard {...mapEventToPolymetCard(event)} />
        </div>
      ))}
    </div>
  );
};
