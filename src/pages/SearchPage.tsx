
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Event } from '@/types';
import { CasualPlan } from '@/types/casual-plans';
import { Skeleton } from '@/components/ui/skeleton';
import { navigateToEvent } from '@/utils/navigationUtils';
import { EventCard } from '@/components/EventCard';
import { CasualPlanCard } from '@/components/casual-plans/CasualPlanCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlansMutations } from '@/hooks/casual-plans/useCasualPlansMutations';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { filterUpcomingEvents } from '@/utils/date-filtering';

const VenueResultCard = ({ result, navigate }: { result: any; navigate: ReturnType<typeof useNavigate> }) => (
    <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow h-full"
        onClick={() => navigate(`/venues/${result.slug || result.id}`)}
    >
        <CardHeader>
            <CardTitle className="line-clamp-2">{result.title}</CardTitle>
            {result.location && <CardDescription>{result.location}</CardDescription>}
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground flex items-center"><MapPin className="h-4 w-4 mr-2" />Venue</p>
        </CardContent>
    </Card>
);

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchResults, isSearching, performSearch, setSearchResults } = useSearch();
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { 
    rsvpToPlan,
    loadingPlanId,
  } = useCasualPlansMutations();
  const query = searchParams.get('q') || '';

  // Scroll to top on page load
  useScrollToTop();

  useEffect(() => {
    if (query) {
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

  const handleRsvp = async (planId: string, status: 'Going' | 'Interested') => {
    const success = await rsvpToPlan(planId, status);
    return success;
  };

  // Filter search results to only show upcoming events
  const filteredSearchResults = searchResults.map(result => {
    if (result.type === 'event') {
      // Filter out past events
      const upcomingEvents = filterUpcomingEvents([result as unknown as Event]);
      return upcomingEvents.length > 0 ? result : null;
    }
    return result;
  }).filter(Boolean);

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
              return <EventCard key={result.id} event={result as unknown as Event} onClick={(event) => navigateToEvent(event.id, navigate)} />;
            }
            if (result.type === 'casual_plan') {
              const plan = result as unknown as CasualPlan;
              return (
                <CasualPlanCard 
                  key={plan.id} 
                  plan={plan}
                  onRsvp={isAuthenticated ? handleRsvp : undefined}
                  showRsvpButtons={isAuthenticated}
                  isLoading={loadingPlanId === plan.id}
                />
              );
            }
            if (result.type === 'venue') {
              return <VenueResultCard key={result.id} result={result} navigate={navigate} />;
            }
            return null;
          })}
        </div>
      ) : (
        !isSearching && query && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900">No results found</h2>
            <p className="text-gray-600 mt-2">Try a different search term.</p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
