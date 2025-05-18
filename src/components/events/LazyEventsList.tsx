
import React from 'react';
import { Event } from '@/types';
import { EventGrid } from '@/components/events/list-components/EventGrid';
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { SkeletonEventCard } from '@/components/events/SkeletonEventCard';
import { cn } from '@/lib/utils';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  compact?: boolean;
  loadingEventId?: string | null;
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents,
  relatedEvents = [],
  isLoading,
  onRsvp,
  showRsvpButtons = true,
  hasActiveFilters = false,
  compact = false,
  loadingEventId = null
}) => {
  const skeletonCards = Array.from({ length: 6 }, (_, i) => <SkeletonEventCard key={`skeleton-${i}`} />);
  const showNoResults = !isLoading && mainEvents.length === 0 && !hasActiveFilters;

  const resetFilters = () => {
    console.log("Reset filters clicked");
  };

  return (
    <div className={cn('space-y-6', compact ? 'compact-view' : '')}>
      {isLoading && <EventsLoadingState />}

      {showNoResults && (
        <NoResultsFound resetFilters={resetFilters} />
      )}
      
      {!isLoading && mainEvents.length > 0 && (
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-gray-500">
            {mainEvents.length} {mainEvents.length === 1 ? 'event' : 'events'} found
          </span>
        </div>
      )}

      {!isLoading && mainEvents.length > 0 && (
        <EventGrid
          events={mainEvents}
          onRsvp={onRsvp}
          showRsvpButtons={showRsvpButtons}
          className="animate-fade-in"
          style={{ animationDuration: '150ms' }}
          loadingEventId={loadingEventId}
        />
      )}

      {relatedEvents && relatedEvents.length > 0 && (
        <RelatedEventsSection events={relatedEvents} />
      )}

      {!isLoading && mainEvents.length === 0 && hasActiveFilters && (
        <NoResultsFound 
          message="No events found with the current filters."
          resetFilters={resetFilters}
        />
      )}
    </div>
  );
};
