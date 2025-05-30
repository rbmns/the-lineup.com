import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageFilters } from '@/components/events/page-components/EventsPageFilters';
import { CategoryFilteredEventsContent } from '@/components/events/category-filters/CategoryFilteredEventsContent';
import { PageHeader } from '@/components/ui/page-header';

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
    <div className="w-full">
      {/* Hero Section */}
      <PageHeader 
        title="Find events and plans that fit your vibe"
        subtitle="Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want."
      />

      {/* Main Content */}
      <div className="px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 md:space-y-8">
            {/* Find Your Vibe Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">Find your vibe</h2>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  View all →
                </button>
              </div>
              
              {/* Category Filters */}
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

            {/* Upcoming Events Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">Upcoming Events</h2>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  View all →
                </button>
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
      </div>
    </div>
  );
};

export default Events;
