
import React from 'react';
import { Event } from '@/types';
// import { EventsList } from '@/components/events/EventsList'; // This was for the old list view, EventGrid is used
import { EventGrid } from '@/components/events/EventGrid'; // Ensure this is the correct EventGrid path
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { SkeletonEventCard } from '@/components/events/SkeletonEventCard';
import { cn } from '@/lib/utils';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading: boolean;
  // isRsvpLoading?: boolean; // Replaced by loadingEventId
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  compact?: boolean;
  // defaultView?: 'list' | 'grid'; // Not currently used, EventGrid is hardcoded
  loadingEventId?: string | null; // Added
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents,
  relatedEvents = [],
  isLoading,
  // isRsvpLoading = false, // Removed
  onRsvp,
  showRsvpButtons = true,
  hasActiveFilters = false,
  compact = false, // This prop seems to not be used by EventGrid directly, but kept for consistency
  loadingEventId = null
}) => {
  const skeletonCards = Array.from({ length: 6 }, (_, i) => <SkeletonEventCard key={`skeleton-${i}`} />);
  const showNoResults = !isLoading && mainEvents.length === 0 && !hasActiveFilters;

  const resetFilters = () => {
    console.log("Reset filters clicked");
  };

  return (
    <div className={cn('space-y-6', compact ? 'compact-view' : '')}>
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skeletonCards}
        </div>
      )}

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
          // isRsvpLoading={isRsvpLoading} // Removed, use loadingEventId
          showRsvpButtons={showRsvpButtons}
          className="animate-fade-in" // Keep UI nice-to-haves
          style={{ animationDuration: '100ms' }} // Keep UI nice-to-haves
          loadingEventId={loadingEventId} // Pass down
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
