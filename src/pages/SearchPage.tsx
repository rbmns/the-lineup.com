
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

  // Filter search results and add better debugging
  const filteredSearchResults = searchResults
    .filter(result => {
      const isValidType = result.type === 'event' || result.type === 'casual_plan';
      console.log('SearchPage: Filtering result:', result.id, 'type:', result.type, 'isValidType:', isValidType);
      return isValidType;
    })
    .map(result => {
      if (result.type === 'event') {
        // Filter out past events
        const upcomingEvents = filterUpcomingEvents([result as unknown as Event]);
        const isUpcoming = upcomingEvents.length > 0;
        console.log('SearchPage: Event', result.id, 'isUpcoming:', isUpcoming, 'title:', result.title);
        return isUpcoming ? result : null;
      }
      return result;
    }).filter(Boolean);

  console.log('SearchPage: Final filtered results count:', filteredSearchResults.length);
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
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {filteredSearchResults.map((result) => {
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
      ) : (
        !isSearching && query && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900">No results found</h2>
            <p className="text-gray-600 mt-2">
              {searchResults.length > 0 
                ? "No upcoming events found. Try searching for events happening later."
                : "Try a different search term or check your spelling."
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Found {searchResults.length} total results, {filteredSearchResults.length} upcoming
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
