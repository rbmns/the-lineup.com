
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/EventCard';
import { Event } from '@/types';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  const [visibleEventsCount, setVisibleEventsCount] = useState(EVENTS_PER_PAGE);
  const [visibleSecondaryCount, setVisibleSecondaryCount] = useState(EVENTS_PER_PAGE);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreSecondary, setHasMoreSecondary] = useState(true);
  const primaryObserverTarget = useRef<HTMLDivElement>(null);
  const secondaryObserverTarget = useRef<HTMLDivElement>(null);
  
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
  
  // Visible events for lazy loading
  const visiblePrimaryEvents = primaryResults.slice(0, visibleEventsCount);
  const visibleSecondaryEvents = secondaryResults.slice(0, visibleSecondaryCount);
  
  // Update hasMore states when event counts change
  useEffect(() => {
    setHasMore(visibleEventsCount < primaryResults.length);
    setHasMoreSecondary(visibleSecondaryCount < secondaryResults.length);
  }, [visibleEventsCount, visibleSecondaryCount, primaryResults.length, secondaryResults.length]);
  
  // Reset visible counts when search query changes
  useEffect(() => {
    setVisibleEventsCount(EVENTS_PER_PAGE);
    setVisibleSecondaryCount(EVENTS_PER_PAGE);
  }, [searchQuery]);
  
  // Intersection Observer for primary results - moved outside of any conditional
  useEffect(() => {
    // Only set up the observer if there are more events to load
    if (!hasMore || isLoading) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMorePrimary();
        }
      },
      { threshold: 0.5 }
    );
    
    const currentTarget = primaryObserverTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading]); // Removed any dependencies that could change conditionally
  
  // Intersection Observer for secondary results - moved outside of any conditional
  useEffect(() => {
    // Only set up the observer if there are more events to load
    if (!hasMoreSecondary || isLoading) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreSecondary();
        }
      },
      { threshold: 0.5 }
    );
    
    const currentTarget = secondaryObserverTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMoreSecondary, isLoading]); // Removed any dependencies that could change conditionally
  
  const loadMorePrimary = () => {
    setVisibleEventsCount(prev => prev + EVENTS_PER_PAGE);
  };
  
  const loadMoreSecondary = () => {
    setVisibleSecondaryCount(prev => prev + EVENTS_PER_PAGE);
  };
  
  // Wrapper for handling RSVP actions with proper event propagation prevention
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
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-purple" />
        <span className="ml-2 text-gray-500">Loading events...</span>
      </div>
    );
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePrimaryEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event}
                onRsvp={isAuthenticated ? handleRsvp : undefined}
                showRsvpButtons={isAuthenticated}
              />
            ))}
          </div>
          
          {/* Loading indicator for primary results */}
          {hasMore && visiblePrimaryEvents.length < primaryResults.length && (
            <div 
              ref={primaryObserverTarget}
              className="flex justify-center py-8"
            >
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          )}
          
          {/* Divider between exact and similar results */}
          {!hasMore && similarEvents.length > 0 && (
            <div className="mt-12 mb-8">
              <Separator className="my-4" />
              <div className="text-center text-gray-600 text-sm">
                End of your search results. Showing similar happenings below.
              </div>
            </div>
          )}
        </div>
      ) : (
        noResultsFound && (
          <div className="text-center py-8 max-w-xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 mb-3">No direct matches found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find exact matches for "{searchQuery}", but here are some similar events that might interest you.
              </p>
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="bg-white hover:bg-gray-100"
              >
                Clear search
              </Button>
            </div>
          </div>
        )
      )}

      {/* Similar Results Section */}
      {noResultsFound && similarEvents.length > 0 && (
        <div className="pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Similar Events You Might Like
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarEvents.slice(0, visibleSecondaryCount).map((event) => (
              <EventCard 
                key={event.id} 
                event={event}
                onRsvp={isAuthenticated ? handleRsvp : undefined}
                showRsvpButtons={isAuthenticated}
              />
            ))}
          </div>
          
          {/* Loading indicator for similar results */}
          {hasMoreSecondary && similarEvents.length > visibleSecondaryCount && (
            <div 
              ref={secondaryObserverTarget}
              className="flex justify-center py-8"
            >
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          )}
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
