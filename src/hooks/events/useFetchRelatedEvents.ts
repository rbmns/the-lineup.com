import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface UseFetchRelatedEventsProps {
  eventCategory: string; // Changed from eventType to eventCategory
  currentEventId: string;
  userId?: string;
  tags?: string[];
  vibe?: string;
  minResults?: number;
  startDate?: string;
}

interface RelatedEventsResult {
  relatedEvents: Event[];
  loading: boolean;
}

export const useFetchRelatedEvents = ({ 
  eventCategory, 
  currentEventId,
  userId,
  tags,
  vibe,
  minResults = 2,
  startDate
}: UseFetchRelatedEventsProps): RelatedEventsResult => {
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);
  const dataFetchedRef = useRef(false);
  
  useEffect(() => {
    const loadRelatedEvents = async () => {
      if (loadingRef.current) return;
      if (dataFetchedRef.current && relatedEvents.length >= minResults) return;
      
      try {
        loadingRef.current = true;
        setLoading(true);
        
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status),
            venues:venue_id(*)
          `)
          .eq('event_category', eventCategory) // Changed from event_type to event_category
          .neq('id', currentEventId)
          .gte('start_date', today)
          .order('start_time', { ascending: true })
          .limit(8);
        
        if (error) {
          console.error('Error fetching related events:', error);
          setRelatedEvents([]);
        } else if (data) {
          // Transform the data to match Event interface with proper typing
          const processedEvents = data.map((event: any): Event => {
            // Handle creator data
            const creatorData = event.creator && Array.isArray(event.creator) && event.creator.length > 0 
              ? event.creator[0] : null;
            
            // Handle venue data
            const venueData = event.venues && typeof event.venues === 'object' && !Array.isArray(event.venues)
              ? event.venues : null;

            return {
              id: event.id,
              title: event.title || '',
              description: event.description || '',
              event_category: event.event_category || eventCategory, // Use event_category from DB
              start_time: event.start_time,
              end_time: event.end_time,
              start_date: event.start_date,
              end_date: event.end_date,
              created_at: event.created_at,
              updated_at: event.updated_at,
              image_urls: event.image_urls || [],
              status: event.status,
              attendees: { going: 0, interested: 0 },
              venue_id: event.venue_id,
              fee: event.fee,
              tags: event.tags ? (Array.isArray(event.tags) ? event.tags : [event.tags]) : [],
              vibe: event.vibe,
              booking_link: event.booking_link,
              organizer_link: event.organizer_link,
              organiser_name: event.organiser_name,
              destination: event.destination,
              slug: event.slug,
              creator: creatorData ? {
                id: creatorData.id,
                username: creatorData.username,
                avatar_url: creatorData.avatar_url,
                email: creatorData.email,
                location: creatorData.location,
                status: creatorData.status,
                tagline: null,
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
              extra_info: event['Extra info'],
              google_maps: venueData?.google_maps || null
            };
          });
          
          setRelatedEvents(processedEvents);
        }
        
        dataFetchedRef.current = true;
      } catch (error) {
        console.error('Error in related events hook:', error);
        setRelatedEvents([]);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    };
    
    if (currentEventId) {
      loadRelatedEvents();
    } else {
      setLoading(false);
    }
  }, [eventCategory, currentEventId, userId, minResults, tags, vibe, startDate]); 
  
  return { relatedEvents, loading };
};
