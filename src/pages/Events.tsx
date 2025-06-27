import React, { useState, useCallback } from 'react';
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
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

  // Add search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const dateFilters = ['today', 'tomorrow', 'this week', 'this weekend', 'next week', 'later'];

  // Handle real-time search
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const searchPattern = `%${query.toLowerCase()}%`;
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues!events_venue_id_fkey(id, name, city, street, postal_code)
        `)
        .eq('status', 'published')
        .or(`title.ilike.${searchPattern},description.ilike.${searchPattern},destination.ilike.${searchPattern},event_category.ilike.${searchPattern},tags.ilike.${searchPattern},vibe.ilike.${searchPattern}`)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Search error:', error);
        return;
      }

      if (data) {
        const processedEvents = data.map(event => ({
          ...event,
          venues: event.venues ? {
            id: event.venues.id,
            name: event.venues.name,
            city: event.venues.city,
            street: event.venues.street,
            postal_code: event.venues.postal_code
          } : undefined,
          attendees: {
            going: 0,
            interested: 0
          }
        }));

        setSearchResults(processedEvents);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

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

  // Determine which events to display
  const displayEvents = searchQuery.trim() ? searchResults : events;
  const filteredEventsCount = displayEvents?.length || 0;

  return (
    <div className="min-h-screen w-full">
      {/* Compact Header Section - Mobile optimized */}
      <div className="w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#005F73] leading-tight">
            Discover <span className="text-[#2A9D8F]">Events</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4A4A48] max-w-xl mx-auto leading-relaxed px-2">
            Discover what's happening nearby — from beach parties to chill yoga sessions.
          </p>
        </div>
      </div>

      {/* Content - Mobile optimized spacing */}
      <div className="w-full px-2 sm:px-4 lg:px-8">
        <div className="space-y-3 sm:space-y-4">
          {/* Search and Filters Row */}
          <div className="space-y-3 lg:space-y-0">
            {/* Desktop Layout - Search and Filters on same row */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search - narrower on desktop */}
              <div className="flex-1 max-w-md">
                <EventSearch 
                  placeholder="Search events..." 
                  className="w-full"
                  square={true}
                  onSearch={handleSearch}
                  initialValue={searchQuery}
                />
              </div>
              
              {/* Filters */}
              <div className="flex items-center gap-3">
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

                {/* Clear Filters - Compact */}
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Layout - Stacked with improved spacing */}
            <div className="lg:hidden space-y-3">
              {/* Search Bar */}
              <div className="w-full">
                <EventSearch 
                  placeholder="Search events..." 
                  className="w-full"
                  square={true}
                  onSearch={handleSearch}
                  initialValue={searchQuery}
                />
              </div>

              {/* Filter Dropdowns Row - Better mobile spacing */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
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

              {/* Clear Filters - Mobile */}
              {hasActiveFilters && (
                <div className="w-full">
                  <button
                    onClick={resetAllFilters}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="w-full">
            <EventsResultsSection 
              filteredEvents={displayEvents} 
              hasActiveFilters={hasActiveFilters || !!searchQuery.trim()} 
              resetFilters={() => {
                resetAllFilters();
                setSearchQuery('');
                setSearchResults([]);
              }} 
              eventsLoading={isLoading || isSearching} 
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
