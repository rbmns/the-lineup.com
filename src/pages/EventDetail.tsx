
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useFetchRelatedEvents } from '@/hooks/events/useFetchRelatedEvents';
import { EventDetailSkeleton } from '@/components/events/EventDetailSkeleton';
import { toast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Share, Calendar, MapPin, User, Euro, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryPill } from '@/components/ui/category-pill';
import { formatInTimeZone } from 'date-fns-tz';
import { AMSTERDAM_TIMEZONE } from '@/utils/date-formatting';
import { useEventImages } from '@/hooks/useEventImages';
import TeaseLoginSignup from '@/components/events/detail-sections/TeaseLoginSignup';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [attendees, setAttendees] = useState<{ going: any[]; interested: any[] }>({ going: [], interested: [] });

  // Get event images using the hook
  const { getEventImageUrl } = useEventImages();

  // Scroll to top when navigating to this page (but not during RSVP operations)
  useEffect(() => {
    // Check if this is a fresh navigation (not from RSVP)
    const state = location.state as any;
    const isFromRsvp = state?.fromRsvp || state?.preserveScroll;
    
    if (!isFromRsvp) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.state]);

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
            attendees: { going: 0, interested: 0 }
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

  // Handle RSVP with scroll preservation
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
      
      // Save current scroll position
      const currentScrollY = window.scrollY;

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

      // Restore scroll position after RSVP
      setTimeout(() => {
        window.scrollTo({ top: currentScrollY, behavior: 'auto' });
      }, 100);

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

  // Format date and time
  const formatDateTime = () => {
    if (!event?.start_date || !event?.start_time) return null;
    try {
      const dateTime = `${event.start_date}T${event.start_time}`;
      const date = new Date(dateTime);
      const formattedDate = formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEEE, MMMM d, yyyy");
      const formattedTime = formatInTimeZone(date, AMSTERDAM_TIMEZONE, "HH:mm");
      
      if (event.end_time) {
        const endDateTime = `${event.start_date}T${event.end_time}`;
        const endDate = new Date(endDateTime);
        const formattedEndTime = formatInTimeZone(endDate, AMSTERDAM_TIMEZONE, "HH:mm");
        return `${formattedDate}, ${formattedTime}-${formattedEndTime}`;
      }
      
      return `${formattedDate}, ${formattedTime}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date and time not available';
    }
  };

  // Get event image using the proper hook
  const getEventImage = () => {
    if (!event) return '/img/default.jpg';
    return getEventImageUrl(event) || '/img/default.jpg';
  };

  if (loading) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/events')}>
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{event.title} | Event Details</title>
        <meta name="description" content={event.description?.substring(0, 160) || `Join us for ${event.title}`} />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={getEventImage()}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              console.log('Event image failed to load, using default');
              target.src = '/img/default.jpg';
            }
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/events')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        
        {/* Category Badge */}
        {event.event_category && (
          <div className="absolute top-16 left-4">
            <CategoryPill category={event.event_category} size="sm" />
          </div>
        )}
        
        {/* Event Title and Date */}
        <div className="absolute bottom-6 left-4 right-4 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
          <div className="flex items-center text-lg">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{formatDateTime()}</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* RSVP Buttons */}
        {user ? (
          <div className="flex gap-3 mb-8">
            <Button
              variant={event.rsvp_status === 'Going' ? 'default' : 'outline'}
              onClick={() => handleRsvp('Going')}
              disabled={rsvpLoading}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              I'm Going
            </Button>
            <Button
              variant={event.rsvp_status === 'Interested' ? 'default' : 'outline'}
              onClick={() => handleRsvp('Interested')}
              disabled={rsvpLoading}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              I'm Interested
            </Button>
          </div>
        ) : (
          <div className="mb-8">
            <TeaseLoginSignup />
          </div>
        )}
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">About this event</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description || 'No description provided for this event.'}
                </p>
              </div>
            </div>
            
            {/* Organizer Info */}
            {event.organiser_name && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Hosted by</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{event.organiser_name}</p>
                    <p className="text-sm text-gray-600">Event Organizer</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </h3>
              <div>
                <p className="font-medium">{event.venues?.name || 'Venue name'}</p>
                <p className="text-sm text-gray-600">{event.venues?.city || 'Location'}</p>
                {event.venues?.google_maps && (
                  <Button variant="link" className="p-0 h-auto text-sm mt-1">
                    View on map
                  </Button>
                )}
              </div>
            </div>
            
            {/* Booking Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Booking Info</h3>
              <div className="space-y-3">
                {event.fee && (
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium">Entry fee</p>
                      <p className="text-sm text-gray-600">€{event.fee}</p>
                    </div>
                  </div>
                )}
                
                {event.organizer_link && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium">Organizer website</p>
                      <a 
                        href={event.organizer_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {event.organiser_name || 'Visit website'}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Attendees */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Friends Attending
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Going: {attendees.going.length}</p>
                  <p className="text-sm text-gray-600">Interested: {attendees.interested.length}</p>
                </div>
              </div>
              {attendees.going.length + attendees.interested.length > 0 && (
                <Button variant="link" className="p-0 h-auto text-sm mt-2">
                  See all attendees
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
