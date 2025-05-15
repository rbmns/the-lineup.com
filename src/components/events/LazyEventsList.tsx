
import React, { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { Loader2 } from 'lucide-react';

// Number of events to load initially and on each "load more"
const EVENTS_PER_PAGE = 12;

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading: boolean;
  isRsvpLoading?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  compact?: boolean;
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents,
  relatedEvents = [],
  isLoading,
  isRsvpLoading = false,
  onRsvp,
  showRsvpButtons = true,
  hasActiveFilters = false,
  compact = false
}) => {
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Update hasMore state when event count changes
  useEffect(() => {
    setHasMore(visibleCount < mainEvents.length);
  }, [visibleCount, mainEvents.length]);
  
  // Reset visible count when events change
  useEffect(() => {
    setVisibleCount(EVENTS_PER_PAGE);
  }, [mainEvents]);
  
  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setVisibleCount(prev => prev + EVENTS_PER_PAGE);
        }
      },
      { threshold: 0.5 }
    );
    
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
        <span className="ml-2 text-gray-500">Loading events...</span>
      </div>
    );
  }
  
  if (mainEvents.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600">No events found</p>
        <p className="text-gray-500 mt-2">Check back later for new events</p>
      </div>
    );
  }

  // Visible events for lazy loading
  const visibleEvents = mainEvents.slice(0, visibleCount);
  
  return (
    <div className="space-y-8">
      {/* Main Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            compact={compact}
          />
        ))}
      </div>
      
      {/* Loading indicator */}
      {hasMore && (
        <div 
          ref={observerTarget}
          className="flex justify-center py-8"
        >
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}
      
      {/* No more events message */}
      {!hasMore && mainEvents.length > 0 && (
        <p className="text-center text-gray-500 py-4">
          {mainEvents.length} events shown
        </p>
      )}
    </div>
  );
};
