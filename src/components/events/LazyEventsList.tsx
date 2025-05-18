
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { EventGrid } from '@/components/events/list-components/EventGrid';
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { SkeletonEventCard } from '@/components/events/SkeletonEventCard';
import { cn } from '@/lib/utils';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';

// Number of events to load initially
const INITIAL_VISIBLE_COUNT = 9;
// Number of additional events to load on each load more action
const LOAD_MORE_INCREMENT = 6;

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
  // State for handling lazy loading
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  
  // Reset visible count when main events change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [mainEvents]);

  const skeletonCards = Array.from({ length: 6 }, (_, i) => <SkeletonEventCard key={`skeleton-${i}`} />);
  const showNoResults = !isLoading && mainEvents.length === 0 && !hasActiveFilters;

  const resetFilters = () => {
    console.log("Reset filters clicked");
  };
  
  // Determine if we have more events to load
  const hasMore = mainEvents.length > visibleCount;
  
  // Handler for loading more events
  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_INCREMENT, mainEvents.length));
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
          visibleCount={visibleCount}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
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
