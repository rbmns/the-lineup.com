
import React, { useRef, useEffect } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { Loader2 } from 'lucide-react';

interface EventResultsSectionProps {
  title?: string;
  events: Event[];
  visibleEvents: Event[];
  hasMore: boolean;
  isLoading: boolean;
  observerTargetRef: React.RefObject<HTMLDivElement>;
  handleRsvp: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  isAuthenticated: boolean;
}

export const EventResultsSection: React.FC<EventResultsSectionProps> = ({
  title,
  events,
  visibleEvents,
  hasMore,
  isLoading,
  observerTargetRef,
  handleRsvp,
  isAuthenticated
}) => {
  return (
    <div>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {title}
        </h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleEvents.map((event) => (
          <EventCard 
            key={event.id} 
            event={event}
            onRsvp={isAuthenticated ? handleRsvp : undefined}
            showRsvpButtons={isAuthenticated}
          />
        ))}
      </div>
      
      {/* Loading indicator for infinite scroll */}
      {hasMore && visibleEvents.length < events.length && (
        <div 
          ref={observerTargetRef}
          className="flex justify-center py-8"
        >
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
};
