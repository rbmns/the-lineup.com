
import React from 'react';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { EventsDataProvider } from '@/components/events/page-components/EventsDataProvider';
import { EventsPageFilters } from '@/components/events/page-components/EventsPageFilters';
import { EventsResultsDisplay } from '@/components/events/page-components/EventsResultsDisplay';
import { useAuth } from '@/contexts/AuthContext';

const EventsPageRefactored = () => {
  useEventPageMeta();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="w-full px-4 md:px-6 py-4 md:py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="What's Happening @ Zandvoort Area?" />
        
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
            loadingEventId
          }) => (
            <>
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
            </>
          )}
        </EventsDataProvider>
      </div>
    </div>
  );
};

export default EventsPageRefactored;
