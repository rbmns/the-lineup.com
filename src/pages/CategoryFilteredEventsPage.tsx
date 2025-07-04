
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCategoryFilteredEvents } from '@/hooks/events/useCategoryFilteredEvents';
import { useCategoryPageSeo } from '@/hooks/events/useCategoryPageSeo';
import { useScrollPositionManager } from '@/hooks/events/useScrollPositionManager';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { CategoryFilteredEventsContent } from '@/components/events/category-filters/CategoryFilteredEventsContent';
import { NewFilterSection } from '@/components/events/NewFilterSection';

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
  
  // Get all the event filtering logic from our hook
  const {
    // Available data and filter options
    availableEventTypes,
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
    isLoading,
    // Filter management
    selectAllEventTypes,
    deselectAllEventTypes,
  } = useCategoryFilteredEvents(user?.id);
  
  // Enhanced category filtering
  const eventTypeStrings = availableEventTypes.map(item => item.value);
  
  const hasAdvancedFilters = hasActiveFilters || 
    selectedVenues.length > 0 || 
    !!dateRange || 
    !!selectedDateFilter;

  // Wrapper function to match the expected signature
  const handleRsvpWrapper = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    await handleEventRsvp(eventId, status);
    return true;
  };

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <EventsPageHeader 
            title="Explore Events" 
            subtitle="Find the perfect events for you"
          />
        </div>
        
        <div className="space-y-6 md:space-y-12">
          {/* Mobile-optimized Filter Section */}
          <div className="space-y-4">
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
          </div>

          {/* Events Content Section */}
          <CategoryFilteredEventsContent 
            showNoExactMatchesMessage={showNoExactMatchesMessage}
            resetFilters={resetFilters}
            exactMatches={exactMatches}
            similarEvents={similarEvents}
            isLoading={isLoading} 
            isFilterLoading={isFilterLoading}
            hasActiveFilters={hasActiveFilters}
            onRsvp={user ? handleRsvpWrapper : undefined}
            loadingEventId={loadingEventId}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryFilteredEventsPage;
