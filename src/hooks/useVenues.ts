
import { useState, useEffect } from 'react';
import { Venue } from '@/types';
import { supabase } from '@/lib/supabase';

export const useVenues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        setVenues(data || []);
      } catch (err) {
        console.error('Error fetching venues:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return { venues, isLoading, error };
};
