
import React from 'react';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { EventsDataProvider } from '@/components/events/page-components/EventsDataProvider';
import { EventsPageFilters } from '@/components/events/page-components/EventsPageFilters';
import { EventsResultsDisplay } from '@/components/events/page-components/EventsResultsDisplay';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { FilterStateProvider } from '@/contexts/FilterStateContext';
import { useAuth } from '@/contexts/AuthContext';

const Events = () => {
  useEventPageMeta();
  const { isAuthenticated } = useAuth();
  
  return (
    <FilterStateProvider>
      <div className="min-h-screen bg-white">
        <EventsPageHeader 
          title="What's Happening?" 
          subtitle="Discover events in the Zandvoort area"
          showBackground={true}
        />
        
        <div className="w-full px-4 md:px-6 py-6 md:py-8">
          <div className="max-w-7xl mx-auto">
            <EventsDataProvider>
              {({
                filteredEvents,
                similarEvents,
                eventsLoading,
                isVenuesLoading,
                isFilterLoading,
                allEventTypes,
                selectedCategories,
                toggleCategory,
                selectAll,
                deselectAll,
                isNoneSelected,
                hasActiveFilters,
                showAdvancedFilters,
                toggleAdvancedFilters,
                dateRange,
                setDateRange,
                selectedDateFilter,
                setSelectedDateFilter,
                selectedVenues,
                setSelectedVenues,
                venues,
                locations,
                hasAdvancedFilters,
                handleRemoveVenue,
                handleClearDateFilter,
                resetFilters,
                handleRsvp,
                showRsvpButtons,
                loadingEventId,
                selectedVibes,
                setSelectedVibes,
                vibes,
                vibesLoading
              }) => (
                <div className="space-y-6">
                  {/* Vibe Filter Section */}
                  <EventsVibeSection
                    selectedVibes={selectedVibes || []}
                    onVibeChange={setSelectedVibes || (() => {})}
                    vibes={vibes || []}
                    vibesLoading={vibesLoading || false}
                  />
                  
                  {/* Category and Advanced Filters */}
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
                  
                  {/* Results Display */}
                  <EventsResultsDisplay
                    filteredEvents={filteredEvents}
                    similarEvents={similarEvents}
                    isLoading={eventsLoading}
                    isVenuesLoading={isVenuesLoading}
                    isFilterLoading={isFilterLoading}
                    hasActiveFilters={hasActiveFilters}
                    handleRsvp={handleRsvp}
                    showRsvpButtons={showRsvpButtons}
                    loadingEventId={loadingEventId}
                    isNoneSelected={isNoneSelected}
                    selectAll={selectAll}
                  />
                </div>
              )}
            </EventsDataProvider>
          </div>
        </div>
      </div>
    </FilterStateProvider>
  );
};

export default Events;
