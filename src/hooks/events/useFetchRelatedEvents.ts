
import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface UseFetchRelatedEventsProps {
  eventType: string;
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
  eventType, 
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
          .eq('event_type', eventType)
          .neq('id', currentEventId)
          .gte('start_date', today)
          .order('start_time', { ascending: true })
          .limit(8);
        
        if (error) {
          console.error('Error fetching related events:', error);
          setRelatedEvents([]);
        } else if (data) {
          // Transform the data to match Event interface
          const processedEvents: Event[] = data.map(event => ({
            id: event.id,
            title: event.title || '',
            description: event.description || '',
            event_type: event.event_type || eventType, // Ensure event_type is always present
            start_time: event.start_time,
            end_time: event.end_time,
            start_date: event.start_date,
            end_date: event.end_date,
            created_at: event.created_at,
            updated_at: event.updated_at,
            image_urls: event.image_urls || [],
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
            creator: event.creator && Array.isArray(event.creator) && event.creator.length > 0 
              ? {
                  id: event.creator[0].id,
                  username: event.creator[0].username,
                  avatar_url: event.creator[0].avatar_url,
                  email: event.creator[0].email,
                  location: event.creator[0].location,
                  status: event.creator[0].status,
                  tagline: null,
                  created_at: undefined,
                  updated_at: undefined,
                  location_category: null,
                  onboarded: null,
                  onboarding_data: null,
                  role: null,
                  status_details: null
                }
              : null,
            venues: event.venues && typeof event.venues === 'object' && !Array.isArray(event.venues)
              ? {
                  id: event.venues.id || '',
                  name: event.venues.name || '',
                  street: event.venues.street || '',
                  postal_code: event.venues.postal_code || '',
                  city: event.venues.city || '',
                  website: event.venues.website,
                  google_maps: event.venues.google_maps,
                  region: event.venues.region,
                  tags: event.venues.tags,
                  slug: event.venues.slug
                }
              : null,
            extra_info: event['Extra info'],
            google_maps: event.venues?.google_maps || null
          }));
          
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
  }, [eventType, currentEventId, userId, minResults, tags, vibe, startDate]); 
  
  return { relatedEvents, loading };
};
