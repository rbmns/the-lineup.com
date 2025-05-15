import React from 'react';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { LazyEventsList } from '@/components/events/LazyEventsList';

interface CategoryFilteredEventsContentProps {
  showNoExactMatchesMessage: boolean;
  resetFilters: () => void;
  exactMatches: any[];
  similarEvents: any[];
  isLoading: boolean;
  isFilterLoading: boolean; 
  hasActiveFilters: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean>;
}

export const CategoryFilteredEventsContent: React.FC<CategoryFilteredEventsContentProps> = ({
  showNoExactMatchesMessage,
  resetFilters,
  exactMatches,
  similarEvents,
  isLoading,
  isFilterLoading,
  hasActiveFilters,
  onRsvp
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
        isLoading={isLoading || isFilterLoading}
        onRsvp={onRsvp}
        showRsvpButtons={!!onRsvp}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};
