
import { useCallback } from 'react';
import { Event, UserProfile, Venue } from '@/types';
import { supabase } from '@/lib/supabase';
import { filterUpcomingEvents } from '@/utils/dateUtils';

export const useSearchAndFilter = (
  userId: string | undefined,
  setSearchResults: (results: Event[] | null) => void,
  setQueryOnlyResults: (results: Event[] | null) => void,
  setSimilarEvents: (results: Event[]) => void,
  setNoResultsFound: (value: boolean) => void,
  setIsSearching: (value: boolean) => void,
  setAiSearchFilter: (filter: any) => void,
  setAiFeedback: (feedback: string | undefined) => void,
  selectedEventTypes: string[],
  setSelectedEventTypes: (types: string[]) => void,
  setIsAiSearching: (value: boolean) => void
) => {
  // Process event data from Supabase response
  const processEventData = (event: any): Event => {
    const creatorProfile = event.creator && event.creator.length > 0 
      ? event.creator[0] as unknown as UserProfile
      : null;

    let venueData: Venue | null = null;
    
    if (event.venues && 
        typeof event.venues === 'object' && 
        event.venues !== null && 
        !Array.isArray(event.venues)) {
      venueData = {
        id: (event.venues as any)?.id || '',
        name: (event.venues as any)?.name || '',
        street: (event.venues as any)?.street || '',
        postal_code: (event.venues as any)?.postal_code || '',
        city: (event.venues as any)?.city || '',
        website: (event.venues as any)?.website,
        google_maps: (event.venues as any)?.google_maps,
        region: (event.venues as any)?.region,
        tags: (event.venues as any)?.tags
      };
    }
      
    return {
      id: event.id,
      title: event.title,
      description: event.description || '',
      location: event.location,
      event_type: event.event_type,
      start_time: event.start_time,
      end_time: event.end_time,
      created_at: event.created_at,
      updated_at: event.updated_at,
      image_urls: event.image_urls || [],
      attendees: {
        going: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going').length || 0,
        interested: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested').length || 0
      },
      rsvp_status: userId 
        ? (event.event_rsvps?.find((rsvp: any) => rsvp.user_id === userId)?.status as 'Interested' | 'Going' | undefined)
        : undefined,
      area: null,
      google_maps: venueData?.google_maps || null,
      organizer_link: event.organizer_link || null,
      creator: creatorProfile,
      venues: venueData,
      extra_info: event["Extra info"] || null,
      fee: event.fee,
      venue_id: event.venue_id,
      tags: event.tags ? (typeof event.tags === 'string' ? [event.tags] : event.tags) : []
    } as Event;
  };

  // Track search queries
  const trackSearch = async (term: string) => {
    try {
      await fetch('/api/track-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: term,
          search_user_id: userId || null
        })
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  };

  // AI-powered search
  const handleAiSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsAiSearching(true);
    setIsSearching(true);
    setNoResultsFound(false);

    try {
      console.log('Starting AI search for query:', searchQuery);
      
      await trackSearch(searchQuery);
      
      const response = await supabase.functions.invoke('ai-search', {
        body: JSON.stringify({ 
          query: searchQuery,
          languages: ['english', 'dutch']
        })
      });

      console.log('AI search response:', response);
      
      if (response.error) {
        throw new Error(`AI search failed: ${response.error.message}`);
      }

      const aiFilter = response.data;
      console.log('AI filter:', aiFilter);
      setAiSearchFilter(aiFilter);
      
      if (aiFilter.categories && aiFilter.categories.length > 0) {
        setSelectedEventTypes(aiFilter.categories);
      }
      
      if (aiFilter.feedback) {
        setAiFeedback(aiFilter.feedback);
      } else {
        setAiFeedback("I'm looking for events that match your search!");
      }

      const dutchToEnglish: {[key: string]: string} = {
        'lente': 'spring',
        'zomer': 'summer',
        'herfst': 'autumn',
        'winter': 'winter',
        'feest': 'party',
        'strand': 'beach',
        'muziek': 'music'
      };
      
      let enhancedQuery = searchQuery;
      Object.entries(dutchToEnglish).forEach(([dutch, english]) => {
        if (searchQuery.toLowerCase().includes(dutch)) {
          enhancedQuery += ` OR ${english}`;
        }
      });
      
      const searchTerms = searchQuery.split(' ').filter(term => term.length > 2);
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,event_type.ilike.%${searchQuery}%,tags.cs.{${enhancedQuery}}`)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedEvents: Event[] = data.map(processEventData);
        
        formattedEvents.sort((a, b) => {
          if (a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !b.title.toLowerCase().includes(searchQuery.toLowerCase())) return -1;
          if (!a.title.toLowerCase().includes(searchQuery.toLowerCase()) && b.title.toLowerCase().includes(searchQuery.toLowerCase())) return 1;
          
          const aRelevance = searchTerms.filter(term => 
            a.title.toLowerCase().includes(term.toLowerCase()) || 
            (a.description && a.description.toLowerCase().includes(term.toLowerCase()))
          ).length;
          
          const bRelevance = searchTerms.filter(term => 
            b.title.toLowerCase().includes(term.toLowerCase()) || 
            (b.description && b.description.toLowerCase().includes(term.toLowerCase()))
          ).length;
          
          if (aRelevance !== bRelevance) return bRelevance - aRelevance;
          
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        });
        
        const upcomingEvents = filterUpcomingEvents(formattedEvents);
        setSearchResults(upcomingEvents);
        console.log('Final search results:', upcomingEvents);

        await fetchQueryOnlyResults(searchQuery);

        if (upcomingEvents.length === 0) {
          setNoResultsFound(true);
          await fetchSimilarResults(searchQuery);
          setAiFeedback("No exact matches found for your search. Showing similar events that might interest you.");
        }
      } else {
        setNoResultsFound(true);
        setSearchResults([]);
        
        await fetchSimilarResults(searchQuery);
        
        if (!aiFilter.feedback) {
          setAiFeedback("No exact matches found for your search. Showing related events based on your interests.");
        }
      }
    } catch (error) {
      console.error('AI Search error:', error);
      setNoResultsFound(true);
      await fetchSimilarResults(searchQuery);
      setAiFeedback("No exact matches found for your search. Showing related events that might interest you.");
    } finally {
      setIsAiSearching(false);
      setIsSearching(false);
    }
  };

  // Fetch results that only match the query text
  const fetchQueryOnlyResults = async (query: string) => {
    try {
      const dutchToEnglish: {[key: string]: string} = {
        'lente': 'spring',
        'zomer': 'summer',
        'herfst': 'autumn',
        'winter': 'winter',
        'feest': 'party',
        'strand': 'beach',
        'muziek': 'music'
      };
      
      let enhancedQuery = query;
      Object.entries(dutchToEnglish).forEach(([dutch, english]) => {
        if (query.toLowerCase().includes(dutch)) {
          enhancedQuery += ` OR ${english}`;
        }
      });
      
      const searchTerms = query.split(' ').filter(term => term.length > 2);
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%,event_type.ilike.%${query}%,tags.cs.{${enhancedQuery}}`)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedEvents: Event[] = data.map(processEventData);
        
        const upcomingEvents = filterUpcomingEvents(formattedEvents);
        setQueryOnlyResults(upcomingEvents);
      } else {
        setQueryOnlyResults([]);
      }
    } catch (error) {
      console.error('Query-only search error:', error);
    }
  };

  // Fetch similar events when no exact matches are found
  const fetchSimilarResults = async (query: string) => {
    if (query.length < 3) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
            event_rsvps(id, user_id, status)
          `)
          .limit(6);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          processAndSetSimilarEvents(data);
        }
      } catch (error) {
        console.error('Similar results error (short query):', error);
      }
      return;
    }
    
    try {
      if (query.toLowerCase().includes('beach') || query.toLowerCase().includes('strand')) {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
            event_rsvps(id, user_id, status)
          `)
          .or('event_type.ilike.%Beach%,event_type.ilike.%Party%,title.ilike.%Beach%')
          .order('start_time', { ascending: true })
          .limit(6);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          processAndSetSimilarEvents(data);
          return;
        }
      }
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .or(`title.ilike.%${query.substring(0, 3)}%,description.ilike.%${query.substring(0, 3)}%,event_type.ilike.%${query.substring(0, 3)}%`)
        .order('start_time', { ascending: true })
        .limit(6);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        processAndSetSimilarEvents(data);
      } else {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
            event_rsvps(id, user_id, status)
          `)
          .order('start_time', { ascending: true })
          .limit(6);
          
        if (!fallbackError && fallbackData) {
          processAndSetSimilarEvents(fallbackData);
        }
      }
    } catch (error) {
      console.error('Similar results error:', error);
    }
  };

  // Process and set similar events
  const processAndSetSimilarEvents = (data: any[]) => {
    const formattedEvents: Event[] = data.map(processEventData);
    
    const upcomingEvents = filterUpcomingEvents(formattedEvents);
    
    if (upcomingEvents.length > 0) {
      const eventTypes = [...new Set(upcomingEvents.map(event => event.event_type).filter(Boolean))];
      if (eventTypes.length > 0 && !selectedEventTypes.length) {
        setSelectedEventTypes(eventTypes);
      }
    }
    
    setSimilarEvents(upcomingEvents);
  };

  // Filter by selected categories
  const handleCategoryFilter = async () => {
    if (selectedEventTypes.length === 0) {
      setSearchResults(null);
      setQueryOnlyResults(null);
      return;
    }
    
    setIsSearching(true);
    try {
      const selectedTypes = selectedEventTypes; // Store for reference
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
          event_rsvps(id, user_id, status)
        `)
        .in('event_type', selectedTypes as any[])
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedEvents: Event[] = data.map(processEventData);
        
        const upcomingEvents = filterUpcomingEvents(formattedEvents);
        setSearchResults(upcomingEvents);
        
        if (searchQuery) {
          await fetchQueryOnlyResults(searchQuery);
        }
        
        setNoResultsFound(upcomingEvents.length === 0);
        
        if (upcomingEvents.length > 0) {
          setAiFeedback(`Showing ${upcomingEvents.length} event${upcomingEvents.length === 1 ? '' : 's'} in the selected categories.`);
        } else {
          setAiFeedback("No exact match found but showing you related results.");
          await fetchSimilarResults(selectedTypes.join(' '));
        }
      } else {
        setSearchResults([]);
        setNoResultsFound(true);
        setAiFeedback("No exact match found but showing you related results.");
        await fetchSimilarResults(selectedTypes.join(' '));
      }
    } catch (error) {
      console.error('Category filter error:', error);
      
      await fetchSimilarResults(selectedEventTypes.join(' '));
    } finally {
      setIsSearching(false);
    }
  };

  // Submit search form
  const handleSearch = useCallback(async (e?: React.FormEvent, query?: string) => {
    if (e) e.preventDefault();
    
    // Use the passed query parameter or rely on closure to access searchQuery from parent component
    if (query) {
      await handleAiSearch(query);
    }
  }, []);

  return {
    handleAiSearch,
    fetchQueryOnlyResults,
    fetchSimilarResults,
    handleCategoryFilter,
    handleSearch,
    processEventData,
    trackSearch
  };
};
