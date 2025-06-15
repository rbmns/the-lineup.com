
import React, { createContext, useState, useContext, useCallback } from 'react';
import { Event, UserProfile } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  safeGet, 
  safeSpread, 
  hasProperty, 
  safeGetNested,
  forceTypeCast,
  asEqParam
} from '@/utils/supabaseTypeUtils';

interface SearchResult {
  id: string;
  type: 'event' | 'profile' | 'location';
  title?: string;
  username?: string;
  event_category?: string;
  location?: string;
  categories?: string[];
  keywords?: string[];
  tagline?: string;
  status?: string;
  [key: string]: any;
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  similarResults: SearchResult[];
  setSimilarResults: (results: SearchResult[]) => void;
  searchByLocation: (location: string) => Promise<void>;
  searchByCategory: (category: string) => Promise<void>;
  searchByKeyword: (keyword: string) => Promise<void>;
  advancedSearch: (params: {
    term?: string;
    location?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  performSearch: (term: string) => Promise<SearchResult[]>;
  trackSearch: (term: string) => Promise<void>;
  trackClick: (searchTerm: string, resultId: string, resultType: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [similarResults, setSimilarResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const trackSearch = useCallback(async (term: string) => {
    try {
      await fetch('/api/track-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession()}`
        },
        body: JSON.stringify({
          query: term
        })
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  }, []);

  const trackClick = useCallback(async (searchTerm: string, resultId: string, resultType: string) => {
    try {
      await fetch('/api/track-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession()}`
        },
        body: JSON.stringify({
          query: searchTerm,
          resultId,
          resultType,
          clicked: true
        })
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  }, []);

  const performSearch = useCallback(async (term: string): Promise<SearchResult[]> => {
    if (!term.trim()) return [];
    
    setIsSearching(true);
    try {
      console.log('Performing search with term:', term);
      
      await trackSearch(term);
      
      // Search events by title, description, event_category, or destination
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*, venue_id(*)')
        .or(`title.ilike.%${term}%,description.ilike.%${term}%,event_category.ilike.%${term}%,destination.ilike.%${term}%`)
        .order('start_date', { ascending: true });
        
      if (eventError) throw eventError;
      
      const results = (eventData || []).map(event => {
        return {
          ...event,
          type: 'event' as const,
        };
      });
      
      console.log('Search results found:', results.length);
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Error in performSearch:', error);
      toast.error('Search failed', {
        description: 'Unable to process your search query.'
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [trackSearch]);

  const searchByLocation = useCallback(async (location: string) => {
    setIsSearching(true);
    setSearchTerm(location);
    
    try {
      const results = await performSearch(location);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  }, [performSearch]);

  const searchByCategory = useCallback(async (category: string) => {
    setIsSearching(true);
    setSearchTerm(category);
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .eq('event_category', asEqParam(category))
        .order('start_date', { ascending: true });
        
      if (error) throw error;
      
      const results: SearchResult[] = (data || []).map(item => {
        const venuesData = item && hasProperty(item, 'venues') ? forceTypeCast(item.venues) : null;
        const locationValue = venuesData && hasProperty(venuesData, 'city') ? 
          forceTypeCast(safeGet(venuesData, 'city', 'Location not specified')) : 
          'Location not specified';
        
        return { 
          ...forceTypeCast<any>(item), 
          type: 'event' as const,
          location: locationValue
        };
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error in searchByCategory:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const searchByKeyword = useCallback(async (keyword: string) => {
    setIsSearching(true);
    setSearchTerm(keyword);
    
    try {
      const results = await performSearch(keyword);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  }, [performSearch]);

  const advancedSearch = useCallback(async (params: {
    term?: string;
    location?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setIsSearching(true);
    if (params.term) setSearchTerm(params.term);
    
    try {
      let query = supabase.from('events').select(`
        *,
        creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
        venues:venue_id(*),
        event_rsvps(id, user_id, status)
      `);
      
      if (params.term) {
        query = query.or(`title.ilike.%${params.term}%,description.ilike.%${params.term}%,event_category.ilike.%${params.term}%`);
      }
      
      if (params.location) {
        query = query.ilike('venues.city', `%${params.location}%`);
      }
      
      if (params.category) {
        query = query.eq('event_category', asEqParam(params.category));
      }
      
      if (params.startDate) {
        query = query.gte('start_date', params.startDate);
      }
      
      if (params.endDate) {
        query = query.lte('end_date', params.endDate);
      }
      
      query = query.order('start_date', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const results: SearchResult[] = (data || []).map(item => {
        const venuesData = item && hasProperty(item, 'venues') ? forceTypeCast(item.venues) : null;
        const locationValue = venuesData && hasProperty(venuesData, 'city') ? 
          forceTypeCast(safeGet(venuesData, 'city', 'Location not specified')) : 
          'Location not specified';
        
        return { 
          ...forceTypeCast<any>(item), 
          type: 'event' as const,
          location: locationValue
        };
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error in advancedSearch:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      searchResults,
      setSearchResults,
      isSearching,
      setIsSearching,
      similarResults,
      setSimilarResults,
      searchByLocation,
      searchByCategory,
      searchByKeyword,
      advancedSearch,
      performSearch,
      trackSearch,
      trackClick
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
