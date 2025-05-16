
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCategoryFilteredEvents } from '@/hooks/events/useCategoryFilteredEvents';
import { useCategoryPageSeo } from '@/hooks/events/useCategoryPageSeo';
import { useScrollPositionManager } from '@/hooks/events/useScrollPositionManager';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import CategoryFilteredEventsContent from '@/components/events/category-filters/CategoryFilteredEventsContent';
import { NewFilterSection } from '@/components/events/NewFilterSection';
import { useCategoryFilterSelection } from '@/hooks/events/useCategoryFilterSelection';

const CategoryFilteredEventsPage = () => {
  // Apply SEO settings
  useCategoryPageSeo();
  
  // Manage UI state, scroll position and filters
  const { user } = useAuth();
  const { 
    showEventTypeFilter, setShowEventTypeFilter,
    showVenueFilter, setShowVenueFilter,
    showDateFilter, setShowDateFilter
  } = useScrollPositionManager();
  
  // Event filtering and state
  const {
    // Available data and loading state
    isLoading,
    // Filter options
    availableEventTypes: allEventTypes,
    availableVenues,
    // Filter state
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    // Event data
    exactMatches,
    similarEvents,
    showNoExactMatchesMessage,
    hasActiveFilters,
    // Actions
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
    // RSVP handling
    loadingEventId,
    handleEventRsvp,
    // Filter management
    selectAllEventTypes,
    deselectAllEventTypes,
  } = useCategoryFilteredEvents(user?.id);
  
  // Enhanced category filtering
  const eventTypeStrings = allEventTypes.map(item => item.value);
  
  const hasAdvancedFilters = hasActiveFilters || 
    selectedVenues.length > 0 || 
    !!dateRange || 
    !!selectedDateFilter;

  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="Explore Events" />
        
        <div className="space-y-12">
          {/* New Filter Section */}
          <NewFilterSection
            allEventTypes={eventTypeStrings}
            selectedEventTypes={selectedEventTypes}
            onToggleEventType={(type) => {
              if (selectedEventTypes.includes(type)) {
                setSelectedEventTypes(selectedEventTypes.filter(t => t !== type));
              } else {
                setSelectedEventTypes([...selectedEventTypes, type]);
              }
            }}
            onSelectAllEventTypes={selectAllEventTypes}
            onDeselectAllEventTypes={deselectAllEventTypes}
            resetAllFilters={resetFilters}
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedDateFilter={selectedDateFilter}
            setSelectedDateFilter={setSelectedDateFilter}
            selectedVenues={selectedVenues}
            setSelectedVenues={setSelectedVenues}
            availableVenues={availableVenues}
            hasAdvancedFilters={hasAdvancedFilters}
          />

          {/* Events Content Section */}
          <CategoryFilteredEventsContent 
            mainEvents={exactMatches}
            relatedEvents={similarEvents}
            isLoading={isLoading || isFilterLoading}
            onRsvp={user ? handleEventRsvp : undefined}
            showRsvpButtons={!!user}
            loadingEventId={loadingEventId}
            hasActiveFilters={hasActiveFilters}
            selectedCategories={selectedEventTypes}
            onCategoryChange={handleRemoveEventType}
            onClearFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryFilteredEventsPage;
