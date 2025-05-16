
import React, { useState, useEffect } from 'react';
import { EventsList } from '@/components/events/list-components/EventsList';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';
import { EventsEmptyState } from '@/components/events/EventsEmptyState';
import { Event } from '@/types';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  loadingEventId?: string | null;
  noCategoriesSelected?: boolean;
  compact?: boolean;
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents = [],
  relatedEvents = [],
  isLoading = false,
  onRsvp,
  showRsvpButtons = false,
  hasActiveFilters = false,
  loadingEventId,
  noCategoriesSelected = false,
  compact = false
}) => {
  // State to track if we should show loading state
  const [showLoading, setShowLoading] = useState(isLoading);
  
  // Update loading state with a slight delay to prevent flashing
  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 300); // Small delay to prevent UI flashing
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (showLoading) {
    return <EventsLoadingState compact={compact} />;
  }

  // Special case: No categories selected
  if (noCategoriesSelected) {
    return (
      <EventsEmptyState 
        noCategoriesSelected={true}
        hasActiveFilters={hasActiveFilters}
      />
    );
  }

  // Check if we have no events to display and have filters applied
  if (mainEvents.length === 0) {
    return (
      <EventsEmptyState 
        hasActiveFilters={hasActiveFilters} 
      />
    );
  }

  return (
    <div className="space-y-8">
      <EventsList 
        events={mainEvents} 
        onRsvp={onRsvp}
        showRsvpButtons={showRsvpButtons}
        loadingEventId={loadingEventId}
        compact={compact}
      />
      
      {/* If we have related events and they're different from main events, show them too */}
      {relatedEvents && relatedEvents.length > 0 && 
        !mainEvents.some(e => relatedEvents.some(r => r.id === e.id)) && (
        <div className="mt-12 pt-6 border-t">
          <h2 className="text-xl font-semibold mb-6">You may also like</h2>
          <EventsList 
            events={relatedEvents} 
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            loadingEventId={loadingEventId}
            compact={compact}
          />
        </div>
      )}
    </div>
  );
};
