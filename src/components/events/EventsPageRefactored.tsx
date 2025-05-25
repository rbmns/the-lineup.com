
import React from 'react';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsFiltersSection } from '@/components/events/page-components/EventsFiltersSection';
import { EventsResultsSection } from '@/components/events/page-components/EventsResultsSection';

const EventsPageRefactored = () => {
  useEventPageMeta();
  
  const {
    filteredEvents,
    eventsLoading,
    isVenuesLoading,
    isFilterLoading,
    allEventTypes,
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    showAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    venues,
    locations,
    handleRemoveVenue,
    handleClearDateFilter,
    resetFilters,
    enhancedHandleRsvp,
    loadingEventId,
    user
  } = useEventsPageData();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean header section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <EventsPageHeader title="Upcoming Events" />
        </div>
      </div>

      {/* Main content */}
      <div className="w-full px-4 md:px-6 py-4 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters Section */}
          <EventsFiltersSection 
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
          
          {/* Results Section */}
          <EventsResultsSection 
            filteredEvents={filteredEvents}
            isLoading={eventsLoading}
            isVenuesLoading={isVenuesLoading}
            isFilterLoading={isFilterLoading}
            hasActiveFilters={hasActiveFilters}
            isNoneSelected={isNoneSelected}
            selectAll={selectAll}
            handleRsvp={user ? enhancedHandleRsvp : undefined}
            showRsvpButtons={!!user}
            loadingEventId={loadingEventId}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPageRefactored;
