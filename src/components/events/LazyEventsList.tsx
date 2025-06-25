
import React from 'react';
import { Event } from '@/types';
import { PrimaryResults } from '@/components/events/list-components/PrimaryResults';
import { SecondaryResults } from '@/components/events/list-components/SecondaryResults';
import { ResultsDivider } from '@/components/home/events-list/ResultsDivider';
import { EventsSignupTeaser } from '@/components/events/list-components/EventsSignupTeaser';
import { useAuth } from '@/contexts/AuthContext';

interface LazyEventsListProps {
  mainEvents: Event[];
  relatedEvents: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  loadingEventId?: string | null;
  compact?: boolean;
  hideCount?: boolean;
}

export const LazyEventsList: React.FC<LazyEventsListProps> = ({
  mainEvents,
  relatedEvents,
  isLoading,
  onRsvp,
  showRsvpButtons = false,
  hasActiveFilters = false,
  loadingEventId,
  compact = false,
  hideCount = false
}) => {
  const { isAuthenticated } = useAuth();
  
  // Only show RSVP buttons if user is authenticated AND showRsvpButtons is true
  const shouldShowRsvp = isAuthenticated && showRsvpButtons;
  
  // Create a wrapper function that adapts onRsvp to the expected type
  const handleRsvp = (shouldShowRsvp && onRsvp) 
    ? async (eventId: string, status: 'Going' | 'Interested'): Promise<void> => {
        await onRsvp(eventId, status);
      }
    : undefined;
  
  return (
    <div className="space-y-8">
      {/* Primary Results */}
      <PrimaryResults 
        events={mainEvents}
        isLoading={isLoading}
        onRsvp={handleRsvp}
        showRsvpButtons={shouldShowRsvp}
        loadingEventId={loadingEventId}
        hideCount={hideCount}
        compact={compact}
      />

      {/* Show signup teaser for non-authenticated users after primary results */}
      {!isAuthenticated && mainEvents.length > 0 && <EventsSignupTeaser />}
      
      {/* Only show related events if we have some */}
      {relatedEvents && relatedEvents.length > 0 && (
        <>
          <ResultsDivider />
          <SecondaryResults 
            events={relatedEvents}
            isLoading={isLoading}
            onRsvp={handleRsvp}
            showRsvpButtons={shouldShowRsvp}
            loadingEventId={loadingEventId}
            compact={compact}
          />
        </>
      )}
    </div>
  );
};
