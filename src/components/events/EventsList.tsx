
import React from 'react';
import { Event } from '@/types';
import { LazyEventsList } from '@/components/events/LazyEventsList';

interface EventsListProps {
  events: Event[];
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loadingEventId?: string | null;
  isLoading?: boolean;
  hasActiveFilters?: boolean;
  similarEvents?: Event[];
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  onRsvp,
  showRsvpButtons = true,
  compact = false,
  className,
  style,
  loadingEventId,
  isLoading = false,
  hasActiveFilters = false,
  similarEvents = []
}) => {
  // Use the enhanced LazyEventsList for a unified approach to event listing
  return (
    <LazyEventsList
      mainEvents={events}
      relatedEvents={similarEvents}
      isLoading={isLoading}
      onRsvp={onRsvp}
      showRsvpButtons={showRsvpButtons}
      hasActiveFilters={hasActiveFilters}
      compact={compact}
      loadingEventId={loadingEventId}
    />
  );
};
