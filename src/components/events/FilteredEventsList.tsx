
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Event } from '@/types';
import { Separator } from '@/components/ui/separator';
import { EventsLoadingState } from './list-components/EventsLoadingState';
import NoResultsFound from './list-components/NoResultsFound';
import { PrimaryResults } from './list-components/PrimaryResults';
import { SecondaryResults } from './list-components/SecondaryResults';

// Number of events to load initially and on each load more
const EVENTS_PER_PAGE = 12;

interface FilteredEventsListProps {
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

export const FilteredEventsList: React.FC<FilteredEventsListProps> = ({
  isLoading,
  isSearching,
  displayEvents,
  searchQuery,
  noResultsFound,
  similarEvents,
  resetFilters,
  handleRsvpAction,
  isAuthenticated
}) => {
  const [primaryVisibleCount, setPrimaryVisibleCount] = useState(EVENTS_PER_PAGE);
  const [secondaryVisibleCount, setSecondaryVisibleCount] = useState(EVENTS_PER_PAGE);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Track initial load state
  useEffect(() => {
    if (!isLoading && !isSearching) {
      // Set a small delay to ensure all data is processed
      const timer = setTimeout(() => {
        setInitialLoadComplete(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isSearching]);
  
  // Show loading state while events are loading
  if (isLoading || isSearching) {
    return <EventsLoadingState />;
  }
  
  // Split events into filtered results and query-only results
  const primaryResults = displayEvents.filter(event => !(event as any).isQueryOnly);
  const secondaryResults = displayEvents.filter(event => (event as any).isQueryOnly);
  
  // Calculate if there are more events to load
  const primaryHasMore = primaryVisibleCount < primaryResults.length;
  const secondaryHasMore = secondaryVisibleCount < similarEvents.length;
  
  // Handle load more for primary results
  const handlePrimaryLoadMore = () => {
    setPrimaryVisibleCount(prev => prev + EVENTS_PER_PAGE);
  };
  
  // Handle load more for secondary results
  const handleSecondaryLoadMore = () => {
    setSecondaryVisibleCount(prev => prev + EVENTS_PER_PAGE);
  };
  
  // If we have no events at all to display, we don't show the reset filters button
  const showResetFilters = (primaryResults.length === 0 && secondaryResults.length === 0) && searchQuery;
  
  // Flag to show the similar events section
  const showSimilarEvents = noResultsFound && similarEvents.length > 0;
  
  // Flag to show the divider between primary and secondary results
  const showDivider = primaryResults.length > 0 && similarEvents.length > 0;
  
  // Flag to show "no exact matches" message - only after initial load is complete
  const showNoExactMatchesMessage = primaryResults.length === 0 && !noResultsFound && similarEvents.length > 0 && initialLoadComplete;
  
  // Flag to show "no more matches" message at the end of primary results
  const showNoMoreMatchesMessage = primaryResults.length > 0 && !primaryHasMore;
  
  // New flag to show the related results message
  const showRelatedResultsMessage = noResultsFound && similarEvents.length > 0 && initialLoadComplete;
  
  return (
    <div id="search-results" className="space-y-12">
      {/* No Results Message - Only show after initial load is complete */}
      {noResultsFound && primaryResults.length === 0 && initialLoadComplete && similarEvents.length === 0 && (
        <NoResultsFound 
          message="No events match your search"
          searchQuery={searchQuery || ""}
          resetFilters={resetFilters}
        />
      )}
      
      {/* Related Results Message - Show when no exact matches but we have similar results */}
      {showRelatedResultsMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-amber-800 font-medium">No results match all your selected filters.</p>
          <p className="text-amber-700 text-sm mt-1">Showing related events that might interest you.</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetFilters}
            className="mt-2 bg-white text-amber-700 border-amber-300 hover:bg-amber-100"
          >
            Clear all filters
          </Button>
        </div>
      )}
      
      {/* Main Results */}
      <PrimaryResults 
        events={primaryResults}
        isLoading={isLoading}
        onRsvp={isAuthenticated ? handleRsvpAction : undefined}
        showRsvpButtons={isAuthenticated}
        visibleCount={primaryVisibleCount}
        hasMore={primaryHasMore}
        onLoadMore={handlePrimaryLoadMore}
      />
      
      {/* No exact matches message - Only show after initial load is complete */}
      {showNoExactMatchesMessage && initialLoadComplete && (
        <div className="text-center py-4 bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-gray-600 text-sm">No exact matches for your filters.</p>
          <p className="text-gray-500 text-xs mt-1">Showing similar results below.</p>
        </div>
      )}
      
      {/* No more matches message */}
      {showNoMoreMatchesMessage && (
        <div className="text-center py-4 mb-8">
          <p className="text-gray-600 text-sm font-medium p-3 bg-gray-50 rounded-lg inline-block">
            No more exact matches.
          </p>
        </div>
      )}
      
      {/* Divider between exact and similar results */}
      {showDivider && (
        <div className="mt-12 mb-8">
          <Separator className="my-4" />
          <div className="text-center text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
            End of exact matches. Showing similar results below.
          </div>
        </div>
      )}

      {/* Similar Results Section */}
      {showSimilarEvents && (
        <SecondaryResults
          events={similarEvents}
          isLoading={isLoading}
          onRsvp={isAuthenticated ? handleRsvpAction : undefined}
          showRsvpButtons={isAuthenticated}
          visibleCount={secondaryVisibleCount}
          hasMore={secondaryHasMore}
          onLoadMore={handleSecondaryLoadMore}
        />
      )}
      
      {/* Reset Filters Button */}
      {showResetFilters && initialLoadComplete && (
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
};

export default FilteredEventsList;
