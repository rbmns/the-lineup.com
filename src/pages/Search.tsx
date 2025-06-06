
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { searchEvents } from '@/lib/eventService';
import EventCardList from '@/components/events/EventCardList';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { useAuth } from '@/contexts/AuthContext';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [submittedQuery, setSubmittedQuery] = useState(searchParams.get('q') || '');
  const { user } = useAuth();

  // Update search query when URL params change
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    setSubmittedQuery(query);
  }, [searchParams]);

  // Enhanced search that includes events, venues, and casual plans
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['enhanced-search', submittedQuery],
    queryFn: async () => {
      if (!submittedQuery.trim()) return { events: [], similarEvents: [] };

      try {
        // Search events with venue data
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            venues:venue_id(*),
            event_rsvps(id, user_id, status)
          `)
          .or(`title.ilike.%${submittedQuery}%,description.ilike.%${submittedQuery}%,location.ilike.%${submittedQuery}%,event_category.ilike.%${submittedQuery}%`)
          .order('start_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (eventsError) throw eventsError;

        const events = eventsData ? processEventsData(eventsData, user?.id) : [];

        // If no exact matches, get similar results
        let similarEvents: Event[] = [];
        if (events.length === 0) {
          const { data: similarData, error: similarError } = await supabase
            .from('events')
            .select(`
              *,
              creator:profiles(id, username, avatar_url, email, location, status, tagline),
              venues:venue_id(*),
              event_rsvps(id, user_id, status)
            `)
            .or(`title.ilike.%${submittedQuery.substring(0, 3)}%,event_category.ilike.%${submittedQuery.substring(0, 3)}%`)
            .order('start_date', { ascending: true })
            .limit(6);

          if (!similarError && similarData) {
            similarEvents = processEventsData(similarData, user?.id);
          }
        }

        return { events, similarEvents };
      } catch (err) {
        console.error('Search error:', err);
        return { events: [], similarEvents: [] };
      }
    },
    enabled: !!submittedQuery && submittedQuery.trim().length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSubmittedQuery('');
    setSearchParams({});
  };

  const totalResults = (searchResults?.events?.length || 0) + (searchResults?.similarEvents?.length || 0);

  return (
    <div className="w-full bg-gray-50">
      {/* Full-width Hero Search Section */}
      <div className="w-full bg-white border-b">
        <div className="w-full px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Search for events, venues, and experiences in your area
            </p>
            
            {/* Large Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <SearchIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events, venues, plans..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="pl-16 pr-32 py-6 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 shadow-lg"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Search suggestions */}
            {!submittedQuery && (
              <div className="mt-8 text-sm text-gray-500">
                <p>Try searching for "yoga", "music", "beach", or "festival"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {submittedQuery && (
        <div className="w-full px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Search Results for "{submittedQuery}"
              </h2>
              {searchResults && (
                <p className="text-gray-600 mt-1">
                  {totalResults} {totalResults === 1 ? 'result' : 'results'} found
                </p>
              )}
            </div>

            {/* Loading State */}
            {isLoading && <EventsLoadingState />}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">
                  Something went wrong while searching. Please try again.
                </p>
              </div>
            )}

            {/* Exact Results */}
            {searchResults?.events && searchResults.events.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Exact Matches</h3>
                <div className="grid gap-4">
                  {searchResults.events.map((event) => (
                    <EventCardList
                      key={event.id}
                      event={event}
                      compact={true}
                      showRsvpButtons={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Similar Results */}
            {searchResults?.similarEvents && searchResults.similarEvents.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {searchResults.events?.length > 0 ? 'Similar Events' : 'Similar Results'}
                </h3>
                <div className="grid gap-4">
                  {searchResults.similarEvents.map((event) => (
                    <EventCardList
                      key={event.id}
                      event={event}
                      compact={true}
                      showRsvpButtons={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults && totalResults === 0 && !isLoading && (
              <NoResultsFound 
                searchQuery={submittedQuery}
                resetFilters={resetFilters}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
