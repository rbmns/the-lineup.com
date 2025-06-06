
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { Search as SearchIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface Venue {
  id: string;
  name: string;
  city: string;
  street?: string;
  postal_code?: string;
}

interface CasualPlan {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  vibe: string;
}

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [casualPlans, setCasualPlans] = useState<CasualPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query) {
      searchData(query);
    }
  }, [query]);

  const searchData = async (searchQuery: string) => {
    setIsLoading(true);
    
    try {
      // Search events
      const { data: eventsData } = await supabase
        .from('events')
        .select(`
          *,
          venues(*),
          creator:profiles(id, username, avatar_url, email, location, status, tagline),
          event_rsvps(id, user_id, status)
        `)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,event_category.ilike.%${searchQuery}%`);

      // Search venues
      const { data: venuesData } = await supabase
        .from('venues')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`);

      // Search casual plans
      const { data: casualPlansData } = await supabase
        .from('casual_plans')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);

      // Transform events data to match Event type
      const transformedEvents: Event[] = (eventsData || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        location: event.location,
        event_category: event.event_category,
        start_time: event.start_time,
        end_time: event.end_time,
        start_date: event.start_date,
        end_date: event.end_date,
        created_at: event.created_at,
        updated_at: event.updated_at,
        image_urls: event.image_urls || [],
        attendees: {
          going: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going').length || 0,
          interested: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested').length || 0,
        },
        rsvp_status: undefined,
        area: null,
        google_maps: event.venues?.google_maps || null,
        organizer_link: event.organizer_link || null,
        creator: event.creator && Array.isArray(event.creator) && event.creator.length > 0 ? event.creator[0] : null,
        venues: event.venues,
        extra_info: event["Extra info"] || null,
        fee: event.fee,
        venue_id: event.venue_id,
        tags: event.tags ? (Array.isArray(event.tags) ? event.tags : event.tags.split(',').map((tag: string) => tag.trim())) : []
      }));

      setEvents(transformedEvents);
      setVenues(venuesData || []);
      setCasualPlans(casualPlansData || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalResults = events.length + venues.length + casualPlans.length;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Search Results - {query} | the lineup</title>
        <meta name="description" content={`Search results for "${query}" - Find events, venues, and casual plans`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SearchIcon className="h-6 w-6 text-gray-500" />
            <h1 className="text-3xl font-bold">Search Results</h1>
          </div>
          
          {query && (
            <p className="text-lg text-gray-600">
              {isLoading ? 'Searching...' : `${totalResults} results for "${query}"`}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Events Section */}
            {events.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Events ({events.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showRsvpButtons={false}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Venues Section */}
            {venues.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Venues ({venues.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {venues.map((venue) => (
                    <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{venue.name}</h3>
                        <p className="text-gray-600">{venue.city}</p>
                        {venue.street && (
                          <p className="text-sm text-gray-500 mt-1">{venue.street}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Casual Plans Section */}
            {casualPlans.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Casual Plans ({casualPlans.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {casualPlans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
                      <div className="h-48 bg-gradient-to-br from-green-400 to-green-600"></div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{plan.title}</h3>
                        <p className="text-gray-600">{plan.location}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {plan.date} at {plan.time}
                        </p>
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                          {plan.vibe}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {!isLoading && totalResults === 0 && query && (
              <div className="text-center py-12">
                <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse our events, venues, and plans.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
