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

  // Helper function to get cities for a selected area
  const getCitiesForSelectedArea = (areaId: string): string[] => {
    // This would need to be implemented based on your venue area data structure
    // For now, we'll use a basic approach
    return [];
  };

  // Enhanced search that respects all filters
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
      
      let searchQuery = supabase
        .from('events')
        .select(`
          *,
          venues!events_venue_id_fkey(id, name, city, street, postal_code)
        `)
        .eq('status', 'published')
        .or(`title.ilike.${searchPattern},description.ilike.${searchPattern},destination.ilike.${searchPattern},event_category.ilike.${searchPattern},tags.ilike.${searchPattern},vibe.ilike.${searchPattern}`)
        .order('start_date', { ascending: true });

      const { data, error } = await searchQuery;

      if (error) {
        console.error('Search error:', error);
        return;
      }

      if (data) {
        let processedEvents = data.map(event => ({
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

        // Apply filters to search results
        processedEvents = processedEvents.filter(event => {
          // Vibe filter
          if (selectedVibes.length > 0 && !selectedVibes.includes(event.vibe || '')) {
            return false;
          }

          // Category filter
          if (selectedEventTypes.length > 0 && !selectedEventTypes.includes(event.event_category || '')) {
            return false;
          }

          // Venue filter
          if (selectedVenues.length > 0 && !selectedVenues.includes(event.venue_id || '')) {
            return false;
          }

          // Location area filter
          if (selectedLocation) {
            // Get the selected area details
            const selectedArea = venueAreas.find(area => area.id === selectedLocation);
            if (selectedArea && selectedArea.cities) {
              const eventCity = event.venues?.city || event.location;
              if (eventCity && !selectedArea.cities.some(city => 
                city.toLowerCase() === eventCity.toLowerCase()
              )) {
                return false;
              }
            }
          }

          // Date filter
          if (selectedDateFilter && selectedDateFilter !== 'anytime') {
            const today = new Date();
            const eventDate = new Date(event.start_date || '');
            
            switch (selectedDateFilter) {
              case 'today':
                if (eventDate.toDateString() !== today.toDateString()) return false;
                break;
              case 'tomorrow':
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                if (eventDate.toDateString() !== tomorrow.toDateString()) return false;
                break;
              case 'this week':
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                if (eventDate < weekStart || eventDate > weekEnd) return false;
                break;
              case 'this weekend':
                const dayOfWeek = today.getDay();
                const daysUntilSaturday = (6 - dayOfWeek) % 7;
                const saturday = new Date(today);
                saturday.setDate(today.getDate() + daysUntilSaturday);
                const sunday = new Date(saturday);
                sunday.setDate(saturday.getDate() + 1);
                if (eventDate.toDateString() !== saturday.toDateString() && 
                    eventDate.toDateString() !== sunday.toDateString()) return false;
                break;
              case 'next week':
                const nextWeekStart = new Date(today);
                nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
                const nextWeekEnd = new Date(nextWeekStart);
                nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
                if (eventDate < nextWeekStart || eventDate > nextWeekEnd) return false;
                break;
            }
          }

          // Date range filter
          if (dateRange?.from && event.start_date) {
            const eventDate = new Date(event.start_date);
            if (eventDate < dateRange.from) return false;
            if (dateRange.to && eventDate > dateRange.to) return false;
          }

          return true;
        });

        setSearchResults(processedEvents);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [selectedVibes, selectedEventTypes, selectedVenues, selectedLocation, selectedDateFilter, dateRange, venueAreas]);

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

  // Enhanced reset that clears search too
  const handleResetAllFilters = () => {
    resetAllFilters();
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen w-full bg-sand">
      {/* Bohemian Header Section */}
      <div className="w-full px-6 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-ocean-deep leading-tight">
            Discover <span className="text-vibrant-aqua">Events</span>
          </h1>
          <p className="text-base sm:text-lg text-driftwood max-w-2xl mx-auto leading-relaxed font-body">
            Find your next adventure — from sunset beach parties to morning yoga flows.
          </p>
        </div>
      </div>

      {/* Content - flows naturally */}
      <div className="w-full px-6">
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4 lg:space-y-0">
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center gap-4 max-w-5xl mx-auto">
              <div className="flex-1 max-w-md">
                <EventSearch 
                  placeholder="Search events..." 
                  className="w-full"
                  square={true}
                  onSearch={handleSearch}
                  initialValue={searchQuery}
                />
              </div>
              
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
              </div>

              {(hasActiveFilters || searchQuery.trim()) && (
                <button
                  onClick={handleResetAllFilters}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium text-driftwood hover:text-ocean-deep hover:bg-sage/20 border border-sage/40 rounded-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-4">
              <div className="w-full">
                <EventSearch 
                  placeholder="Search events..." 
                  className="w-full"
                  square={true}
                  onSearch={handleSearch}
                  initialValue={searchQuery}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
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

              {(hasActiveFilters || searchQuery.trim()) && (
                <div className="flex justify-center">
                  <button
                    onClick={handleResetAllFilters}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium text-driftwood hover:text-ocean-deep hover:bg-sage/20 border border-sage/40 rounded-md transition-all duration-200"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear All
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
              resetFilters={handleResetAllFilters} 
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
