
import React, { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { Loader2 } from 'lucide-react';

interface RelatedEventsSectionProps {
  events: Event[];
  title: string;
  isLoading?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  showRsvpButtons?: boolean;
  className?: string;
  subtitle?: string;
}

export const RelatedEventsSection: React.FC<RelatedEventsSectionProps> = ({
  events,
  title,
  isLoading = false,
  onRsvp,
  showRsvpButtons = true,
  className = '',
  subtitle
}) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [hasMore, setHasMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const visibleEvents = events.slice(0, visibleCount);
  
  // Update hasMore when events change
  useEffect(() => {
    setHasMore(visibleCount < events.length);
  }, [visibleCount, events.length]);

  // Reset visible count when events change
  useEffect(() => {
    setVisibleCount(6);
  }, [events]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
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

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };
  
  // Enhanced RSVP handler to ensure proper event handling
  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (onRsvp) {
      try {
        console.log('RelatedEventsSection - RSVP triggered:', { eventId, status });
        await onRsvp(eventId, status);
      } catch (error) {
        console.error('Error in RelatedEventsSection RSVP handler:', error);
      }
    }
  };
  
  if (events.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {subtitle && (
        <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            showRsvpButtons={showRsvpButtons}
            onRsvp={handleRsvp}
          />
        ))}
      </div>

      {/* Loading indicator and intersection observer target */}
      {hasMore && (
        <div 
          ref={observerTarget}
          className="col-span-full flex justify-center py-8"
        >
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
};
