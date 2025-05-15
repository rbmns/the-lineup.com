
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { EventGrid } from './EventGrid';

// Number of events to load initially and on each load more
const EVENTS_PER_PAGE = 12;

interface PrimaryResultsProps {
  events: Event[];
  searchQuery?: string;
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  showRsvpButtons?: boolean;
  visibleCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const PrimaryResults: React.FC<PrimaryResultsProps> = ({
  events,
  searchQuery,
  isLoading,
  onRsvp,
  showRsvpButtons = true,
  visibleCount: externalVisibleCount,
  hasMore: externalHasMore,
  onLoadMore: externalOnLoadMore
}) => {
  const [internalVisibleCount, setInternalVisibleCount] = useState(EVENTS_PER_PAGE);
  const [internalHasMore, setInternalHasMore] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  // Use external or internal state management
  const visibleCount = externalVisibleCount !== undefined ? externalVisibleCount : internalVisibleCount;
  const hasMore = externalHasMore !== undefined ? externalHasMore : internalHasMore;
  
  // Reset visible count when search query or events change
  useEffect(() => {
    if (externalVisibleCount === undefined) {
      setInternalVisibleCount(EVENTS_PER_PAGE);
    }
  }, [searchQuery, events, externalVisibleCount]);
  
  // Update hasMore state when event count changes
  useEffect(() => {
    if (externalHasMore === undefined) {
      setInternalHasMore(visibleCount < events.length);
    }
    
    // Mark as initialized after first render
    if (!initialized) {
      setInitialized(true);
    }
  }, [visibleCount, events.length, externalHasMore, initialized]);
  
  const loadMore = () => {
    if (externalOnLoadMore) {
      externalOnLoadMore();
    } else {
      setInternalVisibleCount(prev => prev + EVENTS_PER_PAGE);
    }
  };

  // Safely handle RSVP with propagation prevention
  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!onRsvp) return;
    try {
      console.log('PrimaryResults - Handling RSVP:', { eventId, status });
      await onRsvp(eventId, status);
    } catch (error) {
      console.error('PrimaryResults - RSVP Error:', error);
    }
  };

  // If no events and not initialized yet, don't render anything
  // This prevents flash of "no results" during initial load
  if (events.length === 0 && !initialized) return null;

  return (
    <div>
      {searchQuery && events.length > 0 && (
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {events.length} {events.length === 1 ? 'result' : 'results'}
          {searchQuery ? ` for "${searchQuery}"` : ''}
        </h3>
      )}
      
      <EventGrid 
        events={events}
        visibleCount={visibleCount}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMore}
        onRsvp={onRsvp ? handleRsvp : undefined}
        showRsvpButtons={showRsvpButtons}
      />
    </div>
  );
};
