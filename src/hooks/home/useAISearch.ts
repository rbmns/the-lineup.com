
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { filterUpcomingEvents } from '@/utils/dateUtils';
import { processEventData } from './useEventDataProcessor';
import { useSearchTracking } from './useSearchTracking';

export const useAISearch = (
  userId: string | undefined,
  setSearchResults: (results: Event[] | null) => void,
  setNoResultsFound: (value: boolean) => void,
  setIsSearching: (value: boolean) => void,
  setAiSearchFilter: (filter: any) => void,
  setAiFeedback: (feedback: string | undefined) => void,
  setSelectedEventTypes: (types: string[]) => void,
  setIsAiSearching: (value: boolean) => void,
  fetchQueryOnlyResults: (query: string) => Promise<void>,
  fetchSimilarResults: (query: string) => Promise<void>
) => {
  const { trackSearch } = useSearchTracking(userId);

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

  return { handleAiSearch };
};
