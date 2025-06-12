import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import { EventCard } from '@/components/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Explore = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedEvents: Event[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          location: item.location,
          start_time: item.start_time,
          end_time: item.end_time,
          created_at: item.created_at,
          updated_at: item.updated_at,
          event_category: item.event_category,
          image_urls: item.image_urls,
          venues: item.venues,
          google_maps: item.google_maps,
          rsvp_status: undefined,
          area: null,
          coordinates: item.coordinates,
          attendees: {
            going: item.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going').length || 0,
            interested: item.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested').length || 0
          }
        }));

        setEvents(formattedEvents);
        setFilteredEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description?.toLowerCase().includes(query.toLowerCase()) ||
      event.venues?.name?.toLowerCase().includes(query.toLowerCase()) ||
      event.event_category?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredEvents(filtered);
  };

  const handleEventClick = (event: Event) => {
    if (event.slug) {
      navigate(`/events/${event.id}/${event.slug}`);
    } else {
      navigate(`/events/${event.id}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Events</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {searchQuery && (
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        )}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchQuery 
              ? "Try adjusting your search terms or clearing the search to see all events."
              : "There are no events available at the moment."
            }
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => handleSearch('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={handleEventClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
