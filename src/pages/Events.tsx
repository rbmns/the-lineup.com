
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { EventCard } from '@/components/events/EventCard';
import { AppPageHeader } from '@/components/ui/AppPageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventsFilters } from '@/hooks/useEventsFilters';
import { CategoryFilter } from '@/components/events/filters/CategoryFilter';
import { LocationFilter } from '@/components/events/filters/LocationFilter';
import { DateRangeFilter } from '@/components/events/filters/DateRangeFilter';
import { VibeFilter } from '@/components/events/filters/VibeFilter';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Events() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
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
    initialLocation: 'all',
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
        <div className="text-red-500">Error: {error?.message}</div>
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

      {/* Search and Filter Controls */}
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

        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleFilter}>
            <Filter className="h-4 w-4 mr-2" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>

          <Button variant="outline" onClick={toggleAdvancedFilters}>
            {showAdvancedFilters ? 'Hide Advanced' : 'Advanced Filters'}
          </Button>
        </div>

        <Link to="/events/create-simple">
          <Button className="bg-midnight text-ivory hover:bg-overcast flex items-center gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Basic Filters */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Any Price</option>
                <option value="free">Free</option>
                <option value="0-25">$0 - $25</option>
                <option value="25-50">$25 - $50</option>
                <option value="50+">$50+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Size</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Any Size</option>
                <option value="small">Small (< 20 people)</option>
                <option value="medium">Medium (20-100 people)</option>
                <option value="large">Large (100+ people)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time of Day</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Any Time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Event Grid */}
      {filteredEvents?.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          {searchQuery ? 'No events found matching your search.' : 'No events found.'}
        </div>
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
