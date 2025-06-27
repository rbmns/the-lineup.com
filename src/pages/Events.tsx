
import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { useVenueAreas } from '@/hooks/useVenueAreas';
import { LocationFilter } from '@/components/events/filters/LocationFilter';
import { EventSearch } from '@/components/events/search/EventSearch';
import { EventCategories } from '@/components/events/Event_Categories';
import { DateFilterPill } from '@/components/events/DateFilterPill';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedRsvp } from '@/hooks/useUnifiedRsvp';

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

          {/* Location Filter */}
          <div className="w-full">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-medium text-gray-700">Location</h3>
                {selectedLocation && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    1
                  </span>
                )}
              </div>
              <LocationFilter
                venueAreas={venueAreas}
                selectedLocationId={selectedLocation}
                onLocationChange={setSelectedLocation}
                isLoading={areasLoading}
                isLocationLoaded={isLocationLoaded}
                className="w-full"
                compact={true}
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="w-full">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-medium text-gray-700">Categories</h3>
                {selectedEventTypes.length > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {selectedEventTypes.length}
                  </span>
                )}
              </div>
              <EventCategories
                selectedCategories={selectedEventTypes}
                onToggleCategory={handleCategoryToggle}
                onSelectAll={handleSelectAllCategories}
                onDeselectAll={handleDeselectAllCategories}
                variant="filter"
              />
            </div>
          </div>

          {/* Vibe Filter */}
          <div className="w-full">
            <EventsVibeSection 
              selectedVibes={selectedVibes} 
              onVibeChange={setSelectedVibes} 
              events={allEvents || []} 
              vibesLoading={isLoading} 
            />
          </div>

          {/* Date Filter */}
          <div className="w-full">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-medium text-gray-700">When</h3>
                {selectedDateFilter && selectedDateFilter !== 'anytime' && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    1
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedDateFilter('anytime')}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all font-medium ${
                    selectedDateFilter === 'anytime' || !selectedDateFilter
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Anytime
                </button>
                {dateFilters.map((filter) => (
                  <DateFilterPill
                    key={filter}
                    label={filter}
                    active={selectedDateFilter === filter}
                    onClick={() => toggleDateFilter(filter)}
                    className="text-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="w-full">
              <button
                onClick={resetAllFilters}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
