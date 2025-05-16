import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import { LazyEventsList } from '@/components/events/LazyEventsList';
import EventsHeader from '@/components/events/list-components/EventsHeader';
import EventsFilters from '@/components/events/list-components/EventsFilters';
import { EventsEmptyState } from '@/components/events/EventsEmptyState';
import EventsSignUpTeaser from '@/components/events/list-components/EventsSignUpTeaser';
import { useEventRSVP } from '@/hooks/useEventRSVP'; // Updated import with correct casing
import { useEvents } from '@/hooks/useEvents';
import { useCategories } from '@/hooks/useCategories';
import { useFilters } from '@/hooks/useFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import { filterEvents } from '@/utils/event-filters';
import EventsSidebar from '@/components/events/EventsSidebar';
import EventsPageSkeleton from '@/components/events/EventsPageSkeleton';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EventsPageRefactored: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Get events data
  const { 
    data: events = [], 
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refreshEvents
  } = useEvents();
  
  // For sidebar content
  const featuredEvents = useMemo(() => 
    events
      .filter(event => event.is_featured)
      .slice(0, 4),
    [events]
  );
  
  const popularEvents = useMemo(() => 
    events
      .sort((a, b) => (b.attendees_count || 0) - (a.attendees_count || 0))
      .slice(0, 4),
    [events]
  );
  
  // Get categories for filters
  const { categories, isLoading: categoriesLoading } = useCategories();
  
  // RSVP functionality
  const { handleRsvp, loadingEventId } = useEventRSVP({
    onSuccess: () => {
      refreshEvents();
    }
  });
  
  // Filter state management
  const {
    activeFilters,
    setActiveFilters,
    hasActiveFilters,
    handleFilterChange,
    handleClearFilters,
    handleSearchChange,
    searchQuery
  } = useFilters();
  
  // Apply filters to events
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return filterEvents(events, activeFilters, searchQuery);
  }, [events, activeFilters, searchQuery]);
  
  // Determine if we should show the signup teaser
  const showSignUpTeaser = !isAuthenticated && !eventsLoading && filteredEvents.length > 0;
  
  // Determine where to show the teaser
  const renderTeaserAfterRow = showSignUpTeaser ? 1 : false;
  
  // Loading state
  const isLoading = eventsLoading || categoriesLoading;
  
  // Handle create event button click
  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an event",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    navigate('/events/create');
  };
  
  // Handle RSVP with authentication check
  const onRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to RSVP to events",
        variant: "destructive"
      });
      navigate('/login');
      return false;
    }
    
    return handleRsvp(eventId, status);
  };
  
  // Render the events list or appropriate empty state
  const renderContent = () => {
    if (isLoading) {
      return <EventsPageSkeleton />;
    }
    
    if (eventsError) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">Error loading events</h2>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      );
    }
    
    if (!events || events.length === 0) {
      return <EventsEmptyState />;
    }
    
    if (filteredEvents.length === 0 && hasActiveFilters) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">No events match your filters</h2>
          <p className="text-gray-600 mt-2">Try adjusting your filters or search terms</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      );
    }
    
    return (
      <LazyEventsList
        events={filteredEvents}
        isLoading={isLoading}
        onRsvp={onRsvp}
        showRsvpButtons={!!user}
        loadingEventId={loadingEventId}
        renderTeaserAfterRow={renderTeaserAfterRow}
        showTeaser={showSignUpTeaser}
        teaser={<EventsSignUpTeaser />}
        searchQuery={searchQuery}
      />
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <EventsHeader />
        
        <Button 
          onClick={handleCreateEvent}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <EventsFilters
            categories={categories || []}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onSearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
          
          <div className="mt-6">
            {renderContent()}
          </div>
        </div>
        
        {!isMobile && (
          <div className="w-full md:w-1/4">
            <EventsSidebar 
              popularEvents={popularEvents || []}
              featuredEvents={featuredEvents || []}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPageRefactored;
