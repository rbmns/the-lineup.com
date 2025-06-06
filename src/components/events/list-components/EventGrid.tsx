
import React, { useRef, useEffect } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventsSignupTeaser } from '@/components/events/list-components/EventsSignupTeaser';

interface EventGridProps {
  events: Event[];
  visibleCount: number;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loadingEventId?: string | null;
  showSignupTeaser?: boolean;
  eventsBeforeTeaserCount?: number;
  compact?: boolean;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  visibleCount,
  hasMore,
  isLoading,
  onLoadMore,
  onRsvp,
  showRsvpButtons = true,
  className,
  style,
  loadingEventId,
  showSignupTeaser = false,
  eventsBeforeTeaserCount = 6,
  compact
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Split events if teaser should be shown
  const eventsBeforeTeaser = showSignupTeaser ? events.slice(0, eventsBeforeTeaserCount) : [];
  const eventsAfterTeaser = showSignupTeaser ? events.slice(eventsBeforeTeaserCount) : [];
  
  // If no teaser, show all events
  const eventsToDisplay = showSignupTeaser ? [] : events;
  
  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!hasMore || isLoading) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading) {
          console.log("Intersection observer triggered, loading more...");
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
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
  }, [hasMore, isLoading, onLoadMore]);
  
  // Improved RSVP handler with better event isolation
  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!onRsvp) return false;
    
    try {
      console.log('EventGrid - RSVP triggered:', { eventId, status });
      
      // Call the onRsvp callback passed from parent
      const result = await onRsvp(eventId, status);
      console.log('EventGrid - RSVP result:', result);
      
      return result;
    } catch (error) {
      console.error('Error in EventGrid RSVP handler:', error);
      return false;
    }
  };

  // Render event card helper function
  const renderEventCard = (event: Event) => (
    <div key={event.id} className="h-full min-w-0">
      <EventCard 
        key={event.id} 
        event={event}
        onRsvp={handleRsvp}
        showRsvpButtons={showRsvpButtons}
        className="h-full w-full"
        loadingEventId={loadingEventId}
        compact={compact}
      />
    </div>
  );

  return (
    <React.Fragment>
      {/* Grid with improved responsive layout */}
      <div className={cn(
        "grid gap-3 w-full",
        "grid-cols-1", // Mobile: 1 column
        "xs:grid-cols-1", // Extra small: 1 column 
        "sm:grid-cols-2", // Small: 2 columns (576px+)
        "md:grid-cols-2", // Medium: 2 columns (768px+)
        "lg:grid-cols-3", // Large: 3 columns (1024px+)
        "xl:grid-cols-3", // XL: 3 columns (1280px+)
        "2xl:grid-cols-4", // 2XL: 4 columns for very wide screens
        className
      )} style={style}>
        {/* If using teaser, render events before teaser */}
        {showSignupTeaser && eventsBeforeTeaser.map(renderEventCard)}
        
        {/* If not using teaser, render all events */}
        {!showSignupTeaser && eventsToDisplay.map(renderEventCard)}
      </div>
      
      {/* Signup Teaser */}
      {showSignupTeaser && eventsBeforeTeaser.length > 0 && (
        <div className="my-8">
          <EventsSignupTeaser />
        </div>
      )}
      
      {/* Events after teaser if any */}
      {showSignupTeaser && eventsAfterTeaser.length > 0 && (
        <div className={cn(
          "grid gap-3 w-full",
          "grid-cols-1", // Mobile: 1 column
          "xs:grid-cols-1", // Extra small: 1 column
          "sm:grid-cols-2", // Small: 2 columns (576px+)
          "md:grid-cols-2", // Medium: 2 columns (768px+)
          "lg:grid-cols-3", // Large: 3 columns (1024px+)
          "xl:grid-cols-3", // XL: 3 columns (1280px+)
          "2xl:grid-cols-4", // 2XL: 4 columns for very wide screens
          className
        )}>
          {eventsAfterTeaser.map(renderEventCard)}
        </div>
      )}
      
      {/* Loading indicator - only show if we have more events to load */}
      {hasMore && (
        <div 
          ref={observerTarget}
          className="flex justify-center py-6 my-4"
          data-testid="load-more-trigger"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          ) : (
            <div className="h-8 w-full" /> 
          )}
        </div>
      )}
    </React.Fragment>
  );
};
