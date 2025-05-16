
import React, { useState, useCallback, useEffect } from 'react';
import { Event } from '@/types';
import { EventsList } from './list-components/EventsList';
import { PrimaryResults } from './list-components/PrimaryResults';
import { EventsLoadingState } from './list-components/EventsLoadingState';
import { NoResultsFound } from './list-components/NoResultsFound';

interface LazyEventsListProps {
  events: Event[];
  isLoading?: boolean;
  showRsvpButtons?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  loadingEventId?: string | null;
  emptyMessage?: string;
  searchQuery?: string;
  initialVisibleCount?: number;
  loadMoreIncrement?: number;
  renderSignUpTeaser?: boolean;
  renderTeaserAfterRow?: number | false;
  showTeaser?: boolean;
  teaser?: React.ReactNode;
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  events,
  isLoading = false,
  showRsvpButtons = false,
  onRsvp,
  loadingEventId,
  emptyMessage = "No events found",
  searchQuery = "",
  initialVisibleCount = 9,
  loadMoreIncrement = 6,
  renderSignUpTeaser = false,
  renderTeaserAfterRow = false,
  showTeaser = false,
  teaser
}) => {
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  
  // Reset visible count when events or search changes
  useEffect(() => {
    setVisibleCount(initialVisibleCount);
  }, [events.length, searchQuery, initialVisibleCount]);
  
  const visibleEvents = events.slice(0, visibleCount);
  const hasMore = events.length > visibleCount;
  
  const loadMore = useCallback(() => {
    setVisibleCount(prev => prev + loadMoreIncrement);
  }, [loadMoreIncrement]);
  
  // Handle RSVP with proper return type
  const handleRsvp = useCallback(
    async (eventId: string, status: 'Going' | 'Interested'): Promise<void> => {
      if (onRsvp) {
        await onRsvp(eventId, status);
      }
    },
    [onRsvp]
  );
  
  if (isLoading) {
    return <EventsLoadingState />;
  }
  
  if (events.length === 0) {
    return (
      <NoResultsFound 
        message={emptyMessage} 
        searchQuery={searchQuery}
      />
    );
  }
  
  return (
    <div className="space-y-8">
      <PrimaryResults 
        events={visibleEvents}
        onRsvp={handleRsvp}
        showRsvpButtons={showRsvpButtons}
        loadingEventId={loadingEventId}
        renderTeaserAfterRow={renderTeaserAfterRow}
        showTeaser={showTeaser}
        teaser={teaser}
        searchQuery={searchQuery}
        isLoading={isLoading}
        visibleCount={visibleCount}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
      
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={loadMore}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default LazyEventsList;
