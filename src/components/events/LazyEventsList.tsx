
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { EventsList } from '@/components/events/list-components/EventsList';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';
import { EventsEmptyState } from '@/components/events/list-components/EventsEmptyState';
import { Separator } from '@/components/ui/separator';
import { GuestRsvpTeaser } from './GuestRsvpTeaser';
import { useAuth } from '@/contexts/AuthContext';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  loadingEventId?: string | null;
  noCategoriesSelected?: boolean;
}

// Number of events to load initially and on each load more
const EVENTS_PER_PAGE = 12;

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents = [],
  relatedEvents = [],
  isLoading = false,
  onRsvp,
  showRsvpButtons = true,
  hasActiveFilters = false,
  loadingEventId = null,
  noCategoriesSelected = false
}) => {
  const { user } = useAuth();
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);
  const isAuthenticated = !!user;
  const hasMainEvents = Array.isArray(mainEvents) && mainEvents.length > 0;
  const hasRelatedEvents = Array.isArray(relatedEvents) && relatedEvents.length > 0;

  // Reset visible count when main events change
  useEffect(() => {
    setVisibleCount(EVENTS_PER_PAGE);
  }, [mainEvents]);

  // Handle loading more events
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + EVENTS_PER_PAGE);
  };

  // Decide what to show based on current state
  if (isLoading) {
    return <EventsLoadingState numberOfSkeletons={6} />;
  }

  if (noCategoriesSelected) {
    return (
      <EventsEmptyState 
        title="No category selected"
        description="Please select at least one category to see events" 
      />
    );
  }

  if (!hasMainEvents && !hasRelatedEvents) {
    return (
      <EventsEmptyState 
        title={hasActiveFilters ? "No events match your filters" : "No upcoming events"} 
        description={hasActiveFilters ? "Try adjusting your filters to see more events" : "Check back later for new events"} 
      />
    );
  }

  // Show the guest RSVP teaser on the first event when user is not authenticated
  // and there are events to show
  const showGuestTeaser = !isAuthenticated && hasMainEvents;
  const firstEvent = showGuestTeaser ? mainEvents[0] : null;

  return (
    <div className="space-y-8">
      {/* Guest RSVP Teaser (only for non-authenticated users) */}
      {showGuestTeaser && firstEvent && (
        <GuestRsvpTeaser eventId={firstEvent.id} eventTitle={firstEvent.title} />
      )}
      
      {/* Main Events */}
      {hasMainEvents && (
        <div>
          <h2 className="text-2xl font-bold mb-6">{hasRelatedEvents ? 'Events For You' : 'Upcoming Events'}</h2>
          
          <EventsList 
            events={mainEvents.slice(0, visibleCount)}
            onRsvp={isAuthenticated ? onRsvp : undefined}
            showRsvpButtons={isAuthenticated}
            loadingEventId={loadingEventId}
          />
          
          {/* Load More Button */}
          {visibleCount < mainEvents.length && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleLoadMore}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
              >
                Load more events
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Divider between main and related events */}
      {hasMainEvents && hasRelatedEvents && (
        <Separator className="my-8" />
      )}
      
      {/* Related Events */}
      {hasRelatedEvents && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Similar Events You Might Like</h2>
          
          <EventsList 
            events={relatedEvents.slice(0, EVENTS_PER_PAGE)}
            onRsvp={isAuthenticated ? onRsvp : undefined}
            showRsvpButtons={isAuthenticated}
            loadingEventId={loadingEventId}
          />
        </div>
      )}
    </div>
  );
};
