
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { EventGrid } from '@/components/events/EventGrid';
import { EventsList } from '@/components/events/EventsList';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  loadingEventId?: string | null;
  noCategoriesSelected?: boolean;
  renderTeaserAfterRow?: number | false;
  teaser?: React.ReactNode;
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents = [],
  relatedEvents = [],
  isLoading = false,
  onRsvp,
  showRsvpButtons = true,
  hasActiveFilters = false,
  loadingEventId,
  noCategoriesSelected = false,
  renderTeaserAfterRow = false,
  teaser
}) => {
  const [visibleEvents, setVisibleEvents] = useState<Event[]>([]);
  const eventsPerRow = 3; // Standard number of events per row for a 3-column grid

  useEffect(() => {
    // Reset visible events when main events change
    setVisibleEvents(mainEvents.slice(0, 6));
  }, [mainEvents]);

  // Show loading state
  if (isLoading) {
    return <EventsLoadingState />;
  }

  // Show empty state for no selected categories
  if (noCategoriesSelected) {
    return (
      <NoResultsFound 
        message="Please select at least one category to see events" 
        showFiltersHint={false}
      />
    );
  }

  // Show no results found when filters are active but no events match
  if (mainEvents.length === 0 && hasActiveFilters) {
    return (
      <NoResultsFound 
        message="No events match your filters" 
        showFiltersHint={true}
      />
    );
  }

  // If no events at all, show generic no results
  if (mainEvents.length === 0) {
    return (
      <NoResultsFound 
        message="No events found" 
        showFiltersHint={false}
      />
    );
  }

  // Calculate which events go before and after the teaser
  let eventsBeforeTeaser: Event[] = [];
  let eventsAfterTeaser: Event[] = [];
  
  if (renderTeaserAfterRow && typeof renderTeaserAfterRow === 'number') {
    const splitIndex = renderTeaserAfterRow * eventsPerRow;
    eventsBeforeTeaser = mainEvents.slice(0, splitIndex);
    eventsAfterTeaser = mainEvents.slice(splitIndex);
  } else {
    eventsBeforeTeaser = mainEvents;
  }

  return (
    <div className="space-y-12">
      {/* First set of events */}
      <div className="space-y-6">
        {eventsBeforeTeaser.length > 0 && (
          <EventsList
            events={eventsBeforeTeaser}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            loadingEventId={loadingEventId}
          />
        )}
      </div>
      
      {/* Teaser after specified row */}
      {renderTeaserAfterRow && teaser && (
        <div className="my-8">
          {teaser}
        </div>
      )}
      
      {/* Remaining events */}
      {eventsAfterTeaser.length > 0 && (
        <div className="space-y-6 mt-8">
          <EventsList
            events={eventsAfterTeaser}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            loadingEventId={loadingEventId}
          />
        </div>
      )}
      
      {/* Related events if any */}
      {relatedEvents.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-medium mb-6">You might also be interested in</h2>
          <EventsList
            events={relatedEvents}
            onRsvp={onRsvp}
            showRsvpButtons={showRsvpButtons}
            compact={true}
            loadingEventId={loadingEventId}
          />
        </div>
      )}
    </div>
  );
};
