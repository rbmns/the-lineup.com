import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { useMemo } from 'react';

interface EventBasedSuggestion {
  id: string;
  profile: Profile;
  commonEvents: number;
  sharedInterests: string[];
  lastEventTogether?: string;
}

const useEventBasedSuggestions = (currentUserId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['event-based-suggestions', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];

      // Get users who have RSVPed to the same events as the current user
      const { data: suggestions, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          avatar_url,
          email,
          location,
          location_category,
          status,
          status_details,
          tagline,
          created_at,
          updated_at,
          location_coordinates,
          location_lat,
          location_long,
          onboarded,
          onboarding_data,
          role
        `)
        .neq('id', currentUserId)
        .limit(10);

      if (error) throw error;
      return suggestions || [];
    },
    enabled: !!currentUserId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const processedSuggestions = useMemo(() => {
    if (!data) return [];
    
    return data.map((suggestion: any) => ({
      ...suggestion,
      profile: {
        id: suggestion.id,
        username: suggestion.username,
        avatar_url: suggestion.avatar_url,
        email: suggestion.email,
        location: suggestion.location,
        location_category: suggestion.location_category,
        status: suggestion.status,
        status_details: suggestion.status_details || null,
        tagline: suggestion.tagline,
        created_at: suggestion.created_at || new Date().toISOString(),
        updated_at: suggestion.updated_at || new Date().toISOString(),
        location_coordinates: suggestion.location_coordinates,
        location_lat: suggestion.location_lat,
        location_long: suggestion.location_long,
        onboarded: suggestion.onboarded,
        onboarding_data: suggestion.onboarding_data,
        role: suggestion.role
      } as Profile
    }));
  }, [data]);

  return {
    suggestions: processedSuggestions,
    isLoading,
    error
  };
};

export default useEventBasedSuggestions;
