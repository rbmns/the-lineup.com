import React, { useEffect } from 'react';
import { useFilterState } from '@/contexts/FilterStateContext';
import { useEvents } from '@/hooks/useEvents';
import { useUnifiedRsvp } from '@/hooks/useUnifiedRsvp';
import { useVenueAreas } from '@/hooks/useVenueAreas';
import { useFilteredEvents } from '@/hooks/events/useFilteredEvents';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Event } from '@/types';
import { pageSeoTags } from '@/utils/seoUtils';
import { filterUpcomingEvents } from '@/utils/date-filtering';

// Filter Components
import { VibesDropdownFilter } from '@/components/events/filters/VibesDropdownFilter';
import { CategoriesDropdownFilter } from '@/components/events/filters/CategoriesDropdownFilter';
import { DateDropdownFilter } from '@/components/events/filters/DateDropdownFilter';
import { LocationDropdownFilter } from '@/components/events/filters/LocationDropdownFilter';
import { MobileFriendlyDatePicker } from '@/components/events/filters/MobileFriendlyDatePicker';
import { EventSearch } from '@/components/events/search/EventSearch';

// Event Display Components
import { EventCard } from '@/components/events/EventCard';
import { SkeletonEventCard } from '@/components/events/SkeletonEventCard';

import { X } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

const Events = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Filter state from context
  const {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    selectedVibes,
    setSelectedVibes,
    selectedVenues,
    setSelectedVenues,
    selectedLocation,
    setSelectedLocation,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    hasActiveFilters,
    resetFilters
  } = useFilterState();

  // RSVP functionality
  const { handleRsvp, loadingEventId } = useUnifiedRsvp();

  // Data fetching
  const { data: allEvents = [], isLoading: eventsLoading } = useEvents(user?.id, { includeAllStatuses: true });
  const { data: venueAreas = [], isLoading: areasLoading } = useVenueAreas();

  // Process events data (filter upcoming only)
  const upcomingEvents = React.useMemo(() => {
    if (!allEvents) return [];
    return filterUpcomingEvents(allEvents);
  }, [allEvents]);

  // Get available event types for filtering
  const allEventTypes = React.useMemo(() => {
    if (!upcomingEvents) return [];
    const categories = upcomingEvents
      .map(event => event.event_category)
      .filter((category): category is string => Boolean(category));
    return [...new Set(categories)].sort();
  }, [upcomingEvents]);

  // Apply filters to events
  const filteredEvents = useFilteredEvents({
    events: upcomingEvents,
    selectedCategories,
    allEventTypes,
    selectedVenues,
    selectedVibes,
    dateRange,
    selectedDateFilter,
    selectedLocation,
    venueAreas
  });

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Search handler
  const handleSearch = React.useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // Simple client-side search for now
      const searchPattern = query.toLowerCase();
      const results = upcomingEvents.filter(event => 
        event.title?.toLowerCase().includes(searchPattern) ||
        event.description?.toLowerCase().includes(searchPattern) ||
        event.event_category?.toLowerCase().includes(searchPattern) ||
        event.destination?.toLowerCase().includes(searchPattern) ||
        event.vibe?.toLowerCase().includes(searchPattern)
      );
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [upcomingEvents]);

  // Format date range for display
  const formatDateRangeDisplay = () => {
    if (!dateRange?.from) return 'DATE';
    if (!dateRange.to) return format(dateRange.from, 'MMM dd');
    return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`;
  };

  // Determine which events to display
  const displayEvents: Event[] = searchQuery.trim() ? searchResults : filteredEvents;

  // Enhanced reset that clears search too
  const handleResetAllFilters = () => {
    resetFilters();
    setSearchQuery('');
    setSearchResults([]);
  };

  // Set page meta
  useEffect(() => {
    document.title = pageSeoTags.events.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', pageSeoTags.events.description);
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', pageSeoTags.events.title);
    if (ogDesc) ogDesc.setAttribute('content', pageSeoTags.events.description);
  }, []);

  return (
    <div className="min-h-screen w-full bg-sand overflow-x-hidden">
      {/* Header */}
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

      {/* Content */}
      <div className={cn(
        "w-full max-w-6xl mx-auto overflow-x-hidden",
        isMobile ? "px-4" : "px-6"
      )}>
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Desktop Layout */}
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
                  onVibeChange={setSelectedVibes}
                  events={upcomingEvents}
                  vibesLoading={eventsLoading}
                />
                
                <CategoriesDropdownFilter
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  onSelectAll={selectAll}
                  onDeselectAll={deselectAll}
                  allEventTypes={allEventTypes}
                />
                
                {/* Date Range Picker */}
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
                      <MobileFriendlyDatePicker
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        selectedDateFilter={selectedDateFilter}
                        onDateFilterChange={setSelectedDateFilter}
                        onReset={() => {
                          setSelectedDateFilter('');
                          setDateRange(undefined);
                        }}
                        onClose={() => setShowDatePicker(false)}
                        className="w-full p-4"
                      />
                    </div>
                  )}
                </div>
                
                <LocationDropdownFilter
                  venueAreas={venueAreas}
                  selectedLocationId={selectedLocation}
                  onLocationChange={setSelectedLocation}
                  isLoading={areasLoading}
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

            {/* Mobile Layout */}
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

              <div className="flex flex-wrap gap-2 justify-center items-center">
                <VibesDropdownFilter
                  selectedVibes={selectedVibes}
                  onVibeChange={setSelectedVibes}
                  events={upcomingEvents}
                  vibesLoading={eventsLoading}
                />
                
                <CategoriesDropdownFilter
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  onSelectAll={selectAll}
                  onDeselectAll={deselectAll}
                  allEventTypes={allEventTypes}
                />

                <DateDropdownFilter
                  selectedDateFilter={selectedDateFilter}
                  onDateFilterChange={setSelectedDateFilter}
                  dateFilters={['today', 'tomorrow', 'this week', 'this weekend', 'next week', 'later']}
                />
                
                <LocationDropdownFilter
                  venueAreas={venueAreas}
                  selectedLocationId={selectedLocation}
                  onLocationChange={setSelectedLocation}
                  isLoading={areasLoading}
                />

                {(hasActiveFilters || searchQuery.trim()) && (
                  <button
                    onClick={handleResetAllFilters}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs font-mono font-medium text-ocean-deep/70 hover:text-ocean-deep hover:bg-coral/10 border border-ocean-deep/20 rounded-md transition-all duration-200"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {eventsLoading ? 'Loading events...' : `${displayEvents.length} events found`}
            </p>
          </div>

          {/* Events Grid */}
          <div className="w-full">
            {eventsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonEventCard key={i} />
                ))}
              </div>
            ) : displayEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {hasActiveFilters || searchQuery.trim() 
                    ? "No events found matching your filters." 
                    : "No events available."}
                </p>
                {(hasActiveFilters || searchQuery.trim()) && (
                  <button
                    onClick={handleResetAllFilters}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showRsvpButtons={!!user}
                    onRsvp={user ? handleRsvp : undefined}
                    loadingEventId={loadingEventId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;