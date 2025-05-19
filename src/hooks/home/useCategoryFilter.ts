
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { filterUpcomingEvents } from '@/utils/dateUtils';
import { processEventData } from './useEventDataProcessor';

export const useCategoryFilter = (
  setSearchResults: (results: Event[] | null) => void,
  setQueryOnlyResults: (results: Event[] | null) => void,
  setNoResultsFound: (value: boolean) => void,
  setIsSearching: (value: boolean) => void,
  setAiFeedback: (feedback: string | undefined) => void,
  fetchSimilarResults: (query: string) => Promise<void>,
  fetchQueryOnlyResults: (query: string) => Promise<void>
) => {
  // Filter by selected categories
  const handleCategoryFilter = async (
    selectedEventTypes: string[],
    currentSearchQuery?: string
  ) => {
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
        
        if (currentSearchQuery) {
          await fetchQueryOnlyResults(currentSearchQuery);
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

  return { handleCategoryFilter };
};
