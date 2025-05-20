
import React, { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types';
import { EventGrid } from '@/components/events/EventGrid';
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';
import { EventsSignupTeaser } from '@/components/events/list-components/EventsSignupTeaser';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPositionHandler } from '@/hooks/events/useScrollPositionHandler';
import { useEventListState } from '@/hooks/events/useEventListState';

// Number of events to load initially
const INITIAL_VISIBLE_COUNT = 9;
// Number of additional events to load on each load more action
const LOAD_MORE_INCREMENT = 6;
// Number of events to show before the teaser (2 rows of 3 events = 6 events)
const EVENTS_BEFORE_TEASER = 6;

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
  
  // Get event list state from custom hook
  const {
    similarEvents,
    initialRenderRef,
    scrollRestoredRef,
    rsvpInProgressRef
  } = useEventListState();
  
  // State for handling lazy loading
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Reset visible count when main events change due to filters
  useEffect(() => {
    // Only reset if it's not the initial render and not during RSVP operations
    if (!initialRenderRef.current && !rsvpInProgressRef.current) {
      setVisibleCount(INITIAL_VISIBLE_COUNT);
      console.log("Events changed, resetting visible count");
    }
  }, [mainEvents, initialRenderRef, rsvpInProgressRef]);
  
  // Handle scroll position for navigation and RSVP operations
  useScrollPositionHandler(initialRenderRef, scrollRestoredRef, rsvpInProgressRef, mainEvents);
  
  // Determine if we have more events to load
  const hasMore = mainEvents.length > visibleCount;
  
  // Handler for loading more events
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    console.log("Loading more events...");
    
    // Use setTimeout to simulate a small delay for smoother UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + LOAD_MORE_INCREMENT, mainEvents.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, mainEvents.length]);

  // Prepare the events to display
  const visibleEvents = mainEvents.slice(0, visibleCount);
  
  const showNoResults = !isLoading && mainEvents.length === 0;
  const showRelatedEventsMessage = showNoResults && hasActiveFilters && relatedEvents.length > 0;
  
  // Determine if we should show the signup teaser
  // Show only for non-authenticated users and when we have more than EVENTS_BEFORE_TEASER events
  const showSignupTeaser = !isAuthenticated && mainEvents.length > EVENTS_BEFORE_TEASER;
  
  return (
    <div className="space-y-6">
      {isLoading && <EventsLoadingState />}

      {showNoResults && !isLoading && (
        <NoResultsFound 
          resetFilters={() => console.log("Reset filters clicked")} 
          message={hasActiveFilters ? "No events found with the current filters." : "No events found."}
        />
      )}
      
      {!isLoading && mainEvents.length > 0 && (
        <>
          {/* All events displayed with unified grid */}
          <EventGrid
            events={visibleEvents}
            visibleCount={visibleCount}
            hasMore={hasMore}
            isLoading={isLoadingMore}
            onLoadMore={handleLoadMore}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            className="animate-fade-in"
            style={{ animationDuration: '150ms' }}
            loadingEventId={loadingEventId}
            showSignupTeaser={showSignupTeaser}
            eventsBeforeTeaserCount={EVENTS_BEFORE_TEASER}
          />
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
    </div>
  );
};
