
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';
import { useVenueAreas } from '@/hooks/useVenueAreas';
import { EventSearch } from '@/components/events/search/EventSearch';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedRsvp } from '@/hooks/useUnifiedRsvp';
import { VibesDropdownFilter } from '@/components/events/filters/VibesDropdownFilter';
import { CategoriesDropdownFilter } from '@/components/events/filters/CategoriesDropdownFilter';
import { DateDropdownFilter } from '@/components/events/filters/DateDropdownFilter';
import { LocationDropdownFilter } from '@/components/events/filters/LocationDropdownFilter';

const Events = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { handleRsvp, loadingEventId } = useUnifiedRsvp();

  const {
    events,
    allEvents,
    isLoading,
    selectedVibes,
    selectedEventTypes,
    selectedVenues,
    selectedLocation,
    dateRange,
    selectedDateFilter,
    setSelectedVibes,
    setSelectedEventTypes,
    setSelectedVenues,
    setSelectedLocation,
    setDateRange,
    setSelectedDateFilter,
    allEventTypes,
    availableVenues,
    hasActiveFilters,
    resetAllFilters,
    isLocationLoaded
  } = useEventsPageData();

  const { data: venueAreas = [], isLoading: areasLoading } = useVenueAreas();

  const dateFilters = ['today', 'tomorrow', 'this week', 'this weekend', 'next week', 'later'];

  const toggleDateFilter = (filter: string) => {
    const newFilter = selectedDateFilter === filter ? 'anytime' : filter;
    setSelectedDateFilter(newFilter);
  };

  const handleCategoryToggle = (category: string) => {
    const newTypes = selectedEventTypes.includes(category)
      ? selectedEventTypes.filter(t => t !== category)
      : [...selectedEventTypes, category];
    setSelectedEventTypes(newTypes);
  };

  const handleSelectAllCategories = () => {
    setSelectedEventTypes(allEventTypes);
  };

  const handleDeselectAllCategories = () => {
    setSelectedEventTypes([]);
  };

  const filteredEventsCount = events?.length || 0;

  return (
    <div className="min-h-screen w-full">
      {/* Compact Header Section */}
      <div className="w-full px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#005F73] leading-tight">
            Discover <span className="text-[#2A9D8F]">Events</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4A4A48] max-w-xl mx-auto leading-relaxed">
            Discover what's happening nearby — from beach parties to chill yoga sessions.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-3 sm:px-4 lg:px-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="w-full">
            <EventSearch 
              placeholder="Search events..." 
              className="w-full"
              square={true}
            />
          </div>

          {/* Filter Dropdowns Row */}
          <div className="flex flex-wrap gap-3">
            <VibesDropdownFilter
              selectedVibes={selectedVibes}
              onVibeChange={setSelectedVibes}
              events={allEvents || []}
              vibesLoading={isLoading}
            />
            
            <CategoriesDropdownFilter
              selectedCategories={selectedEventTypes}
              onToggleCategory={handleCategoryToggle}
              onSelectAll={handleSelectAllCategories}
              onDeselectAll={handleDeselectAllCategories}
              allEventTypes={allEventTypes}
            />
            
            <DateDropdownFilter
              selectedDateFilter={selectedDateFilter}
              onDateFilterChange={setSelectedDateFilter}
              dateFilters={dateFilters}
            />
            
            <LocationDropdownFilter
              venueAreas={venueAreas}
              selectedLocationId={selectedLocation}
              onLocationChange={setSelectedLocation}
              isLoading={areasLoading}
              isLocationLoaded={isLocationLoaded}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="w-full">
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Results Section */}
          <div className="w-full">
            <EventsResultsSection 
              filteredEvents={events} 
              hasActiveFilters={hasActiveFilters} 
              resetFilters={resetAllFilters} 
              eventsLoading={isLoading} 
              isFilterLoading={false} 
              user={user} 
              enhancedHandleRsvp={handleRsvp} 
              loadingEventId={loadingEventId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
