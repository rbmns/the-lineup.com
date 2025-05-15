
import React from 'react';
import { Event } from '@/types';
import { EventsList } from '@/components/events/EventsList';
import { EventGrid } from '@/components/events/EventGrid';
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { SkeletonEventCard } from '@/components/events/SkeletonEventCard';
import { cn } from '@/lib/utils';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading: boolean;
  isRsvpLoading?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  compact?: boolean;
  defaultView?: 'list' | 'grid';
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents,
  relatedEvents = [],
  isLoading,
  isRsvpLoading = false,
  onRsvp,
  showRsvpButtons = true,
  hasActiveFilters = false,
  compact = false
}) => {
  // Loading skeleton cards
  const skeletonCards = Array.from({ length: 6 }, (_, i) => <SkeletonEventCard key={`skeleton-${i}`} />);

  // Determine if we should show the "no results" message
  const showNoResults = !isLoading && mainEvents.length === 0 && !hasActiveFilters;

  // Dummy resetFilters function for NoResultsFound component
  const resetFilters = () => {
    console.log("Reset filters clicked");
    // This would typically dispatch an action or call a prop function
  };

  return (
    <div className={cn('space-y-6', compact ? 'compact-view' : '')}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skeletonCards}
        </div>
      )}

      {/* No Results Message */}
      {showNoResults && (
        <NoResultsFound resetFilters={resetFilters} />
      )}
      
      {/* Events Count */}
      {!isLoading && mainEvents.length > 0 && (
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-gray-500">
            {mainEvents.length} {mainEvents.length === 1 ? 'event' : 'events'} found
          </span>
        </div>
      )}

      {/* Main Events */}
      {!isLoading && mainEvents.length > 0 && (
        <EventGrid
          events={mainEvents}
          onRsvp={onRsvp}
          isRsvpLoading={isRsvpLoading}
          showRsvpButtons={showRsvpButtons}
          className="animate-fade-in"
          style={{ animationDuration: '100ms' }}
        />
      )}

      {/* Related Events Section */}
      {relatedEvents && relatedEvents.length > 0 && (
        <RelatedEventsSection events={relatedEvents} />
      )}

      {/* No results message when filters are active */}
      {!isLoading && mainEvents.length === 0 && hasActiveFilters && (
        <NoResultsFound 
          message="No events found with the current filters."
          resetFilters={resetFilters}
        />
      )}
    </div>
  );
};
