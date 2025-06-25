
import React from 'react';
import { Event } from '@/types';
import { EventCountDisplay } from '@/components/events/EventCountDisplay';
import { EventCard } from '@/components/events/EventCard';
import { EventsLoadingSkeleton } from '@/components/events/EventsLoadingSkeleton';

interface PrimaryResultsProps {
  events: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  showRsvpButtons?: boolean;
  loadingEventId?: string | null;
  hideCount?: boolean;
  compact?: boolean;
}

export const PrimaryResults: React.FC<PrimaryResultsProps> = ({
  events,
  isLoading,
  onRsvp,
  showRsvpButtons = false,
  loadingEventId,
  hideCount = false,
  compact = false
}) => {
  if (isLoading) {
    return <EventsLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {!hideCount && <EventCountDisplay count={events.length} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            isLoading={loadingEventId === event.id}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};
