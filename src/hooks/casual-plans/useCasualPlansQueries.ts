
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useCasualPlansQueries = (enabled: boolean = true) => {
  // Fetch casual plans
  const { 
    data: rawPlans, 
    isLoading: plansLoading, 
    error: plansError,
    refetch: refetchPlans
  } = useQuery({
    queryKey: ['casual-plans'],
    queryFn: async () => {
      console.log('Fetching casual plans...');
      const { data, error } = await supabase
        .from('casual_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching casual plans:', error);
        throw error;
      }
      
      console.log('Fetched casual plans:', data);
      return data;
    },
    enabled,
  });

  // Fetch attendees
  const { 
    data: rawAttendees, 
    isLoading: attendeesLoading, 
    error: attendeesError,
    refetch: refetchAttendees
  } = useQuery({
    queryKey: ['casual-plan-attendees'],
    queryFn: async () => {
      console.log('Fetching casual plan attendees...');
      const { data, error } = await supabase
        .from('casual_plan_attendees')
        .select('*');
      
      if (error) {
        console.error('Error fetching attendees:', error);
        throw error;
      }
      
      console.log('Fetched attendees:', data);
      return data;
    },
    enabled,
  });

  // Fetch interests
  const { 
    data: rawInterests, 
    isLoading: interestsLoading, 
    error: interestsError,
    refetch: refetchInterests
  } = useQuery({
    queryKey: ['casual-plan-interests'],
    queryFn: async () => {
      console.log('Fetching casual plan interests...');
      const { data, error } = await supabase
        .from('casual_plan_interests')
        .select('*');
      
      if (error) {
        console.error('Error fetching interests:', error);
        throw error;
      }
      
      console.log('Fetched interests:', data);
      return data;
    },
    enabled,
  });

  // Fetch profiles
  const { 
    data: profiles, 
    isLoading: profilesLoading, 
    error: profilesError,
    refetch: refetchProfiles
  } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      console.log('Fetching profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url');
      
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      
      console.log('Fetched profiles:', data);
      return data;
    },
    enabled,
  });

  const isLoading = plansLoading || attendeesLoading || interestsLoading || profilesLoading;
  const error = plansError || attendeesError || interestsError || profilesError;

  // Combined refetch function
  const refetch = async () => {
    await Promise.all([
      refetchPlans(),
      refetchAttendees(), 
      refetchInterests(),
      refetchProfiles()
    ]);
  };

  return {
    rawPlans,
    rawAttendees,
    rawInterests,
    profiles,
    isLoading,
    error,
    refetch
  };
};
