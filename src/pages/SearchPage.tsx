
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Event } from '@/types';
import { CasualPlan } from '@/types/casual-plans';
import { Skeleton } from '@/components/ui/skeleton';
import { EventCard } from '@/components/EventCard';
import { CasualPlanCard } from '@/components/casual-plans/CasualPlanCard';
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlansMutations } from '@/hooks/casual-plans/useCasualPlansMutations';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { filterUpcomingEvents } from '@/utils/date-filtering';
import { isAfter, subDays } from 'date-fns';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchResults, isSearching, performSearch, setSearchResults, trackClick } = useSearch();
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { 
    joinPlan, 
    leavePlan, 
    rsvpToPlan,
    loadingPlanId,
  } = useCasualPlansMutations();
  const query = searchParams.get('q') || '';

  // Scroll to top on page load
  useScrollToTop();

  useEffect(() => {
    if (query) {
      console.log('SearchPage: Performing search for query:', query);
      performSearch(query);
    } else {
        setSearchResults([]);
    }
  }, [query, performSearch, setSearchResults]);

  // Cleanup search results on unmount
  useEffect(() => {
    return () => {
      setSearchResults([]);
    };
  }, [setSearchResults]);

  const handleLoginPrompt = () => {
    navigate('/login');
  };

  // Handle event card click with proper navigation and tracking
  const handleEventClick = async (event: Event) => {
    try {
      console.log('Search page - handling event click for event:', event.id);
      
      // Track the click
      if (query) {
        await trackClick(query, event.id, 'event');
      }
      
      // Navigate to event detail page using slug if available, otherwise ID
      let eventPath;
      if (event.slug) {
        eventPath = `/events/${event.slug}`;
      } else {
        eventPath = `/events/${event.id}`;
      }
      
      console.log('Navigating to:', eventPath);
      navigate(eventPath);
    } catch (error) {
      console.error('Error handling event click:', error);
      // Still navigate even if tracking fails - use fallback
      navigate(`/events/${event.id}`);
    }
  };

  // Filter search results to include recent past events (within last 30 days) and all upcoming events
  const filterRelevantEvents = (events: Event[]): Event[] => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    
    return events.filter(event => {
      if (!event.start_date) return true; // Keep events without start_date
      
      const eventDate = new Date(event.start_date);
      // Include events that are upcoming OR within the last 30 days
      return isAfter(eventDate, thirtyDaysAgo);
    });
  };

  // Filter search results and add better debugging
  const filteredSearchResults = searchResults
    .filter(result => {
      const isValidType = result.type === 'event' || result.type === 'casual_plan';
      console.log('SearchPage: Filtering result:', result.id, 'type:', result.type, 'isValidType:', isValidType);
      return isValidType;
    })
    .map(result => {
      if (result.type === 'event') {
        // For search results, show recent past events too (within last 30 days)
        const relevantEvents = filterRelevantEvents([result as unknown as Event]);
        const isRelevant = relevantEvents.length > 0;
        console.log('SearchPage: Event', result.id, 'isRelevant:', isRelevant, 'title:', result.title);
        return isRelevant ? result : null;
      }
      return result;
    }).filter(Boolean);

  // Separate upcoming and past events for display
  const upcomingEvents = filteredSearchResults.filter(result => {
    if (result.type === 'event') {
      const upcomingEventsList = filterUpcomingEvents([result as unknown as Event]);
      return upcomingEventsList.length > 0;
    }
    return true; // Include casual plans
  });

  const pastEvents = filteredSearchResults.filter(result => {
    if (result.type === 'event') {
      const upcomingEventsList = filterUpcomingEvents([result as unknown as Event]);
      return upcomingEventsList.length === 0; // This is a past event
    }
    return false; // Don't include casual plans in past events
  });

  console.log('SearchPage: Final filtered results count:', filteredSearchResults.length);
  console.log('SearchPage: Upcoming events count:', upcomingEvents.length);
  console.log('SearchPage: Past events count:', pastEvents.length);
  console.log('SearchPage: Raw search results count:', searchResults.length);

  return (
    <div className={`${isMobile ? 'px-3 py-4' : 'container mx-auto px-4 py-8'} min-h-screen`}>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold tracking-tight text-gray-900`}>
          Search results for: <span className="text-gray-700">{query}</span>
        </h1>
      </div>

      {isSearching ? (
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : filteredSearchResults.length > 0 ? (
        <div className="space-y-8">
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Events ({upcomingEvents.length})
              </h2>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {upcomingEvents.map((result) => {
                  if (result.type === 'event') {
                    const event = result as unknown as Event;
                    return (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onClick={handleEventClick}
                        showRsvpButtons={false}
                      />
                    );
                  }
                  if (result.type === 'casual_plan') {
                    const plan = result as unknown as CasualPlan;
                    return (
                      <CasualPlanCard 
                        key={plan.id} 
                        plan={plan}
                        onJoin={joinPlan}
                        onLeave={leavePlan}
                        onRsvp={rsvpToPlan}
                        isJoining={loadingPlanId === plan.id}
                        isLeaving={loadingPlanId === plan.id}
                        isAuthenticated={isAuthenticated}
                        onLoginPrompt={handleLoginPrompt}
                        loadingPlanId={loadingPlanId}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          {/* Recent Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-600 mb-4">
                Recent Past Events ({pastEvents.length})
              </h2>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {pastEvents.map((result) => {
                  if (result.type === 'event') {
                    const event = result as unknown as Event;
                    return (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onClick={handleEventClick}
                        showRsvpButtons={false}
                        className="opacity-75" // Slightly dimmed to indicate past event
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        !isSearching && query && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900">No results found</h2>
            <p className="text-gray-600 mt-2">
              Try a different search term or check your spelling.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Found {searchResults.length} total results, but none match your criteria
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
