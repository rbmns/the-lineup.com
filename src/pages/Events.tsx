
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
        
        <div className="w-full py-4 sm:py-6 md:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              vibesLoading,
              isFilteredByLocation,
              userLocation,
              selectedLocationId,
              onLocationChange,
            }) => {
              const wrappedHandleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<void> => {
                await handleRsvp(eventId, status);
              };

              return (
                <div className="space-y-4 sm:space-y-6">
                  {isFilteredByLocation && userLocation && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-center text-sm text-blue-800 mx-4 sm:mx-0">
                      Showing events near <strong>{userLocation.location}</strong>.
                    </div>
                  )}
                  
                  <EventsVibeSection
                    selectedVibes={selectedVibes || []}
                    onVibeChange={setSelectedVibes || (() => {})}
                    vibes={vibes || []}
                    vibesLoading={vibesLoading || false}
                  />
                  
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
                    selectedLocationId={selectedLocationId}
                    onLocationChange={onLocationChange}
                  />
                  
                  <EventsResultsDisplay
                    filteredEvents={filteredEvents}
                    similarEvents={similarEvents}
                    isLoading={eventsLoading}
                    isVenuesLoading={isVenuesLoading}
                    isFilterLoading={isFilterLoading}
                    hasActiveFilters={hasActiveFilters}
                    handleRsvp={wrappedHandleRsvp}
                    showRsvpButtons={showRsvpButtons}
                    loadingEventId={loadingEventId}
                    isNoneSelected={isNoneSelected}
                    selectAll={selectAll}
                    onEventSelect={undefined}
                    selectedEventId={undefined}
                    isOverlayMode={false}
                  />
                </div>
              );
            }}
          </EventsDataProvider>
        </div>
      </div>
    </FilterStateProvider>
  );
};

export default Events;
