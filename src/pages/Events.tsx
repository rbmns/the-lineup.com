import React from 'react';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { EventsDataProvider } from '@/components/events/page-components/EventsDataProvider';
import { EventsPageFilters } from '@/components/events/page-components/EventsPageFilters';
import { EventsResultsDisplay } from '@/components/events/page-components/EventsResultsDisplay';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { FilterStateProvider } from '@/contexts/FilterStateContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOutletContext } from 'react-router-dom';

interface OutletContext {
  onEventSelect?: (eventId: string | null) => void;
  selectedEventId?: string | null;
}

const Events = () => {
  useEventPageMeta();
  const { isAuthenticated } = useAuth();
  const context = useOutletContext<OutletContext>();
  const { selectedEventId, onEventSelect } = context || {};
  
  return (
    <FilterStateProvider>
      <div className="min-h-screen bg-white">
        <EventsPageHeader 
          title="What's Happening?" 
          subtitle="Discover events in the Zandvoort area"
          showBackground={true}
        />
        
        {/* Remove unnecessary px-4/md:px-6 for flush left/right */}
        <div className={`w-full py-6 md:py-8 transition-all duration-300 ${
          selectedEventId ? 'max-w-4xl' : 'max-w-7xl'
        } mx-auto`}>
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
            }) => {
              // Wrap the handleRsvp to convert Promise<boolean> to Promise<void>
              const wrappedHandleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<void> => {
                await handleRsvp(eventId, status);
              };

              return (
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
                    handleRsvp={wrappedHandleRsvp}
                    showRsvpButtons={showRsvpButtons}
                    loadingEventId={loadingEventId}
                    isNoneSelected={isNoneSelected}
                    selectAll={selectAll}
                    onEventSelect={onEventSelect}
                    selectedEventId={selectedEventId}
                    isOverlayMode={!!selectedEventId}
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
