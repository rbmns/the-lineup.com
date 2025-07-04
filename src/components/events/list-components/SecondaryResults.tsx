
import React from 'react';
import { Event } from '@/types';
import { EventCard } from '@/components/EventCard';
import { EventGrid } from '@/components/events/list-components/EventGrid';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';

interface SecondaryResultsProps {
  events: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  showRsvpButtons?: boolean;
  loadingEventId?: string | null;
  compact?: boolean;
}

export const SecondaryResults: React.FC<SecondaryResultsProps> = ({
  events,
  isLoading,
  onRsvp,
  showRsvpButtons = false,
  loadingEventId,
  compact = false
}) => {
  if (isLoading) {
    return <EventsLoadingState />;
  }

  if (events.length === 0) {
    return null;
  }

  // Convert onRsvp to the format expected by EventCard
  const handleRsvp = onRsvp ? async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean | void> => {
    await onRsvp(eventId, status);
    return true;
  } : undefined;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Similar Events You Might Like
      </h3>
      
      <EventGrid>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            compact={compact}
            showRsvpButtons={showRsvpButtons}
            onRsvp={handleRsvp}
            loadingEventId={loadingEventId}
          />
        ))}
      </EventGrid>
    </div>
  );
};
