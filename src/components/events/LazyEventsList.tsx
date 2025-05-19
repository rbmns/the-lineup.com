
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { EventGrid } from '@/components/events/EventGrid';
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { SkeletonEventCard } from '@/components/events/SkeletonEventCard';
import { cn } from '@/lib/utils';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';
import { EventsSignupTeaser } from '@/components/events/list-components/EventsSignupTeaser';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Number of events to load initially
const INITIAL_VISIBLE_COUNT = 9;
// Number of additional events to load on each load more action
const LOAD_MORE_INCREMENT = 6;
// Number of events to show before the teaser (3 rows of 3 events = 9 events)
const EVENTS_BEFORE_TEASER = 9;

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  compact?: boolean;
  loadingEventId?: string | null;
  hideCount?: boolean;
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents,
  relatedEvents = [],
  isLoading,
  onRsvp,
  showRsvpButtons = true,
  hasActiveFilters = false,
  compact = false,
  loadingEventId = null,
  hideCount = false
}) => {
  // Get authentication state
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
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

  // Check if we have no main events but have related/similar events to show
  const showRelatedEventsMessage = !isLoading && mainEvents.length === 0 && hasActiveFilters && relatedEvents.length > 0;

  // Determine if we should show the signup teaser
  // Show only for non-authenticated users and when we have more than EVENTS_BEFORE_TEASER events
  const showSignupTeaser = !isAuthenticated && mainEvents.length > EVENTS_BEFORE_TEASER;

  // Split events into before and after teaser
  const eventsBeforeTeaser = mainEvents.slice(0, EVENTS_BEFORE_TEASER);
  const eventsAfterTeaser = mainEvents.slice(EVENTS_BEFORE_TEASER, visibleCount);

  return (
    <div className={cn('space-y-6', compact ? 'compact-view' : '')}>
      {isLoading && <EventsLoadingState />}

      {showNoResults && (
        <NoResultsFound resetFilters={resetFilters} />
      )}
      
      {/* Remove the events count display here */}

      {!isLoading && mainEvents.length > 0 && (
        <>
          {/* Display events before the teaser */}
          <EventGrid
            events={eventsBeforeTeaser}
            visibleCount={eventsBeforeTeaser.length}
            hasMore={false}
            isLoading={isLoading}
            onLoadMore={() => {}}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            className="animate-fade-in"
            style={{ animationDuration: '150ms' }}
            loadingEventId={loadingEventId}
          />

          {/* Show signup teaser after the first set of events */}
          {showSignupTeaser && <EventsSignupTeaser />}

          {/* Display remaining events after the teaser if there are any */}
          {eventsAfterTeaser.length > 0 && (
            <EventGrid
              events={eventsAfterTeaser}
              visibleCount={eventsAfterTeaser.length}
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
          
          {/* If there are more events to load and we're at the end of visible events */}
          {hasMore && visibleCount >= EVENTS_BEFORE_TEASER + eventsAfterTeaser.length && (
            <div className="flex justify-center pt-4 pb-8">
              <Button 
                onClick={handleLoadMore} 
                variant="outline"
                className="border-gray-300"
              >
                Load more events
              </Button>
            </div>
          )}
        </>
      )}

      {showRelatedEventsMessage && (
        <div className="my-8 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Related events which you might also like
          </h2>
          <p className="text-gray-600 mb-6">
            We found some similar events around the same time that might interest you
          </p>
        </div>
      )}

      {relatedEvents && relatedEvents.length > 0 && (
        <RelatedEventsSection events={relatedEvents} />
      )}

      {!isLoading && mainEvents.length === 0 && hasActiveFilters && relatedEvents.length === 0 && (
        <NoResultsFound 
          message="No events found with the current filters."
          resetFilters={resetFilters}
        />
      )}
    </div>
  );
};
