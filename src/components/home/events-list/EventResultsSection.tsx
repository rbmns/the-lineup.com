
import React from 'react';
import { Event } from '@/types';
import EventCard from '@/components/events/EventCard';

interface EventResultsSectionProps {
  events: Event[];
  visibleEvents: Event[];
  hasMore: boolean;
  isLoading: boolean;
  observerTargetRef: React.RefObject<HTMLDivElement>;
  handleRsvp: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  isAuthenticated: boolean;
}

export const EventResultsSection: React.FC<EventResultsSectionProps> = ({
  events,
  visibleEvents,
  hasMore,
  isLoading,
  observerTargetRef,
  handleRsvp,
  isAuthenticated
}) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleEvents.map((event) => (
          <div key={event.id}>
            <EventCard
              event={event}
              onRsvp={isAuthenticated ? (status) => handleRsvp(event.id, status) : undefined}
              showRsvpButtons={isAuthenticated}
            />
          </div>
        ))}
      </div>
      
      {/* Observer target for infinite scrolling */}
      {hasMore && !isLoading && (
        <div 
          ref={observerTargetRef}
          className="h-10 w-full flex items-center justify-center"
        >
          <div className="w-8 h-8 border-t-2 border-b-2 border-gray-300 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
