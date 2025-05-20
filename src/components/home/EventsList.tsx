
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Event } from '@/types';
import { Separator } from '@/components/ui/separator';
import { LoadingIndicator } from './events-list/LoadingIndicator';
import { NoResultsMessage } from './events-list/NoResultsMessage';
import { EventResultsSection } from './events-list/EventResultsSection';
import { ResultsDivider } from './events-list/ResultsDivider';
import { useInfiniteScroll } from './events-list/useInfiniteScroll';

// Number of events to load initially and on each load more
const EVENTS_PER_PAGE = 12;

interface EventsListProps {
  isLoading: boolean;
  isSearching: boolean;
  displayEvents: Event[];
  queryOnlyResults?: Event[] | null;
  searchQuery?: string;
  noResultsFound: boolean;
  similarEvents: Event[];
  resetFilters: () => void;
  handleRsvpAction: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  isAuthenticated: boolean;
}

export const EventsList: React.FC<EventsListProps> = ({
  isLoading,
  isSearching,
  displayEvents,
  queryOnlyResults,
  searchQuery,
  noResultsFound,
  similarEvents,
  resetFilters,
  handleRsvpAction,
  isAuthenticated
}) => {
  // Always show events - either the matched ones, similar ones, or a combination
  // This ensures we never show "no results"
  let eventsToDisplay = [];
  
  if (displayEvents.length > 0) {
    // We have direct search results
    eventsToDisplay = displayEvents;
  } else if (similarEvents.length > 0) {
    // We have similar events but no direct results
    eventsToDisplay = similarEvents;
  } else {
    // Fallback case: we should never reach here because similarEvents should always have something
    // but just in case, we'll handle it
    eventsToDisplay = [];
  }
  
  // Split events into filtered results and query-only results
  const primaryResults = eventsToDisplay.filter(event => !(event as any).isQueryOnly);
  const secondaryResults = eventsToDisplay.filter(event => (event as any).isQueryOnly);
  
  // If we have no events at all to display, we don't show the reset filters button
  const showResetFilters = (primaryResults.length === 0 && secondaryResults.length === 0) && searchQuery;
  
  // Set up infinite scrolling for primary results
  const primaryScroll = useInfiniteScroll({
    initialCount: EVENTS_PER_PAGE,
    totalCount: primaryResults.length,
    isLoading: isLoading
  });
  
  // Set up infinite scrolling for secondary results
  const secondaryScroll = useInfiniteScroll({
    initialCount: EVENTS_PER_PAGE,
    totalCount: secondaryResults.length,
    isLoading: isLoading
  });
  
  // Reset visible counts when search query changes
  React.useEffect(() => {
    primaryScroll.setVisibleCount(EVENTS_PER_PAGE);
    secondaryScroll.setVisibleCount(EVENTS_PER_PAGE);
  }, [searchQuery]);
  
  // Visible events for lazy loading
  const visiblePrimaryEvents = primaryResults.slice(0, primaryScroll.visibleCount);
  const visibleSecondaryEvents = secondaryResults.slice(0, secondaryScroll.visibleCount);
  
  // Wrapper for handling RSVP actions
  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    try {
      console.log('EventsList - RSVP triggered:', { eventId, status });
      await handleRsvpAction(eventId, status);
    } catch (error) {
      console.error('Error in EventsList RSVP handler:', error);
    }
  };
  
  // Loading state
  if (isLoading || isSearching) {
    return <LoadingIndicator />;
  }
  
  return (
    <div id="search-results" className="space-y-12">
      {/* Main Results */}
      {primaryResults.length > 0 ? (
        <div>
          {searchQuery && (
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              {primaryResults.length} {primaryResults.length === 1 ? 'result' : 'results'}{searchQuery ? ` for "${searchQuery}"` : ''}
            </h3>
          )}
          
          <EventResultsSection 
            events={primaryResults}
            visibleEvents={visiblePrimaryEvents}
            hasMore={primaryScroll.hasMore}
            isLoading={isLoading}
            observerTargetRef={primaryScroll.observerTarget}
            handleRsvp={handleRsvp}
            isAuthenticated={isAuthenticated}
          />
          
          {/* Divider between exact and similar results */}
          {!primaryScroll.hasMore && similarEvents.length > 0 && (
            <ResultsDivider />
          )}
        </div>
      ) : (
        noResultsFound && (
          <NoResultsMessage 
            searchQuery={searchQuery} 
            resetFilters={resetFilters} 
          />
        )
      )}

      {/* Similar Results Section */}
      {noResultsFound && similarEvents.length > 0 && (
        <div className="pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Similar Events You Might Like
          </h3>
          
          <EventResultsSection 
            events={similarEvents}
            visibleEvents={similarEvents.slice(0, secondaryScroll.visibleCount)}
            hasMore={secondaryScroll.hasMore}
            isLoading={isLoading}
            observerTargetRef={secondaryScroll.observerTarget}
            handleRsvp={handleRsvp}
            isAuthenticated={isAuthenticated}
          />
        </div>
      )}
      
      {showResetFilters && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="mx-auto"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
