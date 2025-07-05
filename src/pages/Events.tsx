import React, { useState, useCallback, useEffect } from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';
import { useVenueAreas } from '@/hooks/useVenueAreas';
import { EventSearch } from '@/components/events/search/EventSearch';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { VibesDropdownFilter } from '@/components/events/filters/VibesDropdownFilter';
import { CategoriesDropdownFilter } from '@/components/events/filters/CategoriesDropdownFilter';
import { DateDropdownFilter } from '@/components/events/filters/DateDropdownFilter';
import { LocationDropdownFilter } from '@/components/events/filters/LocationDropdownFilter';
import { MobileFriendlyDatePicker } from '@/components/events/filters/MobileFriendlyDatePicker';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Event } from '@/types';
import { pageSeoTags } from '@/utils/seoUtils';

const Events = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();

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

  // Debug filter states
  console.log('Events page filter states:', {
    selectedVibes,
    selectedEventTypes,
    selectedVenues,
    selectedLocation,
    allEvents: allEvents?.length,
    events: events?.length,
    hasActiveFilters
  });

  const { data: venueAreas = [], isLoading: areasLoading } = useVenueAreas();

  // Add search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dateFilters = ['today', 'tomorrow', 'this week', 'this weekend', 'next week', 'later'];

  // Helper function to filter out past events
  const filterUpcomingEvents = (events: Event[]) => {
    const now = new Date();
    
    return events.filter(event => {
      if (!event.start_datetime) {
        return true; // Include events without start_datetime
      }
      const eventDate = new Date(event.start_datetime);
      return eventDate >= now;
    });
  };

  // Helper function to check if event belongs to selected area
  const eventBelongsToArea = (event: Event, selectedAreaId: string): boolean => {
    const selectedArea = venueAreas.find(area => area.id === selectedAreaId);
    if (!selectedArea || !selectedArea.cities) {
      return false;
    }

    // Check venue city
    const venueCity = event.venues?.city;
    if (venueCity) {
      return selectedArea.cities.some(areaCity => 
        areaCity.toLowerCase() === venueCity.toLowerCase()
      );
    }

    // Check destination as fallback
    const eventDestination = event.destination;
    if (eventDestination) {
      return selectedArea.cities.some(areaCity => 
        areaCity.toLowerCase() === eventDestination.toLowerCase()
      );
    }

    return false;
  };

  // Enhanced search that respects all filters and excludes past events
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
        .order('start_datetime', { ascending: true });

      const { data, error } = await searchQuery;

      if (error) {
        console.error('Search error:', error);
        return;
      }

      if (data) {
        let processedEvents: Event[] = data.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          start_datetime: event.start_datetime,
          end_datetime: event.end_datetime,
          venue_id: event.venue_id,
          venues: event.venues ? {
            id: event.venues.id,
            name: event.venues.name,
            city: event.venues.city,
            street: event.venues.street,
            postal_code: event.venues.postal_code
          } : undefined,
          event_category: event.event_category,
          vibe: event.vibe,
          creator: null,
          status: event.status,
          attendees: {
            going: 0,
            interested: 0
          },
          tags: event.tags ? (typeof event.tags === 'string' ? [event.tags] : event.tags) : [],
          image_urls: event.image_urls || [],
          booking_link: event.booking_link,
          organizer_link: event.organizer_link,
          fee: event.fee,
          destination: event.destination,
          organiser_name: event.organiser_name,
          created_at: event.created_at,
          updated_at: event.updated_at,
          fixed_start_time: event.fixed_start_time,
          area: event.area,
          google_maps: event.google_maps,
          extra_info: event.extra_info,
          slug: event.slug,
          coordinates: event.coordinates,
          created_by: event.created_by,
          timezone: event.timezone
        }));

        // Filter out past events from search results
        processedEvents = filterUpcomingEvents(processedEvents);

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

          // Location area filter - FIXED to use proper area-city mapping
          if (selectedLocation) {
            if (!eventBelongsToArea(event, selectedLocation)) {
              return false;
            }
          }

          // Date filter
          if (selectedDateFilter && selectedDateFilter !== 'anytime') {
            const now = new Date();
            const eventDate = new Date(event.start_datetime || '');
            
            switch (selectedDateFilter) {
              case 'today':
                if (eventDate.toDateString() !== now.toDateString()) return false;
                break;
              case 'tomorrow':
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                if (eventDate.toDateString() !== tomorrow.toDateString()) return false;
                break;
              case 'this week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                if (eventDate < weekStart || eventDate > weekEnd) return false;
                break;
              case 'this weekend':
                const dayOfWeek = now.getDay();
                const daysUntilSaturday = (6 - dayOfWeek) % 7;
                const saturday = new Date(now);
                saturday.setDate(now.getDate() + daysUntilSaturday);
                const sunday = new Date(saturday);
                sunday.setDate(saturday.getDate() + 1);
                if (eventDate.toDateString() !== saturday.toDateString() && 
                    eventDate.toDateString() !== sunday.toDateString()) return false;
                break;
              case 'next week':
                const nextWeekStart = new Date(now);
                nextWeekStart.setDate(now.getDate() + (7 - now.getDay()));
                const nextWeekEnd = new Date(nextWeekStart);
                nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
                if (eventDate < nextWeekStart || eventDate > nextWeekEnd) return false;
                break;
            }
          }

          // Date range filter
          if (dateRange?.from && event.start_datetime) {
            const eventDate = new Date(event.start_datetime);
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

  const handleClearDateFilter = () => {
    setSelectedDateFilter('anytime');
    setDateRange(undefined);
  };

  // Format date range for display
  const formatDateRangeDisplay = () => {
    if (!dateRange?.from) return 'DATE';
    if (!dateRange.to) return format(dateRange.from, 'MMM dd');
    return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`;
  };

  // Determine which events to display - ensure consistent Event type
  const displayEvents: Event[] = searchQuery.trim() ? searchResults : (events || []);
  const filteredEventsCount = displayEvents.length;

  // Set page title when component mounts
  useEffect(() => {
    document.title = pageSeoTags.events.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', pageSeoTags.events.description);
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', pageSeoTags.events.title);
    if (ogDesc) ogDesc.setAttribute('content', pageSeoTags.events.description);
  }, []);

  // Enhanced reset that clears search too and properly resets location to null
  const handleResetAllFilters = () => {
    resetAllFilters(); // This will reset location to null via the hook
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen w-full bg-sand overflow-x-hidden">
      {/* Bohemian Header Section */}
      <div className={cn(
        "w-full",
        isMobile ? "px-4 py-6" : "px-6 py-8"
      )}>
        <div className="text-center space-y-3">
          <h1 className={cn(
            "font-display font-semibold text-ocean-deep leading-tight",
            isMobile ? "text-2xl" : "text-3xl sm:text-4xl lg:text-5xl"
          )}>
            Discover <span className="text-vibrant-aqua">Events</span>
          </h1>
        </div>
      </div>

      {/* Content - flows naturally with improved mobile spacing */}
      <div className={cn(
        "w-full max-w-full overflow-x-hidden",
        isMobile ? "px-4" : "px-6"
      )}>
        <div className="space-y-4 max-w-6xl mx-auto w-full overflow-x-hidden">
          {/* Search and Filters - Improved mobile centering */}
          <div className="space-y-3">
            {/* Desktop Layout - Centered */}
            <div className="hidden lg:flex items-center justify-center gap-4">
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
                  onVibeChange={(vibes) => {
                    console.log('Vibe change called:', vibes);
                    setSelectedVibes(vibes);
                  }}
                  events={allEvents || []}
                  vibesLoading={isLoading}
                />
                
                <CategoriesDropdownFilter
                  selectedCategories={selectedEventTypes}
                  onToggleCategory={(category) => {
                    console.log('Category toggle called:', category);
                    handleCategoryToggle(category);
                  }}
                  onSelectAll={handleSelectAllCategories}
                  onDeselectAll={handleDeselectAllCategories}
                  allEventTypes={allEventTypes}
                />
                
                {/* Date Range Picker with improved positioning */}
                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium border rounded-md transition-colors uppercase tracking-wide",
                      dateRange?.from
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {formatDateRangeDisplay()}
                  </button>
                  
                  {showDatePicker && (
                    <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden min-w-max">
                      <div className="max-w-none overflow-x-auto">
                        <MobileFriendlyDatePicker
                          dateRange={dateRange}
                          onDateRangeChange={setDateRange}
                          selectedDateFilter={selectedDateFilter}
                          onDateFilterChange={setSelectedDateFilter}
                          onReset={handleClearDateFilter}
                          onClose={() => setShowDatePicker(false)}
                          className="w-full p-4"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <LocationDropdownFilter
                  venueAreas={venueAreas}
                  selectedLocationId={selectedLocation}
                  onLocationChange={(locationId) => {
                    console.log('Location change called:', locationId);
                    setSelectedLocation(locationId);
                  }}
                  isLoading={areasLoading}
                  isLocationLoaded={isLocationLoaded}
                />
              </div>

              {(hasActiveFilters || searchQuery.trim()) && (
                <button
                  onClick={handleResetAllFilters}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium text-ocean-deep/70 hover:text-ocean-deep hover:bg-coral/10 border border-ocean-deep/20 rounded-md transition-all duration-200 uppercase tracking-wide"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* Mobile Layout - Centered with tighter spacing */}
            <div className="lg:hidden space-y-3">
              <div className="w-full max-w-sm mx-auto">
                <EventSearch 
                  placeholder="Search events..." 
                  className="w-full"
                  square={true}
                  onSearch={handleSearch}
                  initialValue={searchQuery}
                />
              </div>

              {/* Centered filter buttons with minimal gaps */}
              <div className="flex flex-wrap gap-2 justify-center items-center">
                <VibesDropdownFilter
                  selectedVibes={selectedVibes}
                  onVibeChange={(vibes) => {
                    console.log('Mobile vibe change called:', vibes);
                    setSelectedVibes(vibes);
                  }}
                  events={allEvents || []}
                  vibesLoading={isLoading}
                />
                
                <CategoriesDropdownFilter
                  selectedCategories={selectedEventTypes}
                  onToggleCategory={(category) => {
                    console.log('Mobile category toggle called:', category);
                    handleCategoryToggle(category);
                  }}
                  onSelectAll={handleSelectAllCategories}
                  onDeselectAll={handleDeselectAllCategories}
                  allEventTypes={allEventTypes}
                />
                
                {/* Mobile date picker - Full screen modal */}
                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium border rounded-md transition-colors uppercase tracking-wide",
                      dateRange?.from
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {formatDateRangeDisplay()}
                  </button>
                  
                  {showDatePicker && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                          <h3 className="font-medium font-mono text-xs uppercase tracking-wide">Select Date</h3>
                          <button
                            onClick={() => setShowDatePicker(false)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                          <MobileFriendlyDatePicker
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                            selectedDateFilter={selectedDateFilter}
                            onDateFilterChange={setSelectedDateFilter}
                            onReset={handleClearDateFilter}
                            onClose={() => setShowDatePicker(false)}
                            className="w-full p-4"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <LocationDropdownFilter
                  venueAreas={venueAreas}
                  selectedLocationId={selectedLocation}
                  onLocationChange={(locationId) => {
                    console.log('Mobile location change called:', locationId);
                    setSelectedLocation(locationId);
                  }}
                  isLoading={areasLoading}
                  isLocationLoaded={isLocationLoaded}
                />
              </div>

              {(hasActiveFilters || searchQuery.trim()) && (
                <div className="flex justify-center">
                  <button
                    onClick={handleResetAllFilters}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium text-ocean-deep/70 hover:text-ocean-deep hover:bg-coral/10 border border-ocean-deep/20 rounded-md transition-all duration-200 uppercase tracking-wide"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Section with improved mobile spacing */}
          <div className="w-full overflow-x-hidden">
            <EventsResultsSection 
              filteredEvents={displayEvents} 
              hasActiveFilters={hasActiveFilters || !!searchQuery.trim()} 
              resetFilters={handleResetAllFilters} 
              eventsLoading={isLoading || isSearching} 
              isFilterLoading={false} 
              user={user} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
