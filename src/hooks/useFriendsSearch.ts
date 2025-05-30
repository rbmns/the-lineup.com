
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types.d';

export const useFriendsSearch = (user: any, friends: UserProfile[] | undefined) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle search for new people - EXCLUDE current user
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || !user) return;
    
    setIsSearching(true);
    
    try {
      // Search for users by username or location
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .neq('id', user.id) // Exclude the current user
        .limit(10);
        
      if (error) throw error;
      
      // Filter out users who are already friends AND exclude current user
      const friendIds = friends?.map(f => f.id) || [];
      const filteredResults = (data || []).filter(profile => 
        !friendIds.includes(profile.id) && profile.id !== user.id
      );
      
      setSearchResults(filteredResults as UserProfile[]);
    } catch (error) {
      console.error('Error searching for users:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, user, friends]);

  // Handle search when typing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]);
    }
  };

  // Effect to trigger search when typing
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      handleSearch();
    }
  }, [searchQuery, handleSearch]);

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearchChange,
    setSearchQuery,
    setSearchResults
  };
};
