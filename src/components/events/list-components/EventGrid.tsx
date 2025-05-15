
import React, { useRef, useEffect } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { Loader2 } from 'lucide-react';

interface EventGridProps {
  events: Event[];
  visibleCount: number;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  visibleCount,
  hasMore,
  isLoading,
  onLoadMore,
  onRsvp,
  showRsvpButtons = true,
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const visibleEvents = events.slice(0, visibleCount);
  
  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!hasMore) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleEvents.map((event) => (
          <EventCard 
            key={event.id} 
            event={event}
            onRsvp={handleRsvp}
            showRsvpButtons={showRsvpButtons}
          />
        ))}
      </div>
      
      {/* Loading indicator */}
      {hasMore && visibleEvents.length < events.length && (
        <div 
          ref={observerTarget}
          className="flex justify-center py-8"
        >
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}
    </>
  );
};
