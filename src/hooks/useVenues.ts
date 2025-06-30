
import { useQuery } from '@tanstack/react-query';
import { Venue } from '@/types';
import { supabase } from '@/lib/supabase';

const fetchVenues = async (): Promise<Venue[]> => {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching venues:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useVenues = () => {
  const { data: venues, isLoading, error, isSuccess, refetch } = useQuery<Venue[], Error>({
    queryKey: ['venues'],
    queryFn: fetchVenues,
  });

  return { venues: venues || [], isLoading, error, isSuccess, refetch };
};
