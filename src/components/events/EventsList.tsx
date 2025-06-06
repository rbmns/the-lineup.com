
import React from 'react';
import { Event } from '@/types';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import EventCardList from '@/components/events/EventCardList';
import { useAuth } from '@/contexts/AuthContext';

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
  onEventSelect?: (eventId: string | null) => void;
  selectedEventId?: string | null;
  isOverlayMode?: boolean;
}

export const EventsList = React.memo(({
  events,
  onRsvp,
  showRsvpButtons = false,
  compact = false,
  className,
  style,
  loadingEventId,
  isLoading = false,
  hasActiveFilters = false,
  similarEvents = [],
  onEventSelect,
  selectedEventId,
  isOverlayMode = false
}: EventsListProps) => {
  const { isAuthenticated } = useAuth();
  
  // Only show RSVP functionality if user is authenticated AND showRsvpButtons is true
  const shouldShowRsvp = isAuthenticated && showRsvpButtons;
  
  // Handle event click for overlay mode
  const handleEventClick = (event: Event) => {
    if (onEventSelect) {
      onEventSelect(event.id);
    }
  };

  // If in overlay mode, show vertical list
  if (isOverlayMode) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </h3>
        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
          {events.map((event) => (
            <EventCardList
              key={event.id}
              event={event}
              onRsvp={shouldShowRsvp ? onRsvp : undefined}
              showRsvpButtons={shouldShowRsvp}
              onClick={handleEventClick}
              className={selectedEventId === event.id ? 'ring-2 ring-blue-500' : ''}
            />
          ))}
        </div>
      </div>
    );
  }

  // Use the enhanced LazyEventsList for the normal grid view
  return (
    <LazyEventsList
      mainEvents={events}
      relatedEvents={similarEvents}
      isLoading={isLoading}
      onRsvp={shouldShowRsvp ? onRsvp : undefined}
      showRsvpButtons={shouldShowRsvp}
      hasActiveFilters={hasActiveFilters}
      compact={compact}
      loadingEventId={loadingEventId}
      hideCount={false}
    />
  );
});

// Add display name for better debugging
EventsList.displayName = 'EventsList';

export default EventsList;
