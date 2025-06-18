
import React, { createContext, useState, useContext, useCallback } from 'react';
import { Event, UserProfile, Venue } from '@/types';
import { CasualPlan } from '@/types/casual-plans';
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
  type: 'event' | 'profile' | 'location' | 'venue' | 'casual_plan';
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
      console.log('Tracking search:', term);
      const { data: session } = await supabase.auth.getSession();
      
      await fetch('/api/track-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.session ? `Bearer ${session.session.access_token}` : ''
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
      const { data: session } = await supabase.auth.getSession();
      
      await fetch('/api/track-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.session ? `Bearer ${session.session.access_token}` : ''
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
      console.log('Performing comprehensive search with term:', term);
      
      await trackSearch(term);
      
      const searchPattern = `%${term.toLowerCase()}%`;
      
      // Search events with comprehensive field coverage
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          venue_id:venues(*),
          creator:profiles(id, username, avatar_url, email, location, status, tagline),
          event_rsvps(id, user_id, status)
        `)
        .or(`title.ilike.${searchPattern},description.ilike.${searchPattern},destination.ilike.${searchPattern},vibe.ilike.${searchPattern},event_category.ilike.${searchPattern},tags.ilike.${searchPattern},area.ilike.${searchPattern},organiser_name.ilike.${searchPattern}`)
        .eq('status', 'published')
        .order('start_date', { ascending: true });

      console.log('Event search query result:', eventData?.length || 0, 'events found');
      if (eventError) {
        console.error('Event search error:', eventError);
      }

      // Search venues
      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .select('*')
        .or(`name.ilike.${searchPattern},city.ilike.${searchPattern},street.ilike.${searchPattern}`)
        .limit(20);

      console.log('Venue search result:', venueData?.length || 0, 'venues found');
      if (venueError) {
        console.error('Venue search error:', venueError);
      }

      // Search casual plans
      const { data: casualPlanData, error: casualPlanError } = await supabase
        .from('casual_plans')
        .select('*, creator_profile:profiles(id, username, avatar_url)')
        .or(`title.ilike.${searchPattern},description.ilike.${searchPattern},vibe.ilike.${searchPattern},location.ilike.${searchPattern}`)
        .limit(20);

      console.log('Casual plan search result:', casualPlanData?.length || 0, 'plans found');
      if (casualPlanError) {
        console.error('Casual plan search error:', casualPlanError);
      }

      // Search event categories
      const { data: categoryData, error: categoryError } = await supabase
        .from('event_categories')
        .select('*')
        .ilike('name', searchPattern)
        .limit(10);

      console.log('Category search result:', categoryData?.length || 0, 'categories found');
      if (categoryError) {
        console.error('Category search error:', categoryError);
      }

      // Search event vibes
      const { data: vibeData, error: vibeError } = await supabase
        .from('event_vibe')
        .select('*')
        .ilike('name', searchPattern)
        .limit(10);

      console.log('Vibe search result:', vibeData?.length || 0, 'vibes found');
      if (vibeError) {
        console.error('Vibe search error:', vibeError);
      }

      // Format event results
      const eventResults = (eventData || []).map(event => ({
        ...event,
        type: 'event' as const,
      }));

      // Format venue results
      const venueResults = (venueData || []).map(venue => ({
        ...venue,
        type: 'venue' as const,
        title: venue.name,
        location: venue.city,
      }));

      // Format casual plan results
      const casualPlanResults = (casualPlanData || []).map(plan => ({
        ...plan,
        type: 'casual_plan' as const,
      }));

      // If we found matching categories, also search for events in those categories
      let categoryEventResults: SearchResult[] = [];
      if (categoryData && categoryData.length > 0) {
        const categoryNames = categoryData.map(cat => cat.name);
        const { data: catEventData, error: catEventError } = await supabase
          .from('events')
          .select(`
            *,
            venue_id:venues(*),
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            event_rsvps(id, user_id, status)
          `)
          .in('event_category', categoryNames)
          .eq('status', 'published')
          .order('start_date', { ascending: true })
          .limit(10);

        if (!catEventError && catEventData) {
          categoryEventResults = catEventData.map(event => ({
            ...event,
            type: 'event' as const,
          }));
        }
      }

      // If we found matching vibes, also search for events with those vibes
      let vibeEventResults: SearchResult[] = [];
      if (vibeData && vibeData.length > 0) {
        const vibeNames = vibeData.map(vibe => vibe.name);
        const { data: vibeEventData, error: vibeEventError } = await supabase
          .from('events')
          .select(`
            *,
            venue_id:venues(*),
            creator:profiles(id, username, avatar_url, email, location, status, tagline),
            event_rsvps(id, user_id, status)
          `)
          .in('vibe', vibeNames)
          .eq('status', 'published')
          .order('start_date', { ascending: true })
          .limit(10);

        if (!vibeEventError && vibeEventData) {
          vibeEventResults = vibeEventData.map(event => ({
            ...event,
            type: 'event' as const,
          }));
        }
      }
      
      // Combine all results and remove duplicates
      const allResults = [
        ...eventResults,
        ...venueResults,
        ...casualPlanResults,
        ...categoryEventResults,
        ...vibeEventResults
      ];

      // Remove duplicates based on id and type
      const uniqueResults = allResults.filter((result, index, self) =>
        index === self.findIndex((r) => r.id === result.id && r.type === result.type)
      );
      
      console.log('Total unique search results found:', uniqueResults.length);
      setSearchResults(uniqueResults);
      return uniqueResults;
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
        .eq('status', 'published')
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
      `).eq('status', 'published');
      
      if (params.term) {
        const searchPattern = `%${params.term.toLowerCase()}%`;
        query = query.or(`title.ilike.${searchPattern},description.ilike.${searchPattern},destination.ilike.${searchPattern},vibe.ilike.${searchPattern},event_category.ilike.${searchPattern}`);
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
