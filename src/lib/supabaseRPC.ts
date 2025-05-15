
import { supabase } from '@/lib/supabase';

export const getProfileStatusOptions = async (): Promise<string[]> => {
  try {
    // Query distinct status values from profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('status')
      .not('status', 'is', null)
      .limit(50);

    // Extract unique values
    if (data && data.length > 0) {
      const uniqueStatuses = [...new Set(data.map(item => item.status))].filter(Boolean) as string[];
      return uniqueStatuses;
    }

    // Fallback to some standard options if we couldn't get data
    return ['Local', 'Digital Nomad', 'Tourist', 'Expat', 'Other'];
  } catch (error) {
    console.error('Error fetching enum values for profile status:', error);
    return ['Local', 'Digital Nomad', 'Tourist', 'Expat', 'Other'];
  }
};
