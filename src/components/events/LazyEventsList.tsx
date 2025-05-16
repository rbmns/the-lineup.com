
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { EventsLoadingState } from './list-components/EventsLoadingState';
import { NoResultsFound } from './list-components/NoResultsFound';
import { EventsEmptyState } from './list-components/EventsEmptyState';
import { PrimaryResults } from './list-components/PrimaryResults';
import { SecondaryResults } from './list-components/SecondaryResults';
import { useIsMobile } from '@/hooks/use-mobile';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents: Event[];
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
  mainEvents,
  relatedEvents,
  isLoading = false,
  onRsvp,
  showRsvpButtons = true,
  hasActiveFilters = false,
  loadingEventId,
  noCategoriesSelected = false,
  renderTeaserAfterRow = false,
  teaser
}) => {
  const isMobile = useIsMobile();
  const [showTeaser, setShowTeaser] = useState<boolean>(false);
  
  // Determine when to show teaser
  useEffect(() => {
    if (renderTeaserAfterRow !== false && mainEvents.length >= renderTeaserAfterRow) {
      setShowTeaser(true);
    } else {
      setShowTeaser(false);
    }
  }, [mainEvents.length, renderTeaserAfterRow]);
  
  // Show loading state
  if (isLoading) {
    return <EventsLoadingState />;
  }
  
  // Show message when no categories are selected
  if (noCategoriesSelected) {
    return <NoResultsFound 
      message="No event categories selected"
      actionText="Show all events" 
      showFiltersHint={true}
    />;
  }
  
  // Show message when no events are found with active filters
  if (mainEvents.length === 0 && hasActiveFilters) {
    return <NoResultsFound 
      message="No events match your filters"
      actionText="Clear filters"
      showFiltersHint={true}
    />;
  }
  
  // Show empty state when no events exist at all
  if (mainEvents.length === 0 && !hasActiveFilters) {
    return <EventsEmptyState />;
  }
  
  // Calculate teaser position based on events count and screen size
  // For mobile screens, insert teaser after fewer events
  const teaserPosition = isMobile && renderTeaserAfterRow && renderTeaserAfterRow > 1 
    ? Math.min(1, renderTeaserAfterRow - 1)
    : renderTeaserAfterRow;
    
  return (
    <div className="space-y-10">
      <PrimaryResults 
        events={mainEvents} 
        onRsvp={onRsvp} 
        showRsvpButtons={showRsvpButtons}
        loadingEventId={loadingEventId}
        renderTeaserAfterRow={teaserPosition}
        teaser={teaser}
        showTeaser={showTeaser}
      />
      
      {relatedEvents.length > 0 && (
        <SecondaryResults 
          relatedEvents={relatedEvents}
          onRsvp={onRsvp}
          showRsvpButtons={showRsvpButtons}
          loadingEventId={loadingEventId}
        />
      )}
    </div>
  );
};
