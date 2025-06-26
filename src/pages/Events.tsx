import React from 'react';
import { useEventsPageData } from '@/hooks/events/useEventsPageData';
import { EventsPageLayout } from '@/components/events/page-layout/EventsPageLayout';
import { EventsResultsSection } from '@/components/events/page-sections/EventsResultsSection';
import { EventsVibeSection } from '@/components/events/page-sections/EventsVibeSection';
import { useVenueAreas } from '@/hooks/useVenueAreas';
import { EventsAdvancedSection } from '@/components/events/page-sections/EventsAdvancedSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useEventRSVP } from '@/hooks/useEventRSVP';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const Events = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { updateRSVP } = useEventRSVP();

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

  const handleFilterChange = (filters: any) => {
    if (filters.eventTypes !== undefined) {
      setSelectedEventTypes(filters.eventTypes);
    }
    if (filters.venues !== undefined) {
      setSelectedVenues(filters.venues);
    }
    if (filters.vibes !== undefined) {
      setSelectedVibes(filters.vibes);
    }
    if (filters.location !== undefined) {
      setSelectedLocation(filters.location);
    }
    if (filters.date !== undefined) {
      setDateRange(filters.date);
    }
    if (filters.dateFilter !== undefined) {
      setSelectedDateFilter(filters.dateFilter);
    }
  };

  const filteredEventsCount = events?.length || 0;

  // Use the existing RSVP system
  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to RSVP to events",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log(`Handling RSVP: User ${user.id}, Event ${eventId}, Status ${status}`);
      
      const success = await updateRSVP(user.id, eventId, status);
      
      if (success) {
        // The updateRSVP function already handles cache invalidation
        toast({
          title: "RSVP updated",
          description: `You are now ${status.toLowerCase()} to this event`
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to update RSVP. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error RSVPing to event:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-[#F9F3E9] to-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005F73] mb-4 leading-tight">
            Discover <span className="text-[#2A9D8F]">Events</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#4A4A48] max-w-3xl mx-auto leading-relaxed">
            Discover what's happening nearby — from beach parties to chill yoga sessions.
          </p>
        </div>
      </div>

      <EventsPageLayout>
        <div className="space-y-4 sm:space-y-6">
          {/* Vibe Filter */}
          <div className="w-full">
            <EventsVibeSection 
              selectedVibes={selectedVibes} 
              onVibeChange={setSelectedVibes} 
              events={allEvents || []} 
              vibesLoading={isLoading} 
            />
          </div>

          {/* Advanced Filters Section */}
          <div className="w-full">
            <EventsAdvancedSection 
              onFilterChange={handleFilterChange} 
              selectedEventTypes={selectedEventTypes} 
              selectedVenues={selectedVenues} 
              selectedVibes={selectedVibes} 
              selectedLocation={selectedLocation} 
              dateRange={dateRange} 
              selectedDateFilter={selectedDateFilter} 
              filteredEventsCount={filteredEventsCount} 
              allEventTypes={allEventTypes} 
              availableVenues={availableVenues} 
              events={allEvents || []} 
              venueAreas={venueAreas} 
              isLocationLoaded={isLocationLoaded} 
              areasLoading={areasLoading} 
            />
          </div>

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
              loadingEventId={undefined}
            />
          </div>
        </div>
      </EventsPageLayout>
    </div>
  );
};

export default Events;
