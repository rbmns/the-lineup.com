
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useFetchRelatedEvents } from '@/hooks/events/useFetchRelatedEvents';
import { EventDetailSkeleton } from '@/components/events/EventDetailSkeleton';
import { EventDetailContent } from '@/components/events/EventDetailContent';
import { toast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [attendees, setAttendees] = useState<{ going: any[]; interested: any[] }>({ going: [], interested: [] });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        console.error('No event ID provided');
        navigate('/events');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching event with ID:', id);
        
        // First, fetch the basic event data without the problematic join
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            venues:venue_id(*),
            event_rsvps(id, user_id, status)
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching event:', error);
          toast({
            title: "Error",
            description: "Could not load event details",
            variant: "destructive",
          });
          navigate('/events');
          return;
        }

        if (data) {
          // Process creator data
          const creatorData = data.creator && Array.isArray(data.creator) && data.creator.length > 0 
            ? data.creator[0] : null;

          // Process venue data
          const venueData = data.venues && typeof data.venues === 'object' && !Array.isArray(data.venues)
            ? data.venues : null;

          // Format event data
          const formattedEvent: Event = {
            id: data.id,
            title: data.title,
            description: data.description,
            event_category: data.event_category,
            start_time: data.start_time,
            end_time: data.end_time,
            start_date: data.start_date,
            end_date: data.end_date,
            created_at: data.created_at,
            updated_at: data.updated_at,
            image_urls: data.image_urls || [],
            venue_id: data.venue_id,
            fee: data.fee,
            tags: data.tags || [],
            vibe: data.vibe,
            booking_link: data.booking_link,
            organizer_link: data.organizer_link,
            organiser_name: data.organiser_name,
            destination: data.destination,
            slug: data.slug,
            location: data.location,
            coordinates: data.coordinates,
            creator: creatorData ? {
              id: creatorData.id,
              username: creatorData.username,
              avatar_url: creatorData.avatar_url,
              email: creatorData.email,
              location: creatorData.location,
              status: creatorData.status,
              tagline: creatorData.tagline,
              created_at: undefined,
              updated_at: undefined,
              location_category: null,
              onboarded: null,
              onboarding_data: null,
              role: null,
              status_details: null
            } : null,
            venues: venueData ? {
              id: venueData.id || '',
              name: venueData.name || '',
              street: venueData.street || '',
              postal_code: venueData.postal_code || '',
              city: venueData.city || '',
              website: venueData.website,
              google_maps: venueData.google_maps,
              slug: venueData.slug
            } : null,
            extra_info: data['Extra info'],
            google_maps: venueData?.google_maps || null,
            attendees: { going: 0, interested: 0 } // This will be calculated below
          };

          // Set RSVP status for authenticated user
          if (user && data.event_rsvps) {
            const userRsvp = data.event_rsvps.find((rsvp: any) => rsvp.user_id === user.id);
            formattedEvent.rsvp_status = userRsvp?.status as 'Going' | 'Interested' | undefined;
          }

          // Process attendees
          const going = data.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going') || [];
          const interested = data.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested') || [];

          formattedEvent.attendees = {
            going: going.length,
            interested: interested.length
          };

          setEvent(formattedEvent);
          setAttendees({ going, interested });
          
          console.log('Event loaded successfully:', formattedEvent);
        }
      } catch (error) {
        console.error('Error in event fetch:', error);
        toast({
          title: "Error",
          description: "Could not load event details",
          variant: "destructive",
        });
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, navigate]);

  // Fetch related events
  const { relatedEvents, loading: relatedLoading } = useFetchRelatedEvents({
    eventCategory: event?.event_category || '',
    currentEventId: event?.id || '',
    userId: user?.id,
    tags: event?.tags,
    vibe: event?.vibe,
    minResults: 3,
    startDate: event?.start_date
  });

  // Handle RSVP
  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!user || !event) {
      toast({
        title: "Authentication Required",
        description: "Please log in to RSVP to events",
        variant: "destructive",
      });
      return false;
    }

    try {
      setRsvpLoading(true);

      // Check if user already has an RSVP
      const { data: existingRsvp } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .single();

      if (existingRsvp) {
        if (existingRsvp.status === status) {
          // Remove RSVP if clicking the same status
          const { error } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);

          if (error) throw error;

          setEvent(prev => prev ? { ...prev, rsvp_status: undefined } : null);
          toast({
            title: "RSVP Removed",
            description: `You are no longer marked as ${status.toLowerCase()} for this event`,
          });
        } else {
          // Update existing RSVP
          const { error } = await supabase
            .from('event_rsvps')
            .update({ status })
            .eq('id', existingRsvp.id);

          if (error) throw error;

          setEvent(prev => prev ? { ...prev, rsvp_status: status } : null);
          toast({
            title: "RSVP Updated",
            description: `You are now marked as ${status.toLowerCase()} for this event`,
          });
        }
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert({
            event_id: event.id,
            user_id: user.id,
            status
          });

        if (error) throw error;

        setEvent(prev => prev ? { ...prev, rsvp_status: status } : null);
        toast({
          title: "RSVP Confirmed",
          description: `You are now marked as ${status.toLowerCase()} for this event`,
        });
      }

      return true;
    } catch (error) {
      console.error('Error handling RSVP:', error);
      toast({
        title: "Error",
        description: "Could not update RSVP. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/events')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{event.title} | Event Details</title>
        <meta name="description" content={event.description?.substring(0, 160) || `Join us for ${event.title}`} />
      </Helmet>
      
      <EventDetailContent
        event={event}
        attendees={attendees}
        relatedEvents={relatedEvents}
        relatedLoading={relatedLoading}
        isAuthenticated={!!user}
        rsvpLoading={rsvpLoading}
        onRsvp={handleRsvp}
      />
    </div>
  );
};

export default EventDetail;
