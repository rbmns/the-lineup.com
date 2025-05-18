
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { EventsList } from '@/components/events/list-components/EventsList';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { setCanonicalLink } from '@/utils/canonicalUtils';
import { useRsvpActions } from '@/hooks/useRsvpActions';

const VenueEvents = () => {
  const { venueSlug } = useParams<{ venueSlug: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [venue, setVenue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleRsvp: rsvpToEvent } = useRsvpActions();
  
  useEffect(() => {
    const fetchVenueAndEvents = async () => {
      setIsLoading(true);
      try {
        if (!venueSlug) return;
        
        // First, fetch the venue by slug
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('*')
          .eq('slug', venueSlug)
          .single();
        
        if (venueError || !venueData) {
          console.error('Venue not found:', venueError);
          // Redirect to events page if venue not found
          navigate('/events');
          return;
        }
        
        setVenue(venueData);
        
        // Then fetch events for this venue
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            venues:venue_id (*),
            creator:profiles (*),
            event_rsvps (*)
          `)
          .eq('venue_id', venueData.id)
          .order('start_time', { ascending: true });
        
        if (eventsError) {
          console.error('Error fetching venue events:', eventsError);
          return;
        }
        
        if (eventsData) {
          const processedEvents = processEventsData(eventsData, user?.id);
          setEvents(processedEvents);
        }
        
        // Set the canonical link
        setCanonicalLink(`${window.location.origin}/venues/${venueSlug}`);
        
        // Set page title
        document.title = venueData.name ? `Events at ${venueData.name}` : 'Venue Events';
        
      } catch (err) {
        console.error('Error in venue events page:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVenueAndEvents();
  }, [venueSlug, user?.id, navigate]);
  
  const handleLocalRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<void> => {
    if (rsvpToEvent) {
      const success = await rsvpToEvent(eventId, status);
      
      if (success) {
        // Update the local events state to reflect the new RSVP status
        const updatedEvents = events.map(event => {
          if (event.id === eventId) {
            // If the status is the same as current, remove it (toggle behavior)
            const newStatus = event.rsvp_status === status ? undefined : status;
            return {
              ...event,
              rsvp_status: newStatus
            };
          }
          return event;
        });
        
        setEvents(updatedEvents);
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/events')} 
          className="mb-2"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to all events
        </Button>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {venue?.name ? `Events at ${venue.name}` : 'Venue Events'}
        </h1>
        
        {venue?.address && (
          <p className="text-gray-600 mb-4">{venue.address}</p>
        )}
        
        {venue?.city && (
          <div className="flex items-center mb-6">
            <span className="text-gray-600">
              {venue.city}
              {venue.website && (
                <span className="mx-2">•</span>
              )}
            </span>
            
            {venue.website && (
              <a 
                href={venue.website}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit website
              </a>
            )}
          </div>
        )}
      </div>
      
      <EventsList
        isLoading={isLoading}
        isSearching={false}
        displayEvents={events}
        searchQuery=""
        noResultsFound={!isLoading && events.length === 0}
        similarEvents={[]}
        resetFilters={() => {}}
        handleRsvpAction={handleLocalRsvp}
        isAuthenticated={!!user}
      />
    </div>
  );
};

export default VenueEvents;
