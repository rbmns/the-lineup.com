
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useProfileStatuses = () => {
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('status')
          .not('status', 'is', null)
          .then(result => {
            // Get unique statuses
            const uniqueStatuses = [...new Set(result.data?.map(r => r.status))];
            return { data: uniqueStatuses, error: result.error };
          });

        if (error) throw error;
        
        if (data) {
          setStatusOptions(data);
        }
      } catch (error) {
        console.error('Error fetching status options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusOptions();
  }, []);

  return { statusOptions, loading };
};
