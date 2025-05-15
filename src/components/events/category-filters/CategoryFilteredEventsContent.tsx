
import React from 'react';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { LazyEventsList } from '@/components/events/LazyEventsList';

interface CategoryFilteredEventsContentProps {
  showNoExactMatchesMessage: boolean;
  resetFilters: () => void;
  exactMatches: any[]; // Consider typing this more strictly if Event type is available
  similarEvents: any[]; // Consider typing this
  isLoading: boolean; // For initial list loading / skeleton
  isFilterLoading: boolean; // For loading state when filters are applied
  hasActiveFilters: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>; // Changed boolean to boolean | void
  loadingEventId?: string | null; // Added to pass to LazyEventsList
}

export const CategoryFilteredEventsContent: React.FC<CategoryFilteredEventsContentProps> = ({
  showNoExactMatchesMessage,
  resetFilters,
  exactMatches,
  similarEvents,
  isLoading,
  isFilterLoading,
  hasActiveFilters,
  onRsvp,
  loadingEventId // Destructure new prop
}) => {
  return (
    <div className="space-y-12">
      {/* No Exact Matches Message */}
      {showNoExactMatchesMessage && (
        <NoResultsFound resetFilters={resetFilters} />
      )}

      {/* Events List Section */}
      <LazyEventsList 
        mainEvents={exactMatches}
        relatedEvents={similarEvents}
        // Combine isLoading and isFilterLoading for the overall list loading state (skeletons)
        isLoading={isLoading || isFilterLoading} 
        onRsvp={onRsvp}
        showRsvpButtons={!!onRsvp} // Show buttons if onRsvp handler is provided
        hasActiveFilters={hasActiveFilters}
        loadingEventId={loadingEventId} // Pass loadingEventId for individual card RSVP spinners
      />
    </div>
  );
};
