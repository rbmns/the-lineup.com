
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { EventsPageFilters } from '@/components/events/page-components/EventsPageFilters';
import { CategoryFilteredEventsContent } from '@/components/events/category-filters/CategoryFilteredEventsContent';

const Events = () => {
  const { user } = useAuth();
  const {
    events,
    eventsLoading,
    filteredEvents,
    venues,
    locations,
    isVenuesLoading,
    allEventTypes,
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    showAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
    enhancedHandleRsvp,
    loadingEventId
  } = useEventsPageData();

  return (
    <div className="w-full px-4 md:px-6 py-4 md:py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader 
          title="Events" 
          subtitle="Discover and explore upcoming events"
        />
        
        <div className="space-y-6 md:space-y-12">
          {/* Filters Section - Now visible on mobile */}
          <div className="space-y-4">
            <EventsPageFilters
              allEventTypes={allEventTypes}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectAll={selectAll}
              deselectAll={deselectAll}
              hasActiveFilters={hasActiveFilters}
              showAdvancedFilters={showAdvancedFilters}
              toggleAdvancedFilters={toggleAdvancedFilters}
              dateRange={dateRange}
              setDateRange={setDateRange}
              selectedDateFilter={selectedDateFilter}
              setSelectedDateFilter={setSelectedDateFilter}
              venues={venues}
              selectedVenues={selectedVenues}
              setSelectedVenues={setSelectedVenues}
              locations={locations}
              hasAdvancedFilters={hasAdvancedFilters}
              handleRemoveVenue={handleRemoveVenue}
              handleClearDateFilter={handleClearDateFilter}
              resetFilters={resetFilters}
            />
          </div>

          {/* Events Content */}
          <CategoryFilteredEventsContent 
            showNoExactMatchesMessage={filteredEvents.length === 0 && hasActiveFilters}
            resetFilters={resetFilters}
            exactMatches={filteredEvents}
            similarEvents={[]}
            isLoading={eventsLoading || isFilterLoading} 
            isFilterLoading={isFilterLoading}
            hasActiveFilters={hasActiveFilters}
            onRsvp={user ? enhancedHandleRsvp : undefined}
            loadingEventId={loadingEventId}
          />
        </div>
      </div>
    </div>
  );
};

export default Events;
