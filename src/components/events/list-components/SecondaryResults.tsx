
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { EventGrid } from './EventGrid';

// Number of events to load initially and on each load more
const EVENTS_PER_PAGE = 12;

interface SecondaryResultsProps {
  events: Event[];
  isLoading: boolean;
  title?: string;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  showRsvpButtons?: boolean;
  visibleCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingEventId?: string | null;
  compact?: boolean;
}

export const SecondaryResults: React.FC<SecondaryResultsProps> = ({
  events,
  isLoading,
  title = "Similar Events You Might Like",
  onRsvp,
  showRsvpButtons = true,
  visibleCount: externalVisibleCount,
  hasMore: externalHasMore,
  onLoadMore: externalOnLoadMore,
  loadingEventId,
  compact
}) => {
  const [internalVisibleCount, setInternalVisibleCount] = useState(EVENTS_PER_PAGE);
  const [internalHasMore, setInternalHasMore] = useState(true);
  
  // Use external or internal state management
  const visibleCount = externalVisibleCount !== undefined ? externalVisibleCount : internalVisibleCount;
  const hasMore = externalHasMore !== undefined ? externalHasMore : internalHasMore;
  
  // Update hasMore state when event count changes
  useEffect(() => {
    if (externalHasMore === undefined) {
      setInternalHasMore(visibleCount < events.length);
    }
  }, [visibleCount, events.length, externalHasMore]);
  
  const loadMore = () => {
    if (externalOnLoadMore) {
      externalOnLoadMore();
    } else {
      setInternalVisibleCount(prev => prev + EVENTS_PER_PAGE);
    }
  };

  // If no events, don't render anything
  if (events.length === 0) return null;

  return (
    <div className="pt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        {title}
      </h3>
      
      <EventGrid 
        events={events}
        visibleCount={visibleCount}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMore}
        onRsvp={onRsvp}
        showRsvpButtons={showRsvpButtons}
        loadingEventId={loadingEventId}
        compact={compact}
      />
    </div>
  );
};
