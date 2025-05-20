
import React, { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { EventCard } from '@/components/events/EventCard';
import { EventSkeleton } from '@/components/events/EventSkeleton';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  compact?: boolean;
  loadingEventId?: string | null;
  hasActiveFilters?: boolean;
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents,
  relatedEvents = [],
  isLoading,
  onRsvp,
  showRsvpButtons = true,
  compact = false,
  loadingEventId,
  hasActiveFilters = false
}) => {
  const [visibleMainCount, setVisibleMainCount] = useState(12);
  const [visibleRelatedCount, setVisibleRelatedCount] = useState(6);
  const mainObserverRef = useRef<HTMLDivElement>(null);
  const relatedObserverRef = useRef<HTMLDivElement>(null);
  const [renderedEvents, setRenderedEvents] = useState<Event[]>([]);
  const [renderedRelated, setRenderedRelated] = useState<Event[]>([]);
  
  // Memoize the event lists to prevent rerenders
  useEffect(() => {
    setRenderedEvents(mainEvents.slice(0, visibleMainCount));
  }, [mainEvents, visibleMainCount]);
  
  useEffect(() => {
    setRenderedRelated(relatedEvents.slice(0, visibleRelatedCount));
  }, [relatedEvents, visibleRelatedCount]);

  // Set up infinite scrolling for main events
  useEffect(() => {
    if (!mainObserverRef.current) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleMainCount < mainEvents.length) {
          setVisibleMainCount(prev => Math.min(prev + 12, mainEvents.length));
        }
      },
      { rootMargin: '200px' }
    );
    
    observer.observe(mainObserverRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [mainEvents.length, visibleMainCount]);
  
  // Set up infinite scrolling for related events
  useEffect(() => {
    if (!relatedObserverRef.current || relatedEvents.length === 0) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleRelatedCount < relatedEvents.length) {
          setVisibleRelatedCount(prev => Math.min(prev + 6, relatedEvents.length));
        }
      },
      { rootMargin: '200px' }
    );
    
    observer.observe(relatedObserverRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [relatedEvents.length, visibleRelatedCount]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <EventSkeleton key={index} compact={compact} />
        ))}
      </div>
    );
  }
  
  if (mainEvents.length === 0 && relatedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">
          {hasActiveFilters ? 
            "No events match your filters. Try adjusting your criteria." : 
            "No events found. Check back later for updates."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-12">
      {/* Main Events Section */}
      {renderedEvents.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderedEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                compact={compact}
                onRsvp={onRsvp}
                showRsvpButtons={showRsvpButtons}
                isRsvpLoading={loadingEventId === event.id}
              />
            ))}
          </div>
          {visibleMainCount < mainEvents.length && (
            <div ref={mainObserverRef} className="h-4" />
          )}
        </div>
      )}
      
      {/* Related Events Section */}
      {renderedRelated.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">You might also like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderedRelated.map(event => (
              <EventCard
                key={event.id}
                event={event}
                compact={compact}
                onRsvp={onRsvp}
                showRsvpButtons={showRsvpButtons}
                isRsvpLoading={loadingEventId === event.id}
              />
            ))}
          </div>
          {visibleRelatedCount < relatedEvents.length && (
            <div ref={relatedObserverRef} className="h-4" />
          )}
        </div>
      )}
    </div>
  );
};
