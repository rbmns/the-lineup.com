import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { EventCard } from '@/components/events/EventCard';
import { AppPageHeader } from '@/components/ui/AppPageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventsFilters } from '@/hooks/useEventsFilters';
import { CategoryFilter } from '@/components/events/filters/CategoryFilter';
import { LocationFilter } from '@/components/events/filters/LocationFilter';
import { DateRangeFilter } from '@/components/events/filters/DateRangeFilter';
import { VibeFilter } from '@/components/events/filters/VibeFilter';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Events() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const {
    events,
    isLoading,
    isError,
    error,
    refetch,
    ...filterProps
  } = useEventsFilters({
    initialCategory: 'all',
    initialLocation: 'all', // Set default to "all"
    initialDateRange: null,
    initialVibe: 'all'
  });

  useEffect(() => {
    refetch();
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AppPageHeader>
          <Skeleton className="h-8 w-[200px] mb-4" />
          <Skeleton className="h-6 w-[300px]" />
        </AppPageHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AppPageHeader>Events</AppPageHeader>
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  const filteredEvents = events?.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AppPageHeader subtitle="Discover local events and join the community">
        Events
      </AppPageHeader>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button variant="outline" onClick={toggleFilter}>
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>

        {isAuthenticated && (
          <Link to="/events/create-simple">
            <Button className="bg-midnight text-ivory hover:bg-overcast flex items-center gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <CategoryFilter
              value={filterProps.category}
              onChange={filterProps.handleCategoryChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <LocationFilter
              value={filterProps.location}
              onChange={filterProps.handleLocationChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <DateRangeFilter
              dateRange={filterProps.dateRange}
              setDateRange={filterProps.handleDateRangeChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vibe</label>
            <VibeFilter
              value={filterProps.vibe}
              onChange={filterProps.handleVibeChange}
            />
          </div>
        </div>
      )}

      {/* Event Grid */}
      {filteredEvents?.length === 0 ? (
        <div className="text-gray-500 text-center">No events found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredEvents?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
