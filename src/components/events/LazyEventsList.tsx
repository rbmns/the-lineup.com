
import React, { useState } from 'react';
import { Event } from '@/types';
import { Loader2 } from 'lucide-react';
import { EventGrid } from './EventGrid';
import { EventsEmptyState } from './list-components/EventsEmptyState';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  compact?: boolean;
  loadingEventId?: string | null;
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents = [],
  relatedEvents = [],
  isLoading = false,
  onRsvp,
  showRsvpButtons = false,
  hasActiveFilters = false,
  compact = false,
  loadingEventId = null,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-500">Loading events...</span>
      </div>
    );
  }

  // Only show "no events found" when there are active filters but no results
  if (mainEvents.length === 0 && hasActiveFilters) {
    return (
      <EventsEmptyState
        message="No events found matching your filters"
        subMessage="Try adjusting your filters to see more events"
        resetFilters={undefined} // The reset button is already shown in the filter UI
        hasActiveFilters={hasActiveFilters}
      />
    );
  }

  return (
    <div className="space-y-10">
      {mainEvents.length > 0 && (
        <EventGrid
          events={mainEvents}
          onRsvp={onRsvp}
          showRsvpButtons={showRsvpButtons}
          loadingEventId={loadingEventId}
        />
      )}

      {relatedEvents.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6">You might also like</h3>
          <EventGrid
            events={relatedEvents}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            loadingEventId={loadingEventId}
          />
        </div>
      )}
    </div>
  );
};
