
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';

export const useEventSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Event[]>([]);

  const searchEvents = async (query: string, filters?: {
    eventTypes?: string[];
    venues?: string[];
    dateRange?: { from: Date; to: Date };
  }): Promise<Event[]> => {
    if (!query.trim()) {
      return [];
    }

    setIsSearching(true);
    
    try {
      let queryBuilder = supabase
        .from('events')
        .select(`
          *,
          venues:venue_id(*),
          creator:profiles(*),
          event_rsvps(*)
        `);

      // Add text search
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,event_category.ilike.%${query}%`
      );

      // Add filters if provided
      if (filters?.eventTypes && filters.eventTypes.length > 0) {
        queryBuilder = queryBuilder.in('event_category', filters.eventTypes);
      }

      if (filters?.venues && filters.venues.length > 0) {
        queryBuilder = queryBuilder.in('venue_id', filters.venues);
      }

      if (filters?.dateRange) {
        queryBuilder = queryBuilder
          .gte('start_date', filters.dateRange.from.toISOString().split('T')[0])
          .lte('start_date', filters.dateRange.to.toISOString().split('T')[0]);
      }

      const { data, error } = await queryBuilder
        .order('start_date', { ascending: true })
        .limit(20);

      if (error) {
        console.error('Search error:', error);
        return [];
      }

      // Process the results
      const events: Event[] = data?.map(eventData => ({
        id: eventData.id,
        title: eventData.title,
        description: eventData.description || '',
        location: eventData.location,
        event_category: eventData.event_category,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        created_at: eventData.created_at,
        updated_at: eventData.updated_at,
        image_urls: eventData.image_urls || [],
        attendees: {
          going: eventData.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going')?.length || 0,
          interested: eventData.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested')?.length || 0
        },
        rsvp_status: null,
        area: eventData.area,
        google_maps: eventData.venues?.google_maps || eventData.google_maps,
        organizer_link: eventData.organizer_link,
        organiser_name: eventData.organiser_name,
        booking_link: eventData.booking_link,
        creator: eventData.creator || null,
        venues: eventData.venues || null,
        venue_id: eventData.venue_id,
        fee: eventData.fee,
        extra_info: eventData.extra_info,
        tags: eventData.tags || [],
        coordinates: eventData.coordinates,
        created_by: eventData.created_by,
        vibe: eventData.vibe,
        slug: eventData.slug,
        destination: eventData.destination,
        recurring_count: eventData.recurring_count,
        cover_image: eventData.cover_image,
        share_image: eventData.share_image,
        going_count: eventData.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going')?.length || 0,
        interested_count: eventData.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested')?.length || 0
      })) || [];

      setSearchResults(events);
      return events;

    } catch (error) {
      console.error('Unexpected search error:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  return {
    searchEvents,
    clearSearch,
    isSearching,
    searchResults
  };
};
