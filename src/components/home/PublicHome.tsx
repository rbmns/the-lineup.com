
import React, { useEffect } from 'react';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimisticRsvp } from '@/hooks/event-rsvp/useOptimisticRsvp';
import { SearchSection } from './SearchSection';
import { FilterSection } from './FilterSection';
import { EventsList } from './EventsList';
import { useSearchResultsState } from '@/hooks/home/useSearchResultsState';
import { useSearchAndFilter } from '@/hooks/home/useSearchAndFilter';
import { useEventDisplay } from '@/hooks/home/useEventDisplay';

interface PublicHomeProps {
  events: Event[] | undefined;
  isLoading: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  selectedDateFilter?: string;
  setSelectedDateFilter?: (filter: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  events, 
  isLoading, 
  showSearch = true,
  showFilters = true,
  selectedDateFilter = '',
  setSelectedDateFilter = () => {}
}) => {
  const { user, isAuthenticated } = useAuth();
  const { handleRsvp } = useOptimisticRsvp(user?.id);
  
  // Use the extracted search results state hook
  const searchState = useSearchResultsState(events);
  
  const {
    searchQuery,
    setSearchQuery,
    combinedResults,
    selectedEventTypes,
    isSearching,
    isLocalLoading,
    availableCategories,
    similarEvents,
    noResultsFound,
    isAiSearching,
    aiFeedback,
    resetFilters,
    toggleEventType,
    setSelectedEventTypes,
    queryOnlyResults
  } = searchState;

  // Use the extracted search and filter functionality hook
  const searchAndFilter = useSearchAndFilter(
    user?.id,
    searchState.setSearchResults,
    searchState.setQueryOnlyResults,
    searchState.setSimilarEvents,
    searchState.setNoResultsFound,
    searchState.setIsSearching,
    searchState.setAiSearchFilter,
    searchState.setAiFeedback,
    selectedEventTypes,
    setSelectedEventTypes,
    searchState.setIsAiSearching
  );

  // Use the event display hook
  const { displayEvents, showScrollArrow } = useEventDisplay({
    events,
    combinedResults,
    similarEvents,
    noResultsFound,
    searchQuery,
    selectedEventTypes
  });

  // Run category filter when selectedEventTypes changes
  useEffect(() => {
    if (selectedEventTypes.length > 0) {
      searchAndFilter.handleCategoryFilter();
    } else if (selectedEventTypes.length === 0 && !searchQuery) {
      searchState.setSearchResults(null);
      searchState.setCombinedResults(null);
      searchState.setAiFeedback(undefined);
      searchState.setSimilarEvents([]);
    }
  }, [selectedEventTypes]);

  // Handle RSVP actions
  const handleRsvpAction = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user) return;
    await handleRsvp(eventId, status);
  };

  // Handle form submission for search
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await searchAndFilter.handleAiSearch(searchQuery);
  };

  // Combine reset filters function with date filter reset
  const handleResetFilters = () => {
    resetFilters();
    
    if(setSelectedDateFilter) {
      setSelectedDateFilter('');
    }
  };

  return (
    <div className="container py-12 max-w-6xl">
      <div className="mx-auto space-y-24">
        {showSearch && (
          <div className="mb-24">
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearchSubmit}
              isAiSearching={isAiSearching}
              aiFeedback={aiFeedback}
              hasResults={displayEvents.length > 0}
              resultCount={displayEvents.length}
              showScrollArrow={showScrollArrow}
            />
          </div>
        )}
        
        <div className="space-y-8">
          {showFilters && (
            <FilterSection
              availableCategories={availableCategories}
              selectedEventTypes={selectedEventTypes}
              toggleEventType={toggleEventType}
              resetFilters={handleResetFilters}
              hasActiveFilters={selectedEventTypes.length > 0 || !!searchQuery}
              selectedDateFilter={selectedDateFilter || ''}
              setSelectedDateFilter={setSelectedDateFilter}
            />
          )}
          
          <EventsList
            isLoading={isLoading || isLocalLoading}
            isSearching={isSearching}
            displayEvents={displayEvents}
            queryOnlyResults={queryOnlyResults}
            searchQuery={searchQuery}
            noResultsFound={noResultsFound}
            similarEvents={similarEvents}
            resetFilters={handleResetFilters}
            handleRsvpAction={handleRsvpAction}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </div>
  );
};
