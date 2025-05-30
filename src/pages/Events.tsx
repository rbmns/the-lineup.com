
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { CategoryFilteredEventsContent } from '@/components/events/category-filters/CategoryFilteredEventsContent';
import { PageHeader } from '@/components/ui/page-header';
import VibeFilter from '@/components/polymet/vibe-filter';
import AdvancedFilters from '@/components/polymet/advanced-filters';

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

  const [selectedVibe, setSelectedVibe] = React.useState<string | null>(null);

  const handleVibeChange = (vibe: string | null) => {
    setSelectedVibe(vibe);
    // TODO: Implement vibe filtering logic
  };

  const handleAdvancedFilterChange = (filters: any) => {
    // Handle event category filters
    if (filters.eventTypes) {
      setSelectedEventTypes(filters.eventTypes);
    }
    
    // Handle venue filters
    if (filters.venues) {
      setSelectedVenues(filters.venues);
    }
    
    // Handle date filters - map from 'date' to 'dateRange'
    if (filters.date) {
      const dateRangeValue = { from: filters.date, to: filters.date };
      setDateRange(dateRangeValue);
    }
    
    if (filters.dateFilter) {
      setSelectedDateFilter(filters.dateFilter);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHeader 
        title="Find events and plans that fit your vibe"
        subtitle="Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want."
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Find Your Vibe Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Find your vibe</h2>
            </div>
            
            {/* Vibe Filters */}
            <div className="w-full">
              <VibeFilter
                selectedVibe={selectedVibe}
                onChange={handleVibeChange}
                size="md"
                className="w-full"
              />
            </div>
          </div>

          {/* Advanced Filters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium">Refine your search</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <AdvancedFilters
                onFilterChange={handleAdvancedFilterChange}
                locations={["Zandvoort Area"]}
                initialFilters={{
                  location: "Zandvoort Area",
                  eventTypes: selectedEventTypes,
                  venues: selectedVenues,
                  date: dateRange?.from,
                  dateFilter: selectedDateFilter
                }}
              />
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {filteredEvents.length} events found
              </span>
            </div>
          </div>

          {/* Events Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">All Events</h2>
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
  );
};

export default Events;
