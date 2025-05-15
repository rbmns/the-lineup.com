
import React from 'react';
// import { useNavigate } from 'react-router-dom'; // No longer used
import { useAuth } from '@/contexts/AuthContext';
import { useCategoryFilteredEvents } from '@/hooks/events/useCategoryFilteredEvents';
import { useCategoryPageSeo } from '@/hooks/events/useCategoryPageSeo';
import { useScrollPositionManager } from '@/hooks/events/useScrollPositionManager';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { CategoryFilterControls } from '@/components/events/category-filters/CategoryFilterControls';
import { CategoryFilteredEventsContent } from '@/components/events/category-filters/CategoryFilteredEventsContent';

const CategoryFilteredEventsPage = () => {
  // Apply SEO settings
  useCategoryPageSeo();
  
  // Manage UI state, scroll position and filters
  // const navigate = useNavigate(); // No longer used
  const { user } = useAuth();
  const { 
    showEventTypeFilter, setShowEventTypeFilter,
    showVenueFilter, setShowVenueFilter,
    showDateFilter, setShowDateFilter
  } = useScrollPositionManager();
  
  // Event filtering and state
  const {
    // events, // Not directly used here, exactMatches is used for display
    isLoading, // For initial data load
    // error, // Not handled in UI, consider adding error display
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading, // For loading indication when filters change
    loadingEventId, // Updated from rsvpLoading
    availableEventTypes,
    availableVenues,
    showNoExactMatchesMessage,
    exactMatches,
    similarEvents,
    hasActiveFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
    handleEventRsvp // The RSVP function from the hook
  } = useCategoryFilteredEvents(user?.id);
  
  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <EventsPageHeader title="Explore Events" />
        
        <div className="space-y-12">
          {/* Filter Controls Section */}
          <CategoryFilterControls
            showEventTypeFilter={showEventTypeFilter}
            setShowEventTypeFilter={setShowEventTypeFilter}
            showVenueFilter={showVenueFilter}
            setShowVenueFilter={setShowVenueFilter}
            showDateFilter={showDateFilter}
            setShowDateFilter={setShowDateFilter}
            selectedEventTypes={selectedEventTypes}
            setSelectedEventTypes={setSelectedEventTypes}
            selectedVenues={selectedVenues}
            setSelectedVenues={setSelectedVenues}
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedDateFilter={selectedDateFilter}
            setSelectedDateFilter={setSelectedDateFilter}
            availableEventTypes={availableEventTypes}
            availableVenues={availableVenues}
            resetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
            onRemoveEventType={handleRemoveEventType}
            onRemoveVenue={handleRemoveVenue}
            onClearDateFilter={handleClearDateFilter}
          />

          {/* Events Content Section */}
          <CategoryFilteredEventsContent 
            showNoExactMatchesMessage={showNoExactMatchesMessage}
            resetFilters={resetFilters}
            exactMatches={exactMatches}
            similarEvents={similarEvents}
            isLoading={isLoading} // For skeleton loading of the list
            isFilterLoading={isFilterLoading} // Also contributes to list loading state
            hasActiveFilters={hasActiveFilters}
            onRsvp={user ? handleEventRsvp : undefined}
            loadingEventId={loadingEventId} // Pass loadingEventId down
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryFilteredEventsPage;
