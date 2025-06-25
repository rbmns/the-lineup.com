
import React from 'react';
import { Event } from '@/types';
import { EventCountDisplay } from '@/components/events/EventCountDisplay';
import { EventCard } from '@/components/events/EventCard';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';

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
    return <EventsLoadingState />;
  }

  return (
    <div className="space-y-8">
      {!hideCount && (
        <div className="text-center">
          <EventCountDisplay count={events.length} />
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto"></div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            loadingEventId={loadingEventId}
            compact={compact}
            className="transform transition-all duration-300 hover:scale-[1.02]"
          />
        ))}
      </div>
    </div>
  );
};
